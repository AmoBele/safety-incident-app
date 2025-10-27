from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import mysql.connector
from mysql.connector import Error
from mysql.connector.cursor import MySQLCursorDict
from mysql.connector.connection import MySQLConnection

from config import get_settings
from database import get_db_connection, init_database
from auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    decode_access_token,
    Token
)
from encryption import encrypt_data, decrypt_data

settings = get_settings()
app = FastAPI(title="Safety Incident Reporting API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Pydantic Models
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    role: str
    created_at: datetime

class IncidentCreate(BaseModel):
    title: str
    description: str
    incident_type: str
    severity: str
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    location_address: Optional[str] = None
    incident_date: datetime

class IncidentResponse(BaseModel):
    id: int
    title: str
    description: str
    incident_type: str
    severity: str
    location_lat: Optional[float]
    location_lng: Optional[float]
    location_address: Optional[str]
    incident_date: datetime
    status: str
    created_at: datetime

# Dependency to get current user
async def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = decode_access_token(token)
    if token_data is None or token_data.username is None:
        raise credentials_exception
    
    connection: MySQLConnection = get_db_connection()  # type: ignore
    cursor: MySQLCursorDict = connection.cursor(dictionary=True)  # type: ignore
    
    try:
        cursor.execute("SELECT * FROM users WHERE username = %s", (token_data.username,))
        user = cursor.fetchone()
        
        if user is None:
            raise credentials_exception
            
        return user
        
    finally:
        cursor.close()
        connection.close()

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_database()

# Health check
@app.get("/")
async def root():
    return {"message": "Safety Incident Reporting API", "status": "running"}

# Authentication Routes
@app.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Check if user exists
        cursor.execute("SELECT id FROM users WHERE email = %s OR username = %s", 
                      (user.email, user.username))
        
        if cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email or username already registered"
            )
        
        # Hash password
        hashed_password = get_password_hash(user.password)
        
        # Insert user
        cursor.execute("""
            INSERT INTO users (email, username, full_name, hashed_password)
            VALUES (%s, %s, %s, %s)
        """, (user.email, user.username, user.full_name, hashed_password))
        
        connection.commit()
        user_id = cursor.lastrowid
        
        # Fetch created user
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        new_user = cursor.fetchone()
        
        return new_user
        
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
        
    finally:
        cursor.close()
        connection.close()

@app.post("/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM users WHERE username = %s", (form_data.username,))
        user = cursor.fetchone()
        
        if not user or not verify_password(form_data.password, user['hashed_password']):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            data={"sub": user['username']}, expires_delta=access_token_expires
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
        
    finally:
        cursor.close()
        connection.close()

@app.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return current_user

# Incident Routes
@app.post("/incidents", response_model=IncidentResponse)
async def create_incident(incident: IncidentCreate, current_user: dict = Depends(get_current_user)):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Encrypt sensitive data
        encrypted_description = encrypt_data(incident.description)
        encrypted_address = encrypt_data(incident.location_address) if incident.location_address else None
        
        cursor.execute("""
            INSERT INTO incidents 
            (user_id, title, description_encrypted, incident_type, severity, 
             location_lat, location_lng, location_address_encrypted, incident_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            current_user['id'],
            incident.title,
            encrypted_description,
            incident.incident_type,
            incident.severity,
            incident.location_lat,
            incident.location_lng,
            encrypted_address,
            incident.incident_date
        ))
        
        connection.commit()
        incident_id = cursor.lastrowid
        
        # Fetch created incident
        cursor.execute("SELECT * FROM incidents WHERE id = %s", (incident_id,))
        new_incident = cursor.fetchone()
        
        # Decrypt data for response
        new_incident['description'] = decrypt_data(new_incident['description_encrypted'])
        new_incident['location_address'] = decrypt_data(new_incident['location_address_encrypted']) if new_incident['location_address_encrypted'] else None
        
        return new_incident
        
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
        
    finally:
        cursor.close()
        connection.close()

@app.get("/incidents", response_model=List[IncidentResponse])
async def get_incidents(current_user: dict = Depends(get_current_user)):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT * FROM incidents 
            WHERE user_id = %s 
            ORDER BY created_at DESC
        """, (current_user['id'],))
        
        incidents = cursor.fetchall()
        
        # Decrypt sensitive data
        for incident in incidents:
            incident['description'] = decrypt_data(incident['description_encrypted'])
            incident['location_address'] = decrypt_data(incident['location_address_encrypted']) if incident['location_address_encrypted'] else None
        
        return incidents
        
    finally:
        cursor.close()
        connection.close()

@app.get("/incidents/{incident_id}", response_model=IncidentResponse)
async def get_incident(incident_id: int, current_user: dict = Depends(get_current_user)):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT * FROM incidents 
            WHERE id = %s AND user_id = %s
        """, (incident_id, current_user['id']))
        
        incident = cursor.fetchone()
        
        if not incident:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident not found")
        
        # Decrypt sensitive data
        incident['description'] = decrypt_data(incident['description_encrypted'])
        incident['location_address'] = decrypt_data(incident['location_address_encrypted']) if incident['location_address_encrypted'] else None
        
        return incident
        
    finally:
        cursor.close()
        connection.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.host, port=settings.port)
