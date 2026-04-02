<h1 align="center">💊 LowPharma — Online Pharmacy Management System</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-Frontend-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
</p>

<p align="center">
  A full-stack online pharmacy platform with <b>dual role access</b> (Customer & Pharmacist), prescription workflows, real-time order tracking, inventory management, and a rich analytics dashboard.
</p>

---

## ✨ Key Features

### 👤 Customer
- Role-based login/signup with JWT auth and forgot password
- Browse medicines by category with search autocomplete
- Prescription upload with **15-day validity** — reuse or upload new
- Cart with quantity controls, coupon codes, and multiple payment methods
- Full order lifecycle tracking: `Placed → Processing → Shipped → Out for Delivery → Delivered`
- Profile: order history, medical records, address management, change password

### 🏥 Pharmacist
- Inventory management with **low-stock alerts** (< 15 units)
- Add medicines with image upload and prescription-required toggle
- Prescription review — approve/deny with status tracking
- Order management with search, date filters, and approve/deny actions
- **Analytics Dashboard** — Sales Trend, Stock Turnover, Expiry Loss charts by date range
- CSV export and transaction revenue summary

### ⚙️ General
- Toast notifications for all key actions
- Fully responsive — desktop, tablet, mobile
- Environment-variable-based API URL (deployment-ready)
- Stock validation — orders rejected if insufficient inventory
- UML diagrams included (Use Case, Class, ER, Sequence, Activity)

---

## 🎨 Design System

```
--pink:       #FF1B8D   → Primary CTA, active states
--pink-light: #FFB3D9   → Borders, accents
--pink-pale:  #FFF0F7   → Hover backgrounds, panels
--dark:       #1A1A2E   → Text
--green:      #10B981   → Success
--red:        #EF4444   → Error, danger
--orange:     #F59E0B   → Warnings, pending
--blue:       #3B82F6   → Processing
```

Fonts: **Syne** (headings) + **Nunito** (body)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6 |
| **Styling** | Plain CSS with CSS Variables (fully responsive) |
| **Charts** | Chart.js + react-chartjs-2 |
| **HTTP** | Axios |
| **Backend** | FastAPI (Python 3.10+) |
| **Database** | SQLite + SQLAlchemy ORM |
| **Auth** | JWT (python-jose) + bcrypt |
| **File Upload** | python-multipart |

---

## 📁 Project Structure

```
LowPharma/
├── frontend/                    # React + Vite
│   ├── .env                     # VITE_API_URL config
│   └── src/
│       ├── components/          # Navbar, Footer
│       ├── pages/
│       │   ├── customer/        # Home, Search, Cart, Checkout, Profile...
│       │   └── pharmacist/      # Inventory, Orders, Dashboard, Prescriptions...
│       ├── context/             # AuthContext, CartContext, ToastContext
│       ├── api/                 # Axios instance with env-based API URL
│       └── styles/              # Global CSS with design variables
├── backend/                     # FastAPI
│   ├── app/
│   │   ├── routes/              # auth, medicines, cart, orders, prescriptions...
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── auth.py              # JWT + bcrypt
│   │   └── main.py              # App entry point
│   ├── uploads/                 # Prescription files & medicine images
│   └── seed.py                  # Database seeder
├── UI/                          # UI mockups / design references
└── UML/                         # Mermaid.js diagrams (5 diagrams)
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
python3 seed.py          # Seeds medicine data
python3 -m uvicorn app.main:app --reload --port 8000
```

API docs available at **http://localhost:8000/docs**

### 2. Frontend

```bash
cd frontend
# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📐 UML Diagrams

The `UML/` directory contains 5 Mermaid.js diagrams. Paste into [mermaid.live](https://mermaid.live) to render:

| Diagram | Description |
|---------|-------------|
| **Use Case** | All customer and pharmacist interactions |
| **Class** | Data models and relationships |
| **Sequence** | Order placement with prescription + address flow |
| **Activity** | Customer order flow and pharmacist workflows |
| **ER** | Full database schema with foreign key relationships |

---

## 👥 Team

| Member | Role |
|--------|------|
| **Abhineet Raj** | Full-stack development, backend API |
| **Gayathri Devi** | Frontend, UI design |
| **Aishani Mishra** | Frontend, testing |

---

## 👨‍💻 Author

**Abhineet Raj** · CS @ SRM Institute of Science & Technology
🌐 [Portfolio](https://aabhineet07-portfolio.netlify.app/) · 🐙 [GitHub](https://github.com/Abhineetraj07)

---

## 📄 License

MIT License
