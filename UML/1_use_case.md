# Use Case Diagram

Paste the code below into https://mermaid.live to render.

```mermaid
graph TB
    subgraph LowPharma System
        UC1[Sign Up / Login]
        UC2[Forgot Password / Reset]
        UC3[Browse Medicines]
        UC4[Search & Filter Medicines]
        UC5[View Medicine Details]
        UC6[Add to Cart]
        UC7[Manage Cart]
        UC8[Upload Prescription]
        UC9[Select Past Prescription]
        UC10[Apply Coupon]
        UC11[Select Delivery Address]
        UC12[Checkout & Pay]
        UC13[Track Order]
        UC14[Manage Profile]
        UC15[Manage Addresses / Edit Address]
        UC16[View Order History]
        UC17[View Medical Records]
        UC18[Change Password]
        UC19[Manage Inventory]
        UC20[Add New Medicine with Image]
        UC21[Review Prescriptions]
        UC22[Manage Orders / Approve / Deny]
        UC23[View Dashboard & Reports]
        UC24[View Transactions]
        UC25[Export CSV]
        UC26[Filter Orders by Date]
    end

    Customer((Customer))
    Pharmacist((Pharmacist))

    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
    Customer --> UC6
    Customer --> UC7
    Customer --> UC8
    Customer --> UC9
    Customer --> UC10
    Customer --> UC11
    Customer --> UC12
    Customer --> UC13
    Customer --> UC14
    Customer --> UC15
    Customer --> UC16
    Customer --> UC17
    Customer --> UC18

    Pharmacist --> UC1
    Pharmacist --> UC19
    Pharmacist --> UC20
    Pharmacist --> UC21
    Pharmacist --> UC22
    Pharmacist --> UC23
    Pharmacist --> UC24
    Pharmacist --> UC25
    Pharmacist --> UC26
```
