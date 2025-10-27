from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
import base64
from config import get_settings

settings = get_settings()

def get_encryption_key() -> bytes:
    """Derive encryption key from settings"""
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=b'safety_app_salt',  # In production, use a random salt stored securely
        iterations=100000,
        backend=default_backend()
    )
    key = base64.urlsafe_b64encode(kdf.derive(settings.encryption_key.encode()))
    return key

# Initialize Fernet cipher
cipher = Fernet(get_encryption_key())

def encrypt_data(data: str) -> str:
    """Encrypt sensitive data using AES-256"""
    if not data:
        return ""
    encrypted = cipher.encrypt(data.encode())
    return encrypted.decode()

def decrypt_data(encrypted_data: str) -> str:
    """Decrypt encrypted data"""
    if not encrypted_data:
        return ""
    try:
        decrypted = cipher.decrypt(encrypted_data.encode())
        return decrypted.decode()
    except Exception as e:
        raise ValueError(f"Decryption failed: {str(e)}")
