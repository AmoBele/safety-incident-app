# 🚀 Complete Setup Guide - Safety Incident Reporting App

## Prerequisites

Before you begin, ensure you have:

- ✅ **Python 3.8+** installed ([Download](https://www.python.org/downloads/))
- ✅ **MySQL Server** installed and running ([Download](https://dev.mysql.com/downloads/mysql/))
- ✅ **Node.js** installed ([Download](https://nodejs.org/))

## Step-by-Step Setup

### 1️⃣ Setup Backend (Python + MySQL)

#### **Run the setup script:**
```bash
setup_backend.bat
```

This will:
- Check Python installation
- Install all Python dependencies
- Create `.env` configuration file

#### **Configure Environment:**

1. Open `backend\.env` in a text editor
2. Update these critical values:

```env
DATABASE_PASSWORD=your_mysql_root_password_here
SECRET_KEY=<generate-32-char-random-key>
ENCRYPTION_KEY=<generate-32-char-random-key>
```

#### **Generate Secure Keys:**

Run this Python command to generate secure keys:
```bash
python -c "import secrets; print('SECRET_KEY:', secrets.token_urlsafe(32)); print('ENCRYPTION_KEY:', secrets.token_urlsafe(32))"
```

Copy the generated keys into your `.env` file.

### 2️⃣ Initialize Database

#### **Make sure MySQL is running**, then run:
```bash
init_database.bat
```

This will:
- Create the `safety_app_db` database
- Create 5 tables with proper encryption setup:
  - `users` - User accounts
  - `incidents` - Incident reports (encrypted)
  - `evidence` - Evidence files (encrypted)
  - `safety_zones` - Map safety zones
  - `community_posts` - Community content (encrypted)

### 3️⃣ Setup Frontend (React)

#### **Install frontend dependencies:**
```bash
npm install
```

### 4️⃣ Start the Application

#### **Option A: Start Both Servers Separately**

**Terminal 1 - Backend:**
```bash
start_backend.bat
```
Backend runs on: http://localhost:8000

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend runs on: http://localhost:3000

#### **Option B: Start Everything at Once**

Create a new batch file `start_all.bat`:
```batch
@echo off
start "Backend Server" cmd /k start_backend.bat
timeout /t 3
start "Frontend Server" cmd /k npm run dev
```

Then just run:
```bash
start_all.bat
```

## 🔐 Security Configuration

Your app now has:

### **Backend Security:**
- ✅ AES-256 encryption for sensitive data
- ✅ Bcrypt password hashing
- ✅ JWT token authentication
- ✅ Secure MySQL database

### **Encrypted Data:**
- Incident descriptions
- Location addresses
- Evidence file paths
- Community posts

## 📚 Accessing the App

Once both servers are running:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs (Swagger UI)

## 🧪 Testing the Setup

### **Test Backend API:**

1. Go to http://localhost:8000/docs
2. Try the `/auth/register` endpoint to create a user
3. Use `/auth/login` to get a JWT token
4. Test authenticated endpoints

### **Test Frontend:**

1. Go to http://localhost:3000
2. Click **"🚀 Try Demo Mode"** for quick access
3. Or register a real account using the backend

## 🛠️ Troubleshooting

### **Backend Issues:**

**"Can't connect to MySQL"**
- Ensure MySQL service is running
- Check port 3306 is not blocked
- Verify DATABASE_PASSWORD in `.env`

**"Import errors"**
- Run: `pip install -r backend\requirements.txt`

**"Database already exists"**
- This is normal! The init script checks if tables exist
- It won't overwrite existing data

### **Frontend Issues:**

**"Port 3000 already in use"**
- Close other apps using port 3000
- Or the app will automatically use port 3001

**"Module not found"**
- Run: `npm install`
- Delete `node_modules` and run `npm install` again

## 📝 Development Workflow

### **Daily Development:**

1. Start MySQL service
2. Run `start_backend.bat`
3. Run `npm run dev`
4. Code & test!

### **Database Reset:**

If you need to reset the database:
```sql
DROP DATABASE safety_app_db;
```
Then run `init_database.bat` again.

⚠️ **Warning:** This deletes all data!

## 🎯 Quick Commands Reference

| Task | Command |
|------|---------|
| Setup backend | `setup_backend.bat` |
| Initialize database | `init_database.bat` |
| Start backend | `start_backend.bat` |
| Start frontend | `npm run dev` |
| Install frontend deps | `npm install` |
| View API docs | http://localhost:8000/docs |
| Generate keys | `python -c "import secrets; ..."` |

## 🔒 Important Security Notes

1. **Never commit `.env` file** to Git
2. **Rotate keys regularly** in production
3. **Use HTTPS** in production
4. **Backup database** regularly
5. **Keep dependencies updated**

## ✅ Verification Checklist

Before deploying or sharing:

- [ ] MySQL is running
- [ ] `.env` file is configured
- [ ] Database tables are created
- [ ] Backend starts without errors
- [ ] Frontend loads successfully
- [ ] Can register/login users
- [ ] Demo mode works
- [ ] Map displays correctly

## 📞 Need Help?

- Check `backend\README.md` for detailed backend docs
- Check API documentation at `/docs`
- Verify all environment variables are set
- Ensure MySQL user has proper permissions

---

**You're all set! 🎉**

Your Safety Incident Reporting App is now running with:
- ✅ Encrypted database
- ✅ Secure authentication  
- ✅ Full-stack functionality
- ✅ Professional API documentation
