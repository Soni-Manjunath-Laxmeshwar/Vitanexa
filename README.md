# VitaNexa Healthcare Platform 🩺

> **TAGLINE:** Connecting Care. Improving Lives.

VitaNexa is an integrated digital healthcare platform that connects patients, doctors, hospitals, diagnostic laboratories, pharmacies, and healthcare administrators in one unified ecosystem.

---

## 🌟 Key Features & Core Modules

### 1. Patient App & Portal
- **Dashboard**: Personalized overview of upcoming appointments, active digital prescriptions, lab reports, and vitals summary.
- **Specialty & Doctor Search**: Filter by specialty, location, fee, availability, and consultation mode (in-person vs. online video).
- **Appointment Booking**: Real-time slot selection with automatic double-booking prevention.
- **Digital Medical Records**: Secure vault for uploading and organizing prescriptions, blood tests, X-rays, and discharge summaries.
- **Health & Vitals Tracker**: Log and visualize blood pressure, heart rate, weight, and blood glucose trends using charts.
- **Emergency SOS**: Immediate one-touch emergency alert, 112/102 guidance, emergency contact notifications, and nearest hospital navigation.

### 2. Doctor Portal
- **Clinical Dashboard**: Patient schedule management, consultation status tracking, and earnings overview.
- **Digital Consultation Notes**: Structured recorder for chief complaints, examination, diagnosis, and treatment plans.
- **Electronic Prescription Generator**: Issue digital prescriptions directly linked to patient records and pharmacy refills.
- **Patient History Access**: Secure role-gated access to authorized medical history.

### 3. VitaGuide AI Assistant
- Smart AI assistant built into the application for health education, appointment preparation, and medical terminology clarification.
- **Medical Safety Principles**: VitaGuide strictly provides informational assistance only. It does not independently diagnose diseases or prescribe treatment, and prominently directs users to emergency services for urgent symptoms.

### 4. Enterprise Portals (Hospital, Lab, Pharmacy & System Admin)
- **Hospital Portal**: Manage affiliated doctors, departments, and operational appointment analytics.
- **Laboratory Portal**: Diagnostic lab test management, patient booking requests, and test report uploads.
- **Pharmacy Portal**: Prescribed medicine inventory catalog, refill request tracking, and order management.
- **Admin Dashboard**: Comprehensive system metrics across all 6 user roles, pending doctor verification queue, and platform audit logs.

---

## 🔒 Technical Architecture & Security

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL ready
- **Authentication**: NextAuth.js v5 (JWT Session Strategy)
- **Security Control**:
  - Role-based Access Control (RBAC) across 6 distinct user roles: `PATIENT`, `DOCTOR`, `HOSPITAL_ADMIN`, `LAB_ADMIN`, `PHARMACY_ADMIN`, `SYSTEM_ADMIN`.
  - Sensitive record protection preventing unauthorized cross-user data access.
  - Audit logging for critical system transactions (`AuditLog` model).
  - Environment variables for secrets with zero hardcoded API keys.

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js (v18.0 or later)
- npm or yarn package manager

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/vitanexa/vitanexa.git
cd vitanexa
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="vitanexa-super-secret-key-change-in-production-32chars!"
```

### 3. Setup Database & Seed Synthetic Demo Data
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Synthetic Demo Credentials

| Role | Email | Password |
|---|---|---|
| **System Admin** | `admin@vitanexa.com` | `Admin@1234` |
| **Doctor** | `dr.sharma@vitanexa.com` | `Doctor@1234` |
| **Patient** | `patient@vitanexa.com` | `Patient@1234` |
| **Hospital Admin** | `hospital@vitanexa.com` | `Hospital@1234` |
| **Lab Admin** | `lab@vitanexa.com` | `Lab@1234` |
| **Pharmacy Admin** | `pharmacy@vitanexa.com` | `Pharmacy@1234` |

---

## 🧪 Testing Workflows Covered

- [x] Registration & Authentication (Role-based NextAuth v5)
- [x] Doctor Search & Filter (Specialty, Online vs In-person)
- [x] Appointment Booking & Double-booking Prevention
- [x] Appointment Cancellation & Rescheduling
- [x] Doctor Consultation Notes & Electronic Prescription Generation
- [x] Medical Records Upload & Privacy Access Control
- [x] Diagnostic Lab Reports & Share Functionality
- [x] Emergency SOS Alert & Hospital Route Navigation
- [x] Health Vitals Tracking & Recharts Visualizations
- [x] VitaGuide AI Assistant with Medical Safety Guardrails
