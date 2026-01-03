# 🚀 Deployment Guide for DayFlow HRMS

This guide will help you deploy your backend to **Render** and connect it to your **Netlify** frontend.

---

## Part 1: Backend Deployment (Render)

1.  **Push your latest code to GitHub**. Make sure everything is committed.

2.  **Create a New Web Service on Render**:
    *   Go to [dashboard.render.com](https://dashboard.render.com/).
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository (`DayFlow_HRMS`).

3.  **Configure the Service**:
    *   **Name**: `dayflow-api` (or similar)
    *   **Region**: Choose the one closest to you (e.g., Singapore, Oregon).
    *   **Root Directory**: `server` (⚠️ IMPORTANT)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`

4.  **Add Environment Variables**:
    Scroll down to the **Environment Variables** section and add the following keys from your local `.env` file:

    | Key | Value |
    | :--- | :--- |
    | `DATABASE_URL` | `mongodb+srv://...` (Your actual MongoDB Atlas connection string) |
    | `JWT_SECRET` | `your_secret_key` (Copy this from your local .env) |
    | `NODE_ENV` | `production` |

5.  **Deploy**:
    *   Click **Create Web Service**.
    *   Wait for the build to finish. Once it says "Live", copy the **backend URL** (e.g., `https://dayflow-api.onrender.com`).

---

## Part 2: Frontend Configuration (Netlify)

Since your frontend is already on Netlify, you need to tell it where the backend is.

1.  **Update Frontend API URL**:
    *   Go to your local code: `client/src/services/api.js`.
    *   Change the `baseURL` to point to your new Render backend URL.

    **Option A: Hardcode (Easiest)**
    ```javascript
    const api = axios.create({
        baseURL: 'https://dayflow-api.onrender.com/api', // Repalce with your Render URL
    });
    ```

    **Option B: Environment Variable (Recommended)**
    *   In your `client` folder, create a `.env.production` file:
        ```env
        VITE_API_URL=https://dayflow-api.onrender.com/api
        ```
    *   Update `client/src/services/api.js`:
        ```javascript
        const api = axios.create({
            baseURL: import.meta.env.VITE_API_URL || '/api',
        });
        ```
    *   **On Netlify**, go to **Site Settings** -> **Environment variables** and add `VITE_API_URL` with your Render URL.

2.  **Handle Redirects (Netlify)**:
    *   If you are using React Router (which you are), you need to ensure Netlify redirects all traffic to `index.html`.
    *   Create a file named `_redirects` inside your `client/public` folder with this content:
        ```
        /*  /index.html  200
        ```

3.  **Redeploy Frontend**:
    *   Push these changes to GitHub. Netlify should auto-deploy.

---

## Part 3: Final Checks

1.  Open your Netlify app.
2.  Try to **Login** or **Sign Up**.
3.  Check the Network tab in your browser's developer tools (F12) to ensure requests are going to `https://dayflow-api.onrender.com/...` and NOT `localhost`.

🎉 **You are live!**
