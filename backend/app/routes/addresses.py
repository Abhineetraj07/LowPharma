from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Address
from ..schemas import AddressCreate, AddressResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/addresses", tags=["addresses"])


@router.get("/", response_model=list[AddressResponse])
def get_addresses(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Address).filter(Address.user_id == user.id).all()


@router.post("/", response_model=AddressResponse)
def create_address(req: AddressCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    address = Address(user_id=user.id, **req.model_dump())
    db.add(address)
    db.commit()
    db.refresh(address)
    return address


@router.delete("/{address_id}")
def delete_address(address_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    addr = db.query(Address).filter(Address.id == address_id, Address.user_id == user.id).first()
    if not addr:
        raise HTTPException(status_code=404, detail="Address not found")
    db.delete(addr)
    db.commit()
    return {"message": "Address deleted"}
