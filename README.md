<div align="center">

# 🌟 DayFlow HRMS
### A Modern, Intelligent Human Resource Management System

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[**🔴 LIVE DEMO LINK**](https://dayflowhrms.netlify.app/)

*(Replace the link above with your actual deployment URL)*

<p align="center">
  <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1470&auto=format&fit=crop" alt="DayFlow HRMS Dashboard" width="800" style="border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
</p>

</div>

---

## 📖 About The Project

**DayFlow HRMS** is a feature-rich, production-ready Human Resource Management System designed to simplify the complexities of modern workforce management. From onboarding to payroll, DayFlow provides a seamless experience for both HR administrators and employees.

Built with the MERN stack (MongoDB, Express, React, Node.js), it prioritizes performance, security, and a beautiful, intuitive user interface.

### ✨ Key Features

#### 🛡️ Authentication & Security
*   **Secure Access:** Role-based authentication (HR, Employee, Manager) using JWT.
*   **Data Protection:** Bcrypt password hashing and protected API routes.

#### 👨‍💼 HR Dashboard
*   **Employee Management:** Add, edit, and manage employee records with ease.
*   **Attendance Tracking:** Real-time visibility into employee attendance and working hours.
*   **Leave Management:** Efficiently handle leave requests, approvals, and balances.
*   **Payroll System:** Streamlined payroll processing and salary management.
*   **Analytics:** Insightful overview of organization statistics.

#### 👷 Employee Portal
*   **Self-Service Dashboard:** Personal hub for quick access to vital information.
*   **Attendance History:** View personal attendance records and stats.
*   **Leave Requests:** Simple interface to apply for leaves and track status.
*   **Profile Management:** Update personal details and view employment info.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework:** React 19 (Vite)
*   **Styling:** Tailwind CSS, Framer Motion (Animations)
*   **Routing:** React Router DOM v7
*   **State/Data:** Axios, React Context API
*   **Icons:** Lucide React
*   **Notifications:** React Hot Toast

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (Mongoose ODM)
*   **Authentication:** JSON Web Tokens (JWT)
*   **Security:** Bcrypt, CORS, Helmet (recommended)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v16+)
*   MongoDB (Local or Atlas)
*   Git

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/dayflow-hrms.git
    cd DayFlow_HRMS
    ```

2.  **Install Dependencies**
    *   **Root (if applicable):** `npm install`
    *   **Server:**
        ```bash
        cd server
        npm install
        ```
    *   **Client:**
        ```bash
        cd ../client
        npm install
        ```

3.  **Environment Setup**
    Create a `.env` file in the `server` directory and add:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key
    ```
    *(Optional: Add client `.env` if needed)*

4.  **Run the Application**
    *   **Server:**
        ```bash
        cd server
        npm run dev
        ```
    *   **Client:**
        ```bash
        cd client
        npm run dev
        ```

5.  **Access the App**
    Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure

```bash
DayFlow_HRMS/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Global state (Auth)
│   │   ├── layouts/        # Dashboard & Page layouts
│   │   ├── pages/          # Application views (HR, Employee, Auth)
│   │   ├── routes/         # Route definitions & protection
│   │   └── App.jsx         # Main application entry
│   └── package.json
├── server/                 # Express Backend
│   ├── controllers/        # Request handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth & validation
│   └── server.js           # Server entry point
└── README.md
```

---

## 🤝 Contributors

Contributions are always welcome! detailed guide on how to contribute coming soon.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/Yashdhankecha">Yash Dhankecha</a></p>
</div>
