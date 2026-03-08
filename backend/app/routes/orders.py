from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from ..database import get_db
from ..models import Order, OrderItem, CartItem, Medicine, Transaction, User
from ..schemas import OrderCreate, OrderResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.post("/", response_model=OrderResponse)
def create_order(req: OrderCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    cart_items = db.query(CartItem).filter(CartItem.user_id == user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    item_total = 0.0
    needs_prescription = False
    order_items = []

    for ci in cart_items:
        med = db.query(Medicine).filter(Medicine.id == ci.medicine_id).first()
        if med:
            price = med.mrp * ci.quantity
            item_total += price
            if med.requires_prescription:
                needs_prescription = True
            order_items.append(OrderItem(
                medicine_id=med.id,
                medicine_name=med.name,
                medicine_brand=med.brand,
                medicine_category=med.category,
                quantity=ci.quantity,
                price=price,
            ))
            med.quantity = max(0, med.quantity - ci.quantity)

    handling = 10.0
    discount = 50.0
    delivery = 40.0
    coupon_discount = 30.0 if req.coupon_code else 0.0
    total = item_total + handling - discount + delivery - coupon_discount

    order = Order(
        user_id=user.id,
        address_text=req.address_text,
        total_amount=total,
        handling_charges=handling,
        discount=discount,
        delivery_charges=delivery,
        coupon_code=req.coupon_code,
        coupon_discount=coupon_discount,
        payment_method=req.payment_method,
        payment_status="Successful",
        prescription_status="Pending Approval" if needs_prescription else "Not Required",
        delivery_stage="Placed",
    )
    db.add(order)
    db.flush()

    for oi in order_items:
        oi.order_id = order.id
        db.add(oi)

    transaction = Transaction(
        order_id=order.id,
        user_id=user.id,
        customer_name=user.name or user.username,
        amount=total,
        payment_method=req.payment_method,
        status="Successful" if req.payment_method != "Cash on Delivery" else "Pending",
    )
    db.add(transaction)

    db.query(CartItem).filter(CartItem.user_id == user.id).delete()
    db.commit()
    db.refresh(order)

    return _order_to_response(order, user)


@router.get("/my", response_model=list[OrderResponse])
def get_my_orders(user=Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.user_id == user.id).order_by(Order.created_at.desc()).all()
    return [_order_to_response(o, user) for o in orders]


@router.get("/all", response_model=list[OrderResponse])
def get_all_orders(user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "pharmacist":
        raise HTTPException(status_code=403, detail="Not authorized")
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    result = []
    for o in orders:
        customer = db.query(User).filter(User.id == o.user_id).first()
        result.append(_order_to_response(o, customer))
    return result


@router.put("/{order_id}/approve")
def approve_order(order_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "pharmacist":
        raise HTTPException(status_code=403, detail="Not authorized")
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.prescription_status = "Approved"
    order.delivery_stage = "Processing"
    db.commit()
    return {"message": "Order approved"}


@router.put("/{order_id}/deny")
def deny_order(order_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "pharmacist":
        raise HTTPException(status_code=403, detail="Not authorized")
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.prescription_status = "Rejected"
    order.delivery_stage = "Cancelled"
    db.commit()
    return {"message": "Order denied"}


def _order_to_response(order: Order, user) -> OrderResponse:
    return OrderResponse(
        id=order.id,
        user_id=order.user_id,
        address_text=order.address_text,
        total_amount=order.total_amount,
        handling_charges=order.handling_charges,
        discount=order.discount,
        delivery_charges=order.delivery_charges,
        coupon_code=order.coupon_code,
        coupon_discount=order.coupon_discount,
        payment_method=order.payment_method,
        payment_status=order.payment_status,
        prescription_status=order.prescription_status,
        delivery_stage=order.delivery_stage,
        created_at=order.created_at,
        items=[OrderItemResponse(
            id=i.id,
            medicine_name=i.medicine_name,
            medicine_brand=i.medicine_brand,
            medicine_category=i.medicine_category,
            quantity=i.quantity,
            price=i.price,
        ) for i in order.items],
        customer_name=user.name or user.username if user else "",
        customer_phone=user.mobile if user else "",
    )


from ..schemas import OrderItemResponse
