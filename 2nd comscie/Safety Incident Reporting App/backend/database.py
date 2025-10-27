import mysql.connector
from mysql.connector import Error
from config import get_settings
from typing import Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

def get_db_connection():
    """Create and return a database connection"""
    try:
        connection = mysql.connector.connect(
            host=settings.database_host,
            user=settings.database_user,
            password=settings.database_password,
            database=settings.database_name,
            port=settings.database_port
        )
        
        if connection.is_connected():
            return connection
            
    except Error as e:
        logger.error(f"Error connecting to MySQL: {e}")
        raise

def init_database():
    """Initialize database with required tables"""
    connection = None
    cursor = None
    try:
        # Connect without database first
        connection = mysql.connector.connect(
            host=settings.database_host,
            user=settings.database_user,
            password=settings.database_password,
            port=settings.database_port
        )
        
        cursor = connection.cursor()
        
        # Create database if not exists
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {settings.database_name}")
        cursor.execute(f"USE {settings.database_name}")
        
        # Users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                username VARCHAR(100) UNIQUE NOT NULL,
                full_name VARCHAR(255) NOT NULL,
                hashed_password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_email (email),
                INDEX idx_username (username)
            )
        """)
        
        # Incidents table (encrypted data)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS incidents (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description_encrypted TEXT NOT NULL,
                incident_type VARCHAR(100) NOT NULL,
                severity VARCHAR(50) NOT NULL,
                location_lat DECIMAL(10, 8),
                location_lng DECIMAL(11, 8),
                location_address_encrypted TEXT,
                incident_date DATETIME NOT NULL,
                status VARCHAR(50) DEFAULT 'reported',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_status (status),
                INDEX idx_incident_date (incident_date)
            )
        """)
        
        # Evidence table (encrypted files)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS evidence (
                id INT AUTO_INCREMENT PRIMARY KEY,
                incident_id INT NOT NULL,
                user_id INT NOT NULL,
                file_name_encrypted VARCHAR(500) NOT NULL,
                file_type VARCHAR(100) NOT NULL,
                file_path_encrypted TEXT NOT NULL,
                file_size BIGINT,
                notes_encrypted TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_incident_id (incident_id),
                INDEX idx_user_id (user_id)
            )
        """)
        
        # Safety zones table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS safety_zones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                location_lat DECIMAL(10, 8) NOT NULL,
                location_lng DECIMAL(11, 8) NOT NULL,
                zone_type VARCHAR(50) NOT NULL,
                radius_meters INT DEFAULT 100,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_zone_type (zone_type)
            )
        """)
        
        # Community posts table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS community_posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                content_encrypted TEXT NOT NULL,
                post_type VARCHAR(100) DEFAULT 'general',
                is_anonymous BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_post_type (post_type)
            )
        """)
        
        connection.commit()
        logger.info("Database initialized successfully")
        
    except Error as e:
        logger.error(f"Error initializing database: {e}")
        if connection:
            connection.rollback()
        raise
        
    finally:
        if connection and connection.is_connected():
            if cursor:
                cursor.close()
            connection.close()
