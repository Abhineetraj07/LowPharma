from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from ..database import get_db
from ..models import Medicine
from ..schemas import MedicineResponse, MedicineCreate
from ..auth import get_current_user

router = APIRouter(prefix="/api/medicines", tags=["medicines"])


@router.get("/", response_model=list[MedicineResponse])
def get_medicines(
    search: str = Query("", description="Search term"),
    category: str = Query("", description="Filter by category"),
    sort: str = Query("default", description="Sort: default, price_asc, price_desc, name"),
    db: Session = Depends(get_db),
):
    query = db.query(Medicine)

    if search:
        query = query.filter(
            or_(
                Medicine.name.ilike(f"%{search}%"),
                Medicine.brand.ilike(f"%{search}%"),
                Medicine.category.ilike(f"%{search}%"),
            )
        )

    if category and category != "All":
        query = query.filter(Medicine.category.ilike(f"%{category}%"))

    if sort == "price_asc":
        query = query.order_by(Medicine.mrp.asc())
    elif sort == "price_desc":
        query = query.order_by(Medicine.mrp.desc())
    elif sort == "name":
        query = query.order_by(Medicine.name.asc())

    return query.all()


@router.get("/suggestions")
def get_suggestions(q: str = Query(""), db: Session = Depends(get_db)):
    if not q:
        return []
    medicines = db.query(Medicine.name).filter(
        or_(
            Medicine.name.ilike(f"%{q}%"),
            Medicine.brand.ilike(f"%{q}%"),
            Medicine.category.ilike(f"%{q}%"),
        )
    ).limit(6).all()
    return [m.name for m in medicines]


@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    cats = db.query(Medicine.category).distinct().all()
    return ["All"] + [c[0] for c in cats if c[0]]


@router.get("/bestsellers", response_model=list[MedicineResponse])
def get_bestsellers(db: Session = Depends(get_db)):
    return db.query(Medicine).limit(10).all()


@router.get("/{medicine_id}", response_model=MedicineResponse)
def get_medicine(medicine_id: int, db: Session = Depends(get_db)):
    med = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not med:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Medicine not found")
    return med


@router.post("/", response_model=MedicineResponse)
def add_medicine(med: MedicineCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    medicine = Medicine(**med.model_dump())
    db.add(medicine)
    db.commit()
    db.refresh(medicine)
    return medicine
