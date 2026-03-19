import secrets
import string

def generate_secure_password(length=16, use_numbers=True, use_symbols=True):
    """Generates a cryptographically secure password."""
    
    # Always include uppercase and lowercase letters
    characters = string.ascii_letters
    
    if use_numbers:
        characters += string.digits
    if use_symbols:
        characters += string.punctuation
        
    # secrets.choice picks truly random characters that hackers cannot predict
    password = ''.join(secrets.choice(characters) for _ in range(length))
    
    return {"secure_password": password}