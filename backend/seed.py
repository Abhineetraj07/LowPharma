"""Run this once to seed the database with sample medicines."""
from app.database import engine, SessionLocal, Base
from app.models import Medicine

Base.metadata.create_all(bind=engine)

medicines = [
    Medicine(name="Dolo 650", brand="Micro Labs", quantity=200, mfg_date="01.01.2026", exp_date="01.01.2028", mrp=30, cost_per_unit=25, category="Pain Relief", requires_prescription=0),
    Medicine(name="Calpol 500", brand="GSK", quantity=150, mfg_date="15.02.2026", exp_date="15.02.2028", mrp=35, cost_per_unit=28, category="Pain Relief", requires_prescription=0),
    Medicine(name="Crocin Advance", brand="GSK", quantity=180, mfg_date="10.03.2026", exp_date="10.03.2028", mrp=28, cost_per_unit=22, category="Pain Relief", requires_prescription=0),
    Medicine(name="Azithromycin 500mg", brand="Cipla", quantity=80, mfg_date="12.12.2025", exp_date="12.12.2027", mrp=120, cost_per_unit=95, category="Antibiotics", requires_prescription=1),
    Medicine(name="Amoxicillin 250mg", brand="Ranbaxy", quantity=100, mfg_date="05.01.2026", exp_date="05.01.2028", mrp=85, cost_per_unit=65, category="Antibiotics", requires_prescription=1),
    Medicine(name="Ciprofloxacin Eye Drops", brand="Cipla", quantity=60, mfg_date="20.01.2026", exp_date="20.01.2027", mrp=300, cost_per_unit=250, category="Eye Drops", requires_prescription=0),
    Medicine(name="Optha Care", brand="Himalaya", quantity=45, mfg_date="01.02.2026", exp_date="01.02.2027", mrp=210, cost_per_unit=170, category="Eye Drops", requires_prescription=0),
    Medicine(name="Maxmoist Ultra", brand="Biocon", quantity=90, mfg_date="10.01.2026", exp_date="10.01.2027", mrp=79, cost_per_unit=60, category="Eye Drops", requires_prescription=0),
    Medicine(name="Benadryl Cough Syrup", brand="Johnson & Johnson", quantity=120, mfg_date="01.03.2026", exp_date="01.03.2028", mrp=150, cost_per_unit=120, category="Cough Syrup", requires_prescription=0),
    Medicine(name="Ciplo Cough Syrup", brand="Cipla", quantity=500, mfg_date="01.03.2026", exp_date="01.03.2028", mrp=90, cost_per_unit=70, category="Cough Syrup", requires_prescription=0),
    Medicine(name="Insulin Drip", brand="Cipla", quantity=100, mfg_date="21.02.2026", exp_date="21.02.2027", mrp=450, cost_per_unit=380, category="Insulin Therapy", requires_prescription=1),
    Medicine(name="Pantoprazole 40mg", brand="Sun Pharma", quantity=250, mfg_date="01.01.2026", exp_date="01.01.2028", mrp=65, cost_per_unit=50, category="Gastric", requires_prescription=0),
    Medicine(name="Moov Pain Relief", brand="Reckitt", quantity=300, mfg_date="15.01.2026", exp_date="15.01.2028", mrp=85, cost_per_unit=65, category="Pain Relief", requires_prescription=0),
    Medicine(name="Zerodol-P", brand="Ipca Labs", quantity=170, mfg_date="01.02.2026", exp_date="01.02.2028", mrp=95, cost_per_unit=75, category="Pain Relief", requires_prescription=0),
    Medicine(name="Saridon", brand="Bayer", quantity=220, mfg_date="10.01.2026", exp_date="10.01.2028", mrp=25, cost_per_unit=18, category="Pain Relief", requires_prescription=0),
    Medicine(name="Atorvastatin 10mg", brand="Pfizer", quantity=12, mfg_date="01.06.2025", exp_date="01.06.2027", mrp=180, cost_per_unit=140, category="Heart", requires_prescription=1),
    Medicine(name="Multivitamin Pack", brand="Revital", quantity=400, mfg_date="01.01.2026", exp_date="01.01.2028", mrp=250, cost_per_unit=200, category="Supplements", requires_prescription=0),
    Medicine(name="Citracin", brand="Lupin", quantity=8, mfg_date="01.07.2025", exp_date="31.07.2026", mrp=55, cost_per_unit=40, category="Antibiotics", requires_prescription=1),
    Medicine(name="Zoloft 50mg", brand="Pfizer", quantity=10, mfg_date="01.08.2025", exp_date="01.08.2026", mrp=320, cost_per_unit=280, category="Mental Health", requires_prescription=1),
    Medicine(name="Silverex Cream", brand="Dr. Reddy's", quantity=7, mfg_date="01.05.2025", exp_date="01.05.2026", mrp=400, cost_per_unit=350, category="Skin Care", requires_prescription=0),
    Medicine(name="Vicks VapoRub", brand="P&G", quantity=350, mfg_date="01.01.2026", exp_date="01.01.2028", mrp=45, cost_per_unit=35, category="Cold & Flu", requires_prescription=0),
    Medicine(name="Paracetamol 500mg", brand="Cipla", quantity=500, mfg_date="01.02.2026", exp_date="01.02.2028", mrp=15, cost_per_unit=10, category="Pain Relief", requires_prescription=0),
    Medicine(name="Cetirizine 10mg", brand="Sun Pharma", quantity=200, mfg_date="01.03.2026", exp_date="01.03.2028", mrp=20, cost_per_unit=14, category="Allergy", requires_prescription=0),
    Medicine(name="Omeprazole 20mg", brand="Dr. Reddy's", quantity=180, mfg_date="01.01.2026", exp_date="01.01.2028", mrp=45, cost_per_unit=35, category="Gastric", requires_prescription=0),
    Medicine(name="Metformin 500mg", brand="USV", quantity=14, mfg_date="01.04.2025", exp_date="01.04.2027", mrp=55, cost_per_unit=40, category="Diabetes", requires_prescription=1),
]

db = SessionLocal()
existing = db.query(Medicine).count()
if existing == 0:
    for m in medicines:
        db.add(m)
    db.commit()
    print(f"Seeded {len(medicines)} medicines.")
else:
    print(f"Database already has {existing} medicines. Skipping seed.")
db.close()
