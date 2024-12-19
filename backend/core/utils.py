import os
import secrets
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
from base64 import urlsafe_b64encode

# Encryption Key Derivation
def generate_encryption_key(salt):
    password = "sdfghjklqwertyuiozxcvbnm456789vbnm" # Retrieve the key from env
    # password = os.environ.get("ENCRYPTION_KEY") # Retrieve the key from env
    password = password.encode()
    salt = salt.encode()

    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    return urlsafe_b64encode(kdf.derive(password))

def encrypt_file(file_content):
    salt = secrets.token_urlsafe(16)
    key = generate_encryption_key(salt)
    f = Fernet(key)
    encrypted_file = f.encrypt(file_content)
    return salt.encode() + b'|' + encrypted_file # Store salt + ciphertext


def decrypt_file(encrypted_content):
    try:
        salt, encrypted_file = encrypted_content.split(b'|', 1)
    except ValueError:
        raise ValueError('Invalid file content')

    key = generate_encryption_key(salt.decode())
    f = Fernet(key)
    decrypted_file = f.decrypt(encrypted_file)
    return decrypted_file

def generate_secure_link():
    return secrets.token_urlsafe(32)