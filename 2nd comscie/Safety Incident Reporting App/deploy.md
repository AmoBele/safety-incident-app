# 🚀 Deploy Your App in 3 Steps

## Step 1: Push to GitHub

```bash
# Navigate to project folder
cd "c:\Users\diona\OneDrive\Documentos\2nd comscie\Safety Incident Reporting App"

# Initialize git (if not already done)
git init
git add .
git commit -m "Ready for deployment"

# Create new repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/safety-incident-app.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend & Database

### A. Create Database (Railway - 2 minutes)
1. Go to https://railway.app
2. Sign in with GitHub
3. Click **"New Project"** → **"Provision MySQL"**
4. Click on MySQL service → **"Variables"** tab
5. **Copy these 5 values** (you'll need them):
   - MYSQLHOST
   - MYSQLPORT (usually 3306)
   - MYSQLUSER
   - MYSQLPASSWORD
   - MYSQLDATABASE

### B. Deploy Backend (Render - 3 minutes)
1. Go to https://render.com
2. Sign in with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Fill in:
   - **Name**: `safety-app-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`

6. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   DATABASE_HOST = <from Railway MYSQLHOST>
   DATABASE_PORT = <from Railway MYSQLPORT>
   DATABASE_USER = <from Railway MYSQLUSER>
   DATABASE_PASSWORD = <from Railway MYSQLPASSWORD>
   DATABASE_NAME = <from Railway MYSQLDATABASE>
   SECRET_KEY = CFZMstvSDVBlSotkdG_K0G9hNhiUKAETi1g499hB9vw
   ENCRYPTION_KEY = ZX8ei0vVzu3lIGn54PFPmcsHtwtFkxHWCclIdYLZ0uk
   ALGORITHM = HS256
   ACCESS_TOKEN_EXPIRE_MINUTES = 30
   CORS_ORIGINS = *
   HOST = 0.0.0.0
   ```

7. Click **"Create Web Service"**
8. Wait 5-10 minutes for deployment
9. **Copy your backend URL**: `https://safety-app-backend-XXXX.onrender.com`

## Step 3: Deploy Frontend (Netlify - 2 minutes)

### Option A: Netlify Dashboard (Easiest)
1. Go to https://app.netlify.com
2. Sign in with GitHub
3. Click **"Add new site"** → **"Import an existing project"**
4. Choose **GitHub** → Select your repository
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **"Show advanced"** → **"New variable"**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://safety-app-backend-XXXX.onrender.com` (your Render URL from Step 2)
7. Click **"Deploy site"**
8. Wait 2-3 minutes
9. **Your app is live!** 🎉

### Option B: Netlify CLI (Faster)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

When prompted:
- Build command: `npm run build`
- Publish directory: `dist`

Set environment variable after deployment:
```bash
netlify env:set VITE_API_URL "https://your-backend-url.onrender.com"
```

---

## ✅ Verification

Test your deployed app:

1. **Visit your Netlify URL**: `https://your-app-name.netlify.app`
2. **Register** a new account
3. **Login**
4. **Test features**:
   - Report an incident
   - Upload evidence
   - Activate Guardian
   - View healing hub

---

## 🎯 Your Live URLs

Save these:

- **App**: https://your-app.netlify.app
- **API**: https://safety-app-backend-XXXX.onrender.com
- **API Docs**: https://safety-app-backend-XXXX.onrender.com/docs
- **GitHub**: https://github.com/YOUR_USERNAME/safety-incident-app

---

## ⚠️ Important Notes

1. **Free tier sleep**: Render backend sleeps after 15 min of inactivity
   - First request takes 30-60 seconds to wake up
   - Normal behavior on free tier

2. **HTTPS Automatic**: Both Netlify and Render provide free SSL

3. **Auto-deploy**: Both platforms auto-deploy when you push to GitHub

4. **Database backup**: Export Railway database regularly

---

## 🔄 Update Your App

```bash
# Make changes
git add .
git commit -m "Update features"
git push

# Both frontend and backend will auto-deploy!
```

---

## 💡 Tips

- **Custom domain**: Add your own domain in Netlify/Render dashboards (free)
- **Monitor**: Check Render/Netlify dashboards for logs
- **Database**: Railway dashboard to view/edit database
- **Costs**: Everything is FREE within the limits!

---

## 🆘 Troubleshooting

**Backend not responding**
- Wait 60 seconds (might be waking up from sleep)
- Check Render logs for errors
- Verify all environment variables are set

**Frontend can't connect to backend**
- Verify `VITE_API_URL` is set correctly in Netlify
- Check backend CORS settings
- Open browser console for error details

**Database errors**
- Verify Railway MySQL is running
- Check environment variables match Railway credentials
- Ensure Railway has available credit ($5 free/month)

---

## 🎉 Done!

Your Safety Incident Reporting App is now:
- ✅ Live and accessible worldwide
- ✅ Running on free hosting
- ✅ Auto-deploying on git push
- ✅ SSL/HTTPS enabled
- ✅ Database backed up

Share your app URL with users! 🚀
