from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from pathlib import Path

class Settings(BaseSettings):
    # Database
    database_host: str = "localhost"
    database_user: str = "root"
    database_password: str
    database_name: str = "safety_app_db"
    database_port: int = 3306
    
    # Security
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    encryption_key: str
    
    # CORS
    cors_origins: str = "http://localhost:3000"
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    
    class Config:
        env_file = Path(__file__).parent / ".env"
        case_sensitive = False

@lru_cache()
def get_settings():
    return Settings()
