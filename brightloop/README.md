# Brightloop - SaaS Subscription Management System

Hackathon project for B2B recurring billing, subscription lifecycles, invoicing, payments, and financial analytics.

## Tech Stack
- **Frontend**: React (Vite, JavaScript), Tailwind CSS v4 (`@tailwindcss/vite`), React Router, Recharts, Lucide React
- **Backend**: Node.js + Express (ES Modules), Prisma 6, PostgreSQL 16 via Docker Compose
- **Auth**: JWT + bcrypt with role-based access control (ADMIN, STAFF, CUSTOMER)

## Run Instructions

### 1. Start Database
```bash
docker compose up -d
```

### 2. Setup & Run Server
```bash
cd server
copy .env.example .env    # On Linux/macOS: cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run seed              # Seeds users, products, plans, and generates realistic invoices
npm run dev
```
Server runs on: `http://localhost:5000` (Health check: `http://localhost:5000/api/health`)

### 3. Setup & Run Client
Open a second terminal:
```bash
cd client
npm install
npm run dev
```
Client runs on: `http://localhost:5173`

## Seed Logins
- **Admin**: `admin@brightloop.com` / `Password@123`
- **Staff**: `staff@brightloop.com` / `Password@123`
- **Customer**: `customer1@example.com` / `Password@123`
