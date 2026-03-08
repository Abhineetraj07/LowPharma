import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Prescription, User
from ..schemas import PrescriptionResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/prescriptions", tags=["prescriptions"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload", response_model=PrescriptionResponse)
async def upload_prescription(
    file: UploadFile = File(...),
    doctor_name: str = Form(""),
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)

    prescription = Prescription(
        user_id=user.id,
        filename=filename,
        original_name=file.filename,
        doctor_name=doctor_name,
    )
    db.add(prescription)
    db.commit()
    db.refresh(prescription)
    return prescription


@router.get("/my", response_model=list[PrescriptionResponse])
def get_my_prescriptions(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Prescription).filter(Prescription.user_id == user.id).order_by(Prescription.uploaded_at.desc()).all()


@router.get("/pending", response_model=list[PrescriptionResponse])
def get_pending_prescriptions(user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "pharmacist":
        raise HTTPException(status_code=403, detail="Not authorized")
    presc = db.query(Prescription).filter(Prescription.status == "Pending").all()
    result = []
    for p in presc:
        resp = PrescriptionResponse.model_validate(p)
        result.append(resp)
    return result


@router.get("/all", response_model=list[PrescriptionResponse])
def get_all_prescriptions(user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "pharmacist":
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.query(Prescription).order_by(Prescription.uploaded_at.desc()).all()


@router.put("/{prescription_id}/approve")
def approve_prescription(prescription_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "pharmacist":
        raise HTTPException(status_code=403, detail="Not authorized")
    p = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Prescription not found")
    p.status = "Approved"
    db.commit()
    return {"message": "Prescription approved"}


@router.put("/{prescription_id}/deny")
def deny_prescription(prescription_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "pharmacist":
        raise HTTPException(status_code=403, detail="Not authorized")
    p = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Prescription not found")
    p.status = "Denied"
    db.commit()
    return {"message": "Prescription denied"}
