# Safety Incident Reporting Backend API

## 🔐 Security Features

- **AES-256 Encryption** for sensitive data (incident descriptions, addresses)
- **Bcrypt Password Hashing** for user credentials
- **JWT Authentication** with token expiration
- **MySQL Database** with proper indexing
- **CORS Protection** for frontend integration

## 📋 Prerequisites

1. **Python 3.8+** installed
2. **MySQL Server** installed and running
3. **pip** package manager

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

Edit `.env` and update:

```env
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_mysql_password_here
DATABASE_NAME=safety_app_db
SECRET_KEY=your-secret-key-min-32-characters-long
ENCRYPTION_KEY=your-encryption-key-32-characters
```

**Generate secure keys:**
```python
import secrets
print("SECRET_KEY:", secrets.token_urlsafe(32))
print("ENCRYPTION_KEY:", secrets.token_urlsafe(32))
```

### 3. Initialize Database

The database will be created automatically on first run, but you can manually initialize:

```bash
python -c "from database import init_database; init_database()"
```

### 4. Run the Server

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at: **http://localhost:8000**

API Documentation (Swagger): **http://localhost:8000/docs**

## 📚 API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info (requires auth)

### Incidents

- `POST /incidents` - Create incident (encrypted)
- `GET /incidents` - Get all user incidents (decrypted)
- `GET /incidents/{id}` - Get specific incident (decrypted)

## 🔒 Data Encryption

The following fields are encrypted at rest:

- Incident descriptions
- Location addresses
- Evidence file paths
- Community post content

## 🗄️ Database Schema

### Users Table
- Hashed passwords (bcrypt)
- Email & username indexes
- Role-based access

### Incidents Table
- Encrypted descriptions
- GPS coordinates
- User foreign key
- Status tracking

### Evidence Table
- Encrypted file names & paths
- File metadata
- Linked to incidents

## 🔐 Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use strong passwords** for database
3. **Rotate SECRET_KEY** regularly
4. **Enable HTTPS** in production
5. **Keep dependencies updated**

## 🧪 Testing

Test the API using the Swagger UI at `/docs` or with curl:

```bash
# Register
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "full_name": "Test User",
    "password": "securepass123"
  }'

# Login
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=securepass123"
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_HOST | MySQL host | Yes |
| DATABASE_USER | MySQL username | Yes |
| DATABASE_PASSWORD | MySQL password | Yes |
| DATABASE_NAME | Database name | Yes |
| SECRET_KEY | JWT secret key | Yes |
| ENCRYPTION_KEY | AES encryption key | Yes |
| CORS_ORIGINS | Allowed frontend URLs | Yes |

## 🛠️ Troubleshooting

**Connection Error:**
- Ensure MySQL is running
- Check credentials in `.env`
- Verify port 3306 is accessible

**Import Errors:**
- Run `pip install -r requirements.txt`
- Use Python 3.8+

**Encryption Errors:**
- Ensure ENCRYPTION_KEY is at least 32 characters
- Don't change the key after storing encrypted data
