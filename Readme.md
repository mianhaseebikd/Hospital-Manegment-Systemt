# MedHub — Enterprise Hospital Management System

Multi-tenant SaaS HMS / Hospital ERP built with **Node.js**, **Express**, **MongoDB**, **React**, **Tailwind CSS**, and **Socket.IO**.

## Features

- Multi-tenant architecture (Super Admin → multiple hospitals)
- Role-Based Access Control (8 roles)
- OPD token queue with real-time updates
- Emergency fast registration workflow
- Doctor consultation, prescriptions, lab/radiology orders
- Same-day follow-up logic (no extra consultation fee)
- IPD admission/discharge, nursing vitals & notes
- Pharmacy dispensing with automatic stock deduction
- Inventory, billing, HR/payroll, audit logs
- SMS/WhatsApp notification hooks (mock providers)
- Patient portal
- Print support for invoices

## Quick Start

### 1. Backend

```bash
cd server
cp .env.example .env
npm install
npm run seed
npm run dev
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173

## Demo Credentials (after seed)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@medhub.pk | SuperAdmin@123 |
| Hospital Admin | admin@medhub.pk | Admin@123 |
| FDO / Reception | fdo@medhub.pk | Fdo@123 |
| Doctor | doctor@medhub.pk | Doctor@123 |
| Nurse | nurse@medhub.pk | Nurse@123 |
| Lab Staff | lab@medhub.pk | Lab@123 |
| Pharmacy | pharmacy@medhub.pk | Pharmacy@123 |

After seeding, copy the **Hospital ID** from the console and ensure it is stored automatically on login (via JWT + `x-hospital-id` header).

## API Overview

| Module | Base Path |
|--------|-----------|
| Auth | `/api/auth` |
| Enterprise | `/api/enterprise` |
| Patients | `/api/patient` |
| Visits/Tokens | `/api/visits` |
| Emergency | `/api/emergency` |
| Lab | `/api/lab` |
| Pharmacy | `/api/pharmacy` |
| Inventory | `/api/inventory` |
| IPD | `/api/ipd` |
| Billing | `/api/billing` |
| HR | `/api/hr` |
| Dashboard | `/api/dashboard` |

## Architecture

```
server/src/
  models/       # MongoDB schemas (User, Patient, Visit, LabOrder, etc.)
  controllers/  # Request handlers
  routes/       # REST endpoints
  middlewares/  # Auth, RBAC, tenant context
  services/     # Audit, notifications
  socket.js     # Real-time events

client/src/
  contexts/     # Auth + Socket.IO
  pages/        # Role-based UI
  services/     # API client
```

## Real-Time Events (Socket.IO)

Clients join `hospital:{hospitalId}` room. Events include:
`token:created`, `token:status`, `emergency:created`, `lab:ordered`, `lab:completed`, `prescription:created`, `followup:created`

## License

ISC
