from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import SignupRequest, LoginRequest, TokenResponse
from ..auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse)
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        username=req.username,
        email=req.email,
        password_hash=hash_password(req.password),
        role=req.role,
        name=req.username,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id})
    return TokenResponse(
        access_token=token,
        role=user.role,
        username=user.username,
        user_id=user.id,
    )


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.username == req.username) | (User.email == req.username)
    ).first()

    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({"sub": user.id})
    return TokenResponse(
        access_token=token,
        role=user.role,
        username=user.username,
        user_id=user.id,
    )
