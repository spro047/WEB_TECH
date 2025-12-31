# Deploy to Vercel

1.  **Commit Changes**:
    Push the updated configuration to GitHub:
    ```bash
    git add .
    git commit -m "Add Vercel configuration"
    git push
    ```

2.  **Vercel Dashboard**:
    - Log in to [Vercel](https://vercel.com).
    - Click **"Add New..."** -> **"Project"**.
    - Import your GitHub repository: `WEB_TECH`.

3.  **Project Configuration (IMPORTANT)**:
    - **Framework Preset**: Select "Other" (or leave default).
    - **Root Directory**: Click "Edit" and select `Travel_Planner` (the inner folder containing backend/frontend). **This is crucial.**
    - **Build Command**: Leave empty.
    - **Output Directory**: Leave empty/default.
    
4.  **Environment Variables**:
    - Expand "Environment Variables".
    - `MONGO_URI`: Add your MongoDB Atlas connection string. (Must be a cloud database URI, `localhost` will not work).
    - `JWT_SECRET`: Add a secret key (e.g., `mysecretkey`).

5.  **Deploy**:
    - Click **"Deploy"**.

6.  **Verify**:
    - Visit the generated URL.
    - Check if the site loads and if you can Log In (which tests the backend connection).
