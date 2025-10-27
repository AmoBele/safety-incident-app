# Safety Incident Reporting App

A comprehensive safety incident reporting application with encrypted data storage, real-time location tracking, and AI-powered support features.

## 🌟 Features

### Frontend (React + TypeScript)
- 🏠 **Interactive Dashboard** with safety heat maps
- 📍 **Real-time GPS Tracking** with Leaflet maps
- 🚨 **Panic Button** for emergencies
- 💬 **AI Therapist** for emotional support
- 📝 **Incident Reporting** with multimedia evidence
- 🔐 **Secure Evidence Vault**
- 💚 **Healing Hub** with survivor stories
- 👥 **Community Support** features

### Backend (Python + FastAPI + MySQL)
- 🔒 **AES-256 Encryption** for sensitive data
- 🔑 **JWT Authentication** with secure tokens
- 🛡️ **Bcrypt Password Hashing**
- 🗄️ **MySQL Database** with encrypted fields
- 📚 **Auto-generated API Documentation**
- ✅ **RESTful API** endpoints

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **MySQL Server** - [Download](https://dev.mysql.com/downloads/mysql/)
- **Node.js 16+** - [Download](https://nodejs.org/)

### Installation

#### 1. Setup Backend

```bash
# Run setup script
setup_backend.bat

# Edit backend\.env with your MySQL password and keys
# Generate keys with:
python -c "import secrets; print('SECRET_KEY:', secrets.token_urlsafe(32)); print('ENCRYPTION_KEY:', secrets.token_urlsafe(32))"

# Initialize database
init_database.bat
```

#### 2. Setup Frontend

```bash
npm install
```

#### 3. Start the Application

**Option A - Start Both Servers:**
```bash
start_all.bat
```

**Option B - Start Separately:**
```bash
# Terminal 1 - Backend
start_backend.bat

# Terminal 2 - Frontend  
npm run dev
```

### Access the App

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## 📖 Documentation

- **Complete Setup Guide:** [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Backend Documentation:** [backend/README.md](backend/README.md)

## 🔐 Security Features

### Data Encryption
- Incident descriptions (AES-256)
- Location addresses (AES-256)
- Evidence file paths (AES-256)
- Community posts (AES-256)

### Authentication
- JWT token-based authentication
- Bcrypt password hashing (cost factor 12)
- Secure session management
- Token expiration (30 minutes)

### Database Security
- Encrypted sensitive fields
- Parameterized queries (SQL injection prevention)
- Foreign key constraints
- Proper indexing for performance

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token  
- `GET /auth/me` - Get current user info

### Incidents
- `POST /incidents` - Create incident (auto-encrypted)
- `GET /incidents` - List user incidents (auto-decrypted)
- `GET /incidents/{id}` - Get incident details

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Leaflet Maps
- Radix UI
- Framer Motion

### Backend
- Python 3.8+
- FastAPI
- MySQL
- SQLAlchemy (optional)
- Cryptography (AES-256)
- python-jose (JWT)
- passlib (bcrypt)

## 📁 Project Structure

```
├── backend/              # Python FastAPI backend
│   ├── main.py          # Main API application
│   ├── database.py      # MySQL connection & schema
│   ├── auth.py          # JWT & password hashing  
│   ├── encryption.py    # AES-256 encryption
│   ├── init_database.py # Database initialization
│   └── requirements.txt # Python dependencies
├── src/
│   ├── components/      # React components
│   ├── App.tsx         # Main React app
│   └── main.tsx        # React entry point
├── setup_backend.bat    # Backend setup script
├── init_database.bat    # Database initialization
├── start_all.bat       # Start both servers
└── package.json        # Frontend dependencies
```

## 🧪 Testing

### Test Backend API

1. Go to http://localhost:8000/docs
2. Use Swagger UI to test endpoints
3. Register a test user
4. Login to get JWT token
5. Test authenticated endpoints

### Test Frontend

1. Go to http://localhost:3000
2. Click "🚀 Try Demo Mode" for quick access
3. Or register/login with real credentials
4. Test all features (map, incident reporting, etc.)

## 🔧 Configuration

### Backend (.env)

```env
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=safety_app_db
SECRET_KEY=your-secret-key-32-chars-min
ENCRYPTION_KEY=your-encryption-key-32-chars
CORS_ORIGINS=http://localhost:3000
```

### Frontend (vite.config.ts)

- Port: 3000 (auto 3001 if occupied)
- API proxy can be configured if needed

## 🐛 Troubleshooting

### Backend Issues

**Can't connect to MySQL:**
- Ensure MySQL is running
- Check DATABASE_PASSWORD in `.env`
- Verify port 3306 is accessible

**Import errors:**
- Run: `pip install -r backend\requirements.txt`

### Frontend Issues

**Port already in use:**
- App will auto-use port 3001
- Or close other apps on port 3000

**Module not found:**
- Run: `npm install`

## 🤝 Contributing

This is a student project for safety awareness.

## 📄 License

This project is for educational purposes.

## ⚠️ Important Notes

- **Never commit `.env`** to version control
- **Rotate keys regularly** in production  
- **Enable HTTPS** for production deployment
- **Backup database** regularly
- **Keep dependencies updated** for security

## 🎯 Next Steps

1. ✅ Complete setup using `setup_backend.bat`
2. ✅ Configure `.env` file
3. ✅ Run `init_database.bat`
4. ✅ Start app with `start_all.bat`
5. 🚀 Begin using the application!

---

**Made with ❤️ for Safety and Support**