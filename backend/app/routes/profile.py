from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import UserProfile, UpdateCustomerProfile, UpdatePharmacistProfile, ChangePassword
from ..auth import get_current_user, hash_password, verify_password

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.get("/", response_model=UserProfile)
def get_profile(user=Depends(get_current_user)):
    return user


@router.put("/customer")
def update_customer_profile(req: UpdateCustomerProfile, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if req.name is not None:
        user.name = req.name
    if req.mobile is not None:
        user.mobile = req.mobile
    db.commit()
    return {"message": "Profile updated"}


@router.put("/pharmacist")
def update_pharmacist_profile(req: UpdatePharmacistProfile, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if req.name is not None:
        user.name = req.name
    if req.email is not None:
        user.email = req.email
    if req.mobile is not None:
        user.mobile = req.mobile
    if req.pharmacy_name is not None:
        user.pharmacy_name = req.pharmacy_name
    if req.license_number is not None:
        user.license_number = req.license_number
    if req.pharmacy_address is not None:
        user.pharmacy_address = req.pharmacy_address
    if req.operating_hours is not None:
        user.operating_hours = req.operating_hours
    if req.contact_number is not None:
        user.contact_number = req.contact_number
    db.commit()
    return {"message": "Profile updated"}


@router.put("/change-password")
def change_password(req: ChangePassword, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(req.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    user.password_hash = hash_password(req.new_password)
    db.commit()
    return {"message": "Password changed"}
