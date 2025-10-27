"""
Initialize MySQL Database for Safety Incident Reporting App

This script creates the database and all required tables with proper schema,
indexes, and relationships.

Run this before starting the backend server for the first time.
"""

import mysql.connector
from mysql.connector import Error
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DATABASE_HOST', 'localhost'),
    'user': os.getenv('DATABASE_USER', 'root'),
    'password': os.getenv('DATABASE_PASSWORD'),
    'port': int(os.getenv('DATABASE_PORT', 3306))
}

DATABASE_NAME = os.getenv('DATABASE_NAME', 'safety_app_db')

def create_database_and_tables():
    """Create database and all required tables"""
    connection = None
    cursor = None
    
    try:
        print("=" * 60)
        print("Safety Incident Reporting App - Database Initialization")
        print("=" * 60)
        print()
        
        # Connect to MySQL server (without selecting a database)
        print(f"[1/7] Connecting to MySQL server at {DB_CONFIG['host']}...")
        connection = mysql.connector.connect(**DB_CONFIG)
        cursor = connection.cursor()
        print("✓ Connected successfully!")
        print()
        
        # Create database
        print(f"[2/7] Creating database '{DATABASE_NAME}'...")
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DATABASE_NAME}")
        cursor.execute(f"USE {DATABASE_NAME}")
        print(f"✓ Database '{DATABASE_NAME}' ready!")
        print()
        
        # Create Users table
        print("[3/7] Creating 'users' table...")
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
                INDEX idx_username (username),
                INDEX idx_role (role)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        print("✓ Users table created!")
        print()
        
        # Create Incidents table
        print("[4/7] Creating 'incidents' table...")
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
                INDEX idx_incident_date (incident_date),
                INDEX idx_incident_type (incident_type),
                INDEX idx_severity (severity)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        print("✓ Incidents table created!")
        print()
        
        # Create Evidence table
        print("[5/7] Creating 'evidence' table...")
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
                INDEX idx_user_id (user_id),
                INDEX idx_file_type (file_type)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        print("✓ Evidence table created!")
        print()
        
        # Create Safety Zones table
        print("[6/7] Creating 'safety_zones' table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS safety_zones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                location_lat DECIMAL(10, 8) NOT NULL,
                location_lng DECIMAL(11, 8) NOT NULL,
                zone_type VARCHAR(50) NOT NULL,
                radius_meters INT DEFAULT 100,
                description TEXT,
                severity_level VARCHAR(50) DEFAULT 'info',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_zone_type (zone_type),
                INDEX idx_location (location_lat, location_lng),
                INDEX idx_active (is_active)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        print("✓ Safety Zones table created!")
        print()
        
        # Create Community Posts table
        print("[7/7] Creating 'community_posts' table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS community_posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                content_encrypted TEXT NOT NULL,
                post_type VARCHAR(100) DEFAULT 'general',
                is_anonymous BOOLEAN DEFAULT FALSE,
                likes_count INT DEFAULT 0,
                comments_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_post_type (post_type),
                INDEX idx_created (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        print("✓ Community Posts table created!")
        print()
        
        # Commit changes
        connection.commit()
        
        # Display summary
        print("=" * 60)
        print("✓ DATABASE INITIALIZATION COMPLETE!")
        print("=" * 60)
        print()
        print("Tables created:")
        print("  1. users              - User accounts with hashed passwords")
        print("  2. incidents          - Incident reports (encrypted)")
        print("  3. evidence           - Evidence files (encrypted)")
        print("  4. safety_zones       - Safety zone markers")
        print("  5. community_posts    - Community posts (encrypted)")
        print()
        print("All sensitive data fields are configured for encryption.")
        print("Password hashing will be handled by the backend API.")
        print()
        print("Next steps:")
        print("  1. Start the backend: python main.py")
        print("  2. Access API docs: http://localhost:8000/docs")
        print()
        
        return True
        
    except Error as e:
        print()
        print("✗ ERROR:", str(e))
        print()
        if "Access denied" in str(e):
            print("Please check your DATABASE_PASSWORD in the .env file")
        elif "Can't connect" in str(e):
            print("Please ensure MySQL server is running on port", DB_CONFIG['port'])
        return False
        
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
            print("MySQL connection closed.")

def check_environment():
    """Check if required environment variables are set"""
    required_vars = ['DATABASE_PASSWORD', 'SECRET_KEY', 'ENCRYPTION_KEY']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("ERROR: Missing required environment variables:")
        for var in missing_vars:
            print(f"  - {var}")
        print()
        print("Please ensure your .env file exists and contains all required variables.")
        print("Run 'setup_backend.bat' to create the .env file.")
        return False
    
    return True

if __name__ == "__main__":
    print()
    
    # Check environment variables
    if not check_environment():
        sys.exit(1)
    
    # Create database and tables
    success = create_database_and_tables()
    
    if success:
        sys.exit(0)
    else:
        sys.exit(1)
