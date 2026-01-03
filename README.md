   # HackStack - Production Ready Hackathon Boilerplate

A complete, production-ready web application template designed for hackathons. Built with React (Vite), Node.js, Prisma, and PostgreSQL (or SQLite for dev).

## 🚀 Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- React Router DOM (Routing)
- Axios (API Integration)
- Lucide React (Icons)

**Backend:**
- Node.js & Express
- SQLite (Default for Dev) / PostgreSQL (Production)
- Prisma ORM
- JWT Authentication (Access + Refresh Tokens)
- Bcrypt (Password Hashing)

## 📂 Project Structure

```
root/
├── backend/            # Express Server & DB
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── prisma/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── prisma/         # Schema & Migrations
│   └── package.json
├── frontend/           # React Client
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🛠 Quick Start (Windows)

1. **Stop** any running terminals.
2. Double click **`setup.bat`** to install everything and set up the database (SQLite).
3. Double click **`start-dev.bat`** to run the app.

---

### 🔐 Auth System

The system uses **JWT (JSON Web Tokens)** with a secure Refresh Token rotation strategy.

1. **Register/Login**: Returns an `accessToken` (short-lived) and `refreshToken` (long-lived).
2. **Storage**: Both tokens are stored in `localStorage` (for hackathon simplicity). In a high-security real-world app, use `httpOnly` cookies for `refreshToken`.
3. **Interceptors**: Axios interceptors (`frontend/src/services/api.js`) automatically catch `401` errors, attempt to refresh the token using `refreshToken`, and retry the original request.

## 🎨 UI/UX Features

- **Glassmorphism**: Used on landing page cards and layouts.
- **Dark/Light Mode Ready**: Tailwind config is set up for dark mode extensions.
- **Animations**: Page elements fade in and slide up using Framer Motion.
- **Responsive**: Mobile-first design.

## 📝 API Endpoints

**Auth**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout

**Dashboard**
- `GET /api/dashboard/user` - Protected user route
- `GET /api/dashboard/admin` - Protected admin route (requires role=ADMIN)

---

**Happy Hacking! 🚀**
