# 🚀 Quick Deployment Guide

## Fastest Way to Deploy (5 Minutes)

### 1. Create GitHub Repository
```bash
cd "c:\Users\diona\OneDrive\Documentos\2nd comscie\Safety Incident Reporting App"
git init
git add .
git commit -m "Initial commit"
```

Go to GitHub.com → Create new repository → Copy the commands shown

### 2. Deploy Database (Railway)
1. Visit https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Provision MySQL"
4. Copy the connection details

### 3. Deploy Backend (Render)
1. Visit https://render.com
2. Sign in with GitHub  
3. Click "New +" → "Web Service"
4. Select your GitHub repo
5. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables from Railway MySQL
7. Deploy!

### 4. Deploy Frontend (Netlify)

**Option A: Using Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

**Option B: Using Netlify Dashboard**
1. Visit https://netlify.com
2. "Add new site" → "Import existing project"
3. Connect GitHub repo
4. Settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment variable**: `VITE_API_URL` = your Render backend URL
5. Deploy!

### 5. Done! 🎉

Your app is now live:
- **Frontend**: https://your-app.netlify.app
- **Backend**: https://your-app.onrender.com
- **API Docs**: https://your-app.onrender.com/docs

---

## Alternative: Deploy Frontend Now

You can deploy just the frontend right now (backend will run locally):

```bash
npm run build
netlify deploy --prod
```

The app will work but will need the backend running locally or deploy it later.

---

## Free Tier Limits

All platforms offer free tiers:
- **Netlify**: 100 GB bandwidth/month
- **Render**: 750 hours/month (1 app 24/7)
- **Railway**: $5 free credit/month

Your app will be free forever within these limits!

---

For detailed instructions, see **DEPLOYMENT_GUIDE.md**
