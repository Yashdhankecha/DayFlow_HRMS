# Dayflow HRMS - Implementation Guide

## Overview
Dayflow is a production-grade Human Resource Management System built with a scalable tech stack, ensuring strict security and enterprise requirements.

## Tech Stack
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL.
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion.
- **Security**: JWT (Access + Refresh), bcrypt, RBAC.

## Architecture & Features

### 1. Database Schema
We replaced the basic User model with a complex schema including:
- **User**: Authentication details (`loginId`, `password`, `role`).
- **Employee**: Professional details linked to User.
- **Department**: Organizational structure.
- **Attendance**: Daily logs.
- **LeaveRequest**: Leave management.
- **AuditLog**: Security tracking.
- **Payroll**: Salary processing.

### 2. Authentication Flow (Strict)
- **No Public Registration**: Only Admins can create users.
- **Auto-Generated IDs**: Logic implemented in `backend/src/utils/idGenerator.js`.
  - Format: `OI` + First2(Fn) + First2(Ln) + Year + Serial.
  - Example: `OIJO20240001`
- **First Login Enforement**: New users MUST change their password upon first login.
- **Security**: Access tokens (15m) and Refresh tokens (7d).

### 3. Setup Instructions

#### 1. Database Setup
Ensure you have PostgreSQL running.
Update `backend/.env` with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/dayflow_db?schema=public"
JWT_SECRET="your_super_secret_key"
JWT_REFRESH_SECRET="your_super_refresh_secret"
```

#### 2. Backend Setup
```bash
cd backend
npm install
# Initialize Database
npx prisma migrate dev --name init_hrms
# Seed Super Admin
npm run seed
# Start Server
npm run dev
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. How to Use

1. **Initial Login**:
   - Go to `http://localhost:5173/login`
   - Login ID: `ADMIN01`
   - Password: `Admin123!`

2. **Create Employee**:
   - As Admin, go to the **Employees** tab (logic located in `employeeController.js`).
   - Fill in details. The system will generate a Login ID (e.g., `OIJO20240001`) and a temporary strong password.
   - **Copy these credentials** (they are shown only once).

3. **Employee Login**:
   - Logout and use the new credentials.
   - You will be redirected to the **Change Password** screen.
   - You cannot access the dashboard until the password is changed.

## Project Structure
- `backend/src/controllers`: Core business logic (Employee, Auth).
- `backend/src/utils`: ID generators, Password helpers.
- `backend/prisma/schema.prisma`: The source of truth for data models.
- `frontend/src/context/AuthContext.jsx`: Manages auth state and token rotation.
- `frontend/src/layouts/DashboardLayout.jsx`: Dark SaaS-themed sidebar layout.
