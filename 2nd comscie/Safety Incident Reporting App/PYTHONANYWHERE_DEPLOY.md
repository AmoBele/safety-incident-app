# 🚀 PythonAnywhere Deployment Guide (FREE - No Credit Card)

## Step 1: Create PythonAnywhere Account

1. Go to https://www.pythonanywhere.com
2. Click **"Pricing & signup"**
3. Choose **"Create a Beginner account"** (FREE forever)
4. Fill in:
   - Username: `amobele` (or your choice)
   - Email: your email
   - Password: create a password
5. Click **"Register"**
6. Verify your email

---

## Step 2: Upload Your Backend Code

### Option A: Using Git (Recommended)

1. Open **"Consoles"** tab in PythonAnywhere
2. Click **"Bash"**
3. In the terminal, run:

```bash
cd ~
git clone https://github.com/AmoBele/safety-incident-app.git
cd safety-incident-app/backend
```

### Option B: Upload Files

1. Go to **"Files"** tab
2. Navigate to `/home/YOUR_USERNAME/`
3. Create folder `safety-app`
4. Upload all backend files

---

## Step 3: Install Dependencies

In the Bash console:

```bash
cd ~/safety-incident-app/backend
pip3 install --user -r requirements.txt
```

Wait 2-3 minutes for installation.

---

## Step 4: Set Up Environment Variables

1. In the Bash console:

```bash
cd ~/safety-incident-app/backend
nano .env
```

2. Paste your environment variables (from Railway):

```
DATABASE_HOST=<your Railway MySQL host>
DATABASE_PORT=<your Railway MySQL port>
DATABASE_USER=<your Railway MySQL user>
DATABASE_PASSWORD=<your Railway MySQL password>
DATABASE_NAME=<your Railway MySQL database>
SECRET_KEY=CFZMstvSDVBlSotkdG_K0G9hNhiUKAETi1g499hB9vw
ENCRYPTION_KEY=ZX8ei0vVzu3lIGn54PFPmcsHtwtFkxHWCclIdYLZ0uk
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=*
HOST=0.0.0.0
PORT=8000
```

3. Press `Ctrl+X`, then `Y`, then `Enter` to save

---

## Step 5: Initialize Database

In the Bash console:

```bash
cd ~/safety-incident-app/backend
python3 init_database.py
```

You should see: ✓ Database initialized successfully!

---

## Step 6: Create Web App

1. Go to **"Web"** tab
2. Click **"Add a new web app"**
3. Choose **"Manual configuration"**
4. Select **"Python 3.10"**
5. Click **"Next"**

---

## Step 7: Configure WSGI File

1. On the Web tab, scroll to **"Code"** section
2. Click on the WSGI configuration file link (e.g., `/var/www/YOUR_USERNAME_pythonanywhere_com_wsgi.py`)
3. **Delete all content** and replace with:

```python
import sys
import os

# Add your project directory to the sys.path
project_home = '/home/YOUR_USERNAME/safety-incident-app/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set environment variables
os.environ['DATABASE_HOST'] = 'your-railway-host'
os.environ['DATABASE_PORT'] = 'your-railway-port'
os.environ['DATABASE_USER'] = 'your-railway-user'
os.environ['DATABASE_PASSWORD'] = 'your-railway-password'
os.environ['DATABASE_NAME'] = 'your-railway-database'
os.environ['SECRET_KEY'] = 'CFZMstvSDVBlSotkdG_K0G9hNhiUKAETi1g499hB9vw'
os.environ['ENCRYPTION_KEY'] = 'ZX8ei0vVzu3lIGn54PFPmcsHtwtFkxHWCclIdYLZ0uk'
os.environ['ALGORITHM'] = 'HS256'
os.environ['ACCESS_TOKEN_EXPIRE_MINUTES'] = '30'
os.environ['CORS_ORIGINS'] = '*'

# Import your FastAPI app
from main import app as application
```

4. Replace `YOUR_USERNAME` with your PythonAnywhere username
5. Replace Railway credentials with your actual values
6. Click **"Save"**

---

## Step 8: Configure Virtual Environment (Optional but Recommended)

1. On the Web tab, scroll to **"Virtualenv"** section
2. Enter: `/home/YOUR_USERNAME/.virtualenvs/myenv`
3. Click to create it
4. In Bash console:

```bash
mkvirtualenv myenv --python=python3.10
pip install -r ~/safety-incident-app/backend/requirements.txt
```

---

## Step 9: Reload Web App

1. Go to **"Web"** tab
2. Scroll to top
3. Click the big green **"Reload"** button
4. Wait 30 seconds

---

## Step 10: Test Your Backend

Your backend is now live at:
**https://YOUR_USERNAME.pythonanywhere.com**

Test it:
1. Visit: `https://YOUR_USERNAME.pythonanywhere.com/`
2. Should see: `{"message": "SafeGuard AI API"}`
3. API Docs: `https://YOUR_USERNAME.pythonanywhere.com/docs`

---

## Step 11: Update Frontend to Use New Backend

1. Go to Vercel dashboard: https://vercel.com/dashboard
2. Select your `safety-incident-app` project
3. Go to **"Settings"** → **"Environment Variables"**
4. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://YOUR_USERNAME.pythonanywhere.com`
5. Click **"Save"**
6. Go to **"Deployments"** tab
7. Click the `...` menu on latest deployment
8. Click **"Redeploy"**

---

## ✅ Done!

Your fully functional website is now live:
- **Frontend**: https://safety-incident-app.vercel.app
- **Backend**: https://YOUR_USERNAME.pythonanywhere.com
- **Database**: Railway MySQL

Test everything:
1. Visit your frontend URL
2. Create an account
3. Login
4. Try all features

---

## 🔄 Updating Your App

### Update Backend:
```bash
cd ~/safety-incident-app
git pull
# Then click "Reload" on Web tab
```

### Update Frontend:
```bash
git push
# Vercel auto-deploys
```

---

## 🆘 Troubleshooting

### Error: "Something went wrong"
- Check error log on Web tab → "Error log"
- Verify all environment variables are set correctly
- Make sure database credentials are correct

### Backend not responding
- Click "Reload" button on Web tab
- Check that WSGI file is configured correctly
- Verify virtual environment is activated

### Database connection error
- Test Railway MySQL is running
- Verify DATABASE_HOST, PORT, USER, PASSWORD, NAME are correct
- Check Railway hasn't expired (free $5 credit)

---

## 📊 Free Tier Limits

PythonAnywhere Free:
- ✅ 512 MB disk space
- ✅ One web app
- ✅ HTTPS included
- ⚠️ App sleeps after 3 months of inactivity (just reload to wake)

---

**Need help? Let me know at any step!**
