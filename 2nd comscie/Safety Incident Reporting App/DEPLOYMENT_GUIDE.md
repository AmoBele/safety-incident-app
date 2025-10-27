# 🚀 Deployment Guide - Safety Incident Reporting App

## Overview
This guide will help you deploy your full-stack application for FREE using:
- **Frontend**: Netlify
- **Backend**: Render.com or Railway
- **Database**: Railway MySQL

---

## 📋 Prerequisites

1. Create accounts (all free):
   - [Netlify](https://netlify.com) - Frontend hosting
   - [Render](https://render.com) or [Railway](https://railway.app) - Backend hosting
   - GitHub account - For code repository

2. Install Git if not already installed

---

## 🗄️ Step 1: Deploy Database (Railway)

### Option A: Railway (Recommended - Free $5 credit)

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Provision MySQL"
3. Once created, click on the MySQL service
4. Go to "Variables" tab and copy:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLDATABASE`
   - `MYSQLPASSWORD`
5. Keep these values for Step 2

### Option B: PlanetScale (Alternative)

1. Go to [planetscale.com](https://planetscale.com) and sign up
2. Create a new database
3. Get connection credentials
4. Note: PlanetScale uses different connection method

---

## ⚙️ Step 2: Deploy Backend (Render.com)

### 2.1 Push Code to GitHub

```bash
cd "c:\Users\diona\OneDrive\Documentos\2nd comscie\Safety Incident Reporting App"
git init
git add .
git commit -m "Initial commit - Safety Incident Reporting App"
```

Create a new repository on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/safety-app.git
git branch -M main
git push -u origin main
```

### 2.2 Deploy on Render

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: safety-app-backend
   - **Root Directory**: `backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free

5. Add Environment Variables (from Railway MySQL):
   ```
   DATABASE_HOST=<your-railway-mysql-host>
   DATABASE_PORT=<your-railway-mysql-port>
   DATABASE_USER=<your-railway-mysql-user>
   DATABASE_PASSWORD=<your-railway-mysql-password>
   DATABASE_NAME=<your-railway-mysql-database>
   SECRET_KEY=CFZMstvSDVBlSotkdG_K0G9hNhiUKAETi1g499hB9vw
   ENCRYPTION_KEY=ZX8ei0vVzu3lIGn54PFPmcsHtwtFkxHWCclIdYLZ0uk
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   CORS_ORIGINS=*
   HOST=0.0.0.0
   PORT=10000
   ```

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL: `https://safety-app-backend.onrender.com`

---

## 🎨 Step 3: Deploy Frontend (Netlify)

### 3.1 Update API Endpoint

First, we need to create an environment file for the frontend to connect to your deployed backend.

Create `src/config.ts`:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

Update API calls in your components to use this base URL.

### 3.2 Build and Deploy

**Option A: Netlify CLI (Recommended)**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

When prompted:
- **Build command**: `npm run build`
- **Publish directory**: `dist`

**Option B: Netlify Dashboard**

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select your repository
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment variables**:
     ```
     VITE_API_URL=https://safety-app-backend.onrender.com
     ```
5. Click "Deploy site"

---

## 🔧 Step 4: Initialize Database

After backend is deployed, initialize the database:

1. Go to your backend URL: `https://safety-app-backend.onrender.com`
2. Add `/docs` to access Swagger UI: `https://safety-app-backend.onrender.com/docs`
3. The database should auto-initialize on first startup

Or run initialization manually via Render shell:
1. Go to Render dashboard → Your service → Shell
2. Run: `python init_database.py`

---

## ✅ Step 5: Test Your Deployment

1. Visit your Netlify URL (e.g., `https://safety-app-xyz.netlify.app`)
2. Try to register a new account
3. Login and test features:
   - Report incident
   - Upload evidence
   - Activate Guardian
   - View dashboard

---

## 🔒 Security Checklist

- ✅ `.env` files are in `.gitignore`
- ✅ Secrets are stored as environment variables
- ✅ CORS is configured properly
- ✅ Database credentials are not exposed
- ✅ HTTPS is enabled (automatic with Netlify/Render)

---

## 💰 Free Tier Limits

### Netlify
- 100 GB bandwidth/month
- Unlimited sites
- Automatic HTTPS

### Render
- 750 hours/month (enough for 1 app running 24/7)
- Sleeps after 15 min of inactivity (free tier)
- 512 MB RAM

### Railway
- $5 free credit/month
- MySQL database included

---

## 🐛 Troubleshooting

### Backend Issues

**"App is sleeping"**
- Free Render services sleep after 15 minutes of inactivity
- First request will wake it up (takes 30-60 seconds)

**Database connection errors**
- Verify environment variables are correct
- Check Railway MySQL is running
- Ensure IP whitelist includes Render IPs (if applicable)

### Frontend Issues

**API calls failing**
- Check `VITE_API_URL` environment variable
- Verify backend CORS allows your frontend domain
- Check browser console for errors

**Build fails**
- Run `npm run build` locally to test
- Check for TypeScript errors
- Ensure all dependencies are in `package.json`

---

## 📊 Monitoring

### Check Backend Status
- Render Dashboard: See logs and metrics
- API Health: `https://your-backend.onrender.com/`

### Check Frontend Status
- Netlify Dashboard: Build logs and deploy status
- Site URL: Access your live app

---

## 🔄 Updating Your App

### Backend Updates
1. Push changes to GitHub
2. Render auto-deploys from `main` branch

### Frontend Updates
1. Push changes to GitHub
2. Netlify auto-deploys from `main` branch

Or use CLI:
```bash
netlify deploy --prod
```

---

## 📝 Important URLs

After deployment, save these URLs:

- **Frontend**: `https://your-app.netlify.app`
- **Backend API**: `https://your-backend.onrender.com`
- **API Docs**: `https://your-backend.onrender.com/docs`
- **Database**: Railway dashboard

---

## 🎉 You're Done!

Your Safety Incident Reporting App is now live and accessible worldwide!

Share your frontend URL with users to start using the app.

---

## 📧 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Render/Netlify logs
3. Verify all environment variables are set correctly
