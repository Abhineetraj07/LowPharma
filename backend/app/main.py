from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from .database import engine, Base
from .routes import auth, medicines, cart, orders, prescriptions, addresses, profile, pharmacist

Base.metadata.create_all(bind=engine)

app = FastAPI(title="LowPharma API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

app.include_router(auth.router)
app.include_router(medicines.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(prescriptions.router)
app.include_router(addresses.router)
app.include_router(profile.router)
app.include_router(pharmacist.router)


@app.get("/")
def root():
    return {"message": "LowPharma API is running"}
