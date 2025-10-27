# ⚡ Quick Start - 5 Minutes to Running App

## ✅ Prerequisites Checklist

Before you start, make sure you have:

- [ ] Python 3.8+ installed
- [ ] MySQL Server installed and **running**
- [ ] Node.js 16+ installed
- [ ] MySQL root password ready

## 🚀 Setup Steps (Run these in order)

### Step 1: Setup Backend (2 minutes)

```bash
setup_backend.bat
```

### Step 2: Configure Environment (1 minute)

1. Open `backend\.env` in any text editor
2. Set your MySQL password:
   ```
   DATABASE_PASSWORD=your_mysql_root_password
   ```
3. Generate and set secret keys:
   ```bash
   python -c "import secrets; print('SECRET_KEY:', secrets.token_urlsafe(32)); print('ENCRYPTION_KEY:', secrets.token_urlsafe(32))"
   ```
   Copy the output into `.env`

### Step 3: Create Database (30 seconds)

```bash
init_database.bat
```

### Step 4: Install Frontend (1 minute)

```bash
npm install
```

### Step 5: Start Everything (10 seconds)

```bash
start_all.bat
```

## 🎉 You're Done!

The app is now running at:

- 🌐 **Frontend:** http://localhost:3000
- 🔌 **Backend API:** http://localhost:8000  
- 📖 **API Docs:** http://localhost:8000/docs

## 🎯 First Steps in the App

1. Open http://localhost:3000
2. Click **"🚀 Try Demo Mode (No Login Required)"**
3. Explore the app!

OR

1. Click **"Don't have an account? Register"**
2. Create a real account (stored in encrypted MySQL database)
3. Login and use all features

## 💡 What You Can Do

### In the App:
- ✅ View safety heat map with your location
- ✅ Report incidents with encrypted storage
- ✅ Upload evidence files (encrypted)
- ✅ Chat with AI therapist
- ✅ Use panic button
- ✅ Read survivor stories
- ✅ Share in community hub

### With the API:
- ✅ Register users (passwords hashed with bcrypt)
- ✅ Login with JWT tokens
- ✅ Create encrypted incidents
- ✅ Store encrypted evidence
- ✅ All data encrypted with AES-256

## 🛠️ Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| MySQL connection error | Start MySQL service |
| Port 3000 in use | App auto-uses port 3001 |
| Backend won't start | Check `.env` file exists |
| Database error | Run `init_database.bat` again |
| Python not found | Add Python to PATH |

## 📚 Need More Help?

- **Full Guide:** [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Backend Docs:** [backend/README.md](backend/README.md)
- **Main README:** [README.md](README.md)

## 🔒 Security Note

Your app now has:
- ✅ AES-256 encryption for data
- ✅ Bcrypt password hashing  
- ✅ JWT authentication
- ✅ Secure MySQL storage

**All incident reports, evidence, and personal data are encrypted!**

---

**Total Setup Time: ~5 minutes**

**Have fun building and testing! 🎉**
