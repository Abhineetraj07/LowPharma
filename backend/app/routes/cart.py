from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import CartItem, Medicine
from ..schemas import CartItemAdd, CartItemUpdate
from ..auth import get_current_user

router = APIRouter(prefix="/api/cart", tags=["cart"])


@router.get("/")
def get_cart(user=Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(CartItem).filter(CartItem.user_id == user.id).all()
    result = []
    for item in items:
        med = db.query(Medicine).filter(Medicine.id == item.medicine_id).first()
        if med:
            result.append({
                "id": item.id,
                "medicine_id": med.id,
                "name": med.name,
                "brand": med.brand,
                "category": med.category,
                "price": med.mrp,
                "image_url": med.image_url,
                "quantity": item.quantity,
                "requires_prescription": med.requires_prescription,
            })
    return result


@router.post("/add")
def add_to_cart(req: CartItemAdd, user=Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(CartItem).filter(
        CartItem.user_id == user.id,
        CartItem.medicine_id == req.medicine_id,
    ).first()

    if existing:
        existing.quantity += req.quantity
    else:
        item = CartItem(user_id=user.id, medicine_id=req.medicine_id, quantity=req.quantity)
        db.add(item)

    db.commit()
    return {"message": "Added to cart"}


@router.put("/{item_id}")
def update_cart_item(item_id: int, req: CartItemUpdate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if req.quantity <= 0:
        db.delete(item)
    else:
        item.quantity = req.quantity

    db.commit()
    return {"message": "Cart updated"}


@router.delete("/{item_id}")
def remove_from_cart(item_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()
    return {"message": "Removed from cart"}


@router.delete("/")
def clear_cart(user=Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(CartItem).filter(CartItem.user_id == user.id).delete()
    db.commit()
    return {"message": "Cart cleared"}
