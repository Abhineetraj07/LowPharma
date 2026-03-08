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


@router.get("/inventory")
def get_inventory(user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "pharmacist":
        raise HTTPException(status_code=403, detail="Not authorized")

    medicines = db.query(Medicine).all()
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
    from_date: str = Query("", description="Start date DD.MM.YYYY"),
    to_date: str = Query("", description="End date DD.MM.YYYY"),
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user.role != "pharmacist":
        raise HTTPException(status_code=403, detail="Not authorized")

    orders = db.query(Order).all()
    medicines = db.query(Medicine).all()

    total_sold = sum(m.quantity for m in medicines)
    total_expired = sum(1 for m in medicines if m.exp_date and _is_expired(m.exp_date))
    total_remaining = sum(m.quantity for m in medicines)
    total_stock = total_sold + total_expired + total_remaining or 1

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
            "sold": 50,
            "expired": 20,
            "remaining": 30,
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
    return db.query(Transaction).order_by(Transaction.created_at.desc()).all()


@router.get("/transactions/summary")
def get_transaction_summary(user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "pharmacist":
        raise HTTPException(status_code=403, detail="Not authorized")
    transactions = db.query(Transaction).all()
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

    medicines = db.query(Medicine).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Name", "Brand", "Quantity", "MRP", "Cost Per Unit", "Category", "Mfg Date", "Exp Date"])
    for m in medicines:
        writer.writerow([m.name, m.brand, m.quantity, m.mrp, m.cost_per_unit, m.category, m.mfg_date, m.exp_date])

    from fastapi.responses import StreamingResponse
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=inventory.csv"},
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
