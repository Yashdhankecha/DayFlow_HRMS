# 🚀 Deployment Guide for DayFlow HRMS (Manual Upload)

Since you are uploading the `dist` folder manually to Netlify, follow these steps to ensure the Frontend connects to the Backend correctly.

## 1. Build the Frontend Locally
We have already configured `client/.env.production` to point to your live Render backend (`https://dayflow-hrms-99oy.onrender.com/api`).

You need to rebuild the project to "bake in" this URL.

1.  Open your terminal in the **client** folder.
2.  Run:
    ```bash
    npm run build
    ```
3.  This will create/update the `dist` folder.

## 2. Upload to Netlify
1.  Go to your **Netlify Dashboard**.
2.  Go to the **Deploys** tab of your site (`dayflowhrms`).
3.  Drag and drop the `client/dist` folder into the upload area.

## 3. Verify
Once uploaded:
1.  Open [https://dayflowhrms.netlify.app/](https://dayflowhrms.netlify.app/).
2.  Login.
3.  The request should correctly go to your Render backend.

---

**Note:** If you ever change the Backend URL, you must update `client/.env.production`, run `npm run build` again, and re-upload the `dist` folder.
