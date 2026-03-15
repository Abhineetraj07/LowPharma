from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
import csv
import io

from ..database import get_db
from ..models import Medicine, Order, OrderItem, Transaction
from ..schemas import DashboardData, TransactionResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/pharmacist", tags=["pharmacist"])


def _pharmacist_order_ids(db: Session, pharmacist_id: int):
    """Subquery returning order IDs that contain this pharmacist's medicines."""
    return db.query(OrderItem.order_id).join(Medicine).filter(
        Medicine.pharmacist_id == pharmacist_id
    ).subquery()


@router.get("/inventory")
def get_inventory(user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "pharmacist":
        raise HTTPException(status_code=403, detail="Not authorized")

    medicines = db.query(Medicine).filter(Medicine.pharmacist_id == user.id).all()

    # Auto-delete expired medicines
    expired = [m for m in medicines if m.exp_date and _is_expired(m.exp_date)]
    for m in expired:
        db.delete(m)
    if expired:
        db.commit()
        medicines = [m for m in medicines if m not in expired]

    alerts = [
        {"name": m.name, "alert": f"{m.quantity} stock left" if m.quantity < 15 else "Expiry soon"}
        for m in medicines
        if m.quantity < 15 or (m.exp_date and _is_expiring_soon(m.exp_date))
    ]

    return {
        "medicines": [
            {
                "id": m.id,
                "name": m.name,
                "brand": m.brand,
                "quantity": m.quantity,
                "mfg_date": m.mfg_date,
                "exp_date": m.exp_date,
                "mrp": m.mrp,
                "cost_per_unit": m.cost_per_unit,
                "category": m.category,
            }
            for m in medicines
        ],
        "alerts": alerts,
    }


@router.get("/dashboard")
def get_dashboard(
    from_date: str = Query("", description="Start date YYYY-MM-DD"),
    to_date: str = Query("", description="End date YYYY-MM-DD"),
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user.role != "pharmacist":
        raise HTTPException(status_code=403, detail="Not authorized")

    order_ids_sq = _pharmacist_order_ids(db, user.id)
    query = db.query(Order).filter(Order.id.in_(order_ids_sq))
    if from_date:
        try:
            fd = datetime.strptime(from_date, "%Y-%m-%d")
            query = query.filter(Order.created_at >= fd)
        except ValueError:
            pass
    if to_date:
        try:
            td = datetime.strptime(to_date, "%Y-%m-%d") + timedelta(days=1)
            query = query.filter(Order.created_at < td)
        except ValueError:
            pass
    orders = query.all()
    medicines = db.query(Medicine).filter(Medicine.pharmacist_id == user.id).all()

    total_sold = sum(
        oi.quantity for o in orders for oi in o.items
    )
    total_expired = sum(m.quantity for m in medicines if m.exp_date and _is_expired(m.exp_date))
    total_remaining = sum(m.quantity for m in medicines if not (m.exp_date and _is_expired(m.exp_date)))

    now = datetime.utcnow()
    sales_trend = []
    for i in range(7):
        day = now - timedelta(days=6 - i)
        day_str = day.strftime("%a")
        day_total = sum(
            o.total_amount for o in orders
            if o.created_at and o.created_at.date() == day.date()
        )
        sales_trend.append({"day": day_str, "amount": day_total})

    expired_medicines = [m for m in medicines if m.exp_date and _is_expired(m.exp_date)]
    expiry_loss = [
        {"name": m.name, "loss": m.mrp * m.quantity}
        for m in expired_medicines[:7]
    ]

    total_revenue = sum(o.total_amount for o in orders if o.payment_status == "Successful")

    return {
        "sales_trend": sales_trend,
        "stock_turnover": {
            "sold": total_sold,
            "expired": total_expired,
            "remaining": total_remaining,
        },
        "expiry_loss": expiry_loss if expiry_loss else [
            {"name": "No data", "loss": 0}
        ],
        "total_revenue": total_revenue,
        "total_orders": len(orders),
    }


@router.get("/transactions", response_model=list[TransactionResponse])
def get_transactions(user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "pharmacist":
        raise HTTPException(status_code=403, detail="Not authorized")
    order_ids_sq = _pharmacist_order_ids(db, user.id)
    return db.query(Transaction).filter(
        Transaction.order_id.in_(order_ids_sq)
    ).order_by(Transaction.created_at.desc()).all()


@router.get("/transactions/summary")
def get_transaction_summary(user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "pharmacist":
        raise HTTPException(status_code=403, detail="Not authorized")
    order_ids_sq = _pharmacist_order_ids(db, user.id)
    transactions = db.query(Transaction).filter(Transaction.order_id.in_(order_ids_sq)).all()
    total_revenue = sum(t.amount for t in transactions if t.status == "Successful")
    successful = sum(1 for t in transactions if t.status == "Successful")
    pending = sum(1 for t in transactions if t.status == "Pending")
    return {
        "total_revenue": total_revenue,
        "successful_count": successful,
        "pending_count": pending,
    }


@router.get("/download-csv")
def download_csv(user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "pharmacist":
        raise HTTPException(status_code=403, detail="Not authorized")

    order_ids_sq = _pharmacist_order_ids(db, user.id)
    transactions = db.query(Transaction).filter(
        Transaction.order_id.in_(order_ids_sq)
    ).order_by(Transaction.created_at.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Txn ID", "Order ID", "Customer", "Amount", "Payment Method", "Status", "Date"])
    for t in transactions:
        writer.writerow([
            f"TXN-{t.id}",
            f"ORD-{t.order_id}",
            t.customer_name,
            t.amount,
            t.payment_method,
            t.status,
            t.created_at.strftime("%d/%m/%Y %H:%M") if t.created_at else "",
        ])

    from fastapi.responses import StreamingResponse
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=transactions.csv"},
    )


def _is_expiring_soon(exp_date_str: str) -> bool:
    try:
        for fmt in ["%d.%m.%Y", "%Y-%m-%d", "%d/%m/%Y"]:
            try:
                exp = datetime.strptime(exp_date_str, fmt)
                return (exp - datetime.utcnow()).days < 90
            except ValueError:
                continue
    except Exception:
        pass
    return False


def _is_expired(exp_date_str: str) -> bool:
    try:
        for fmt in ["%d.%m.%Y", "%Y-%m-%d", "%d/%m/%Y"]:
            try:
                exp = datetime.strptime(exp_date_str, fmt)
                return exp < datetime.utcnow()
            except ValueError:
                continue
    except Exception:
        pass
    return False
