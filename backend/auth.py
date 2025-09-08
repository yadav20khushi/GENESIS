from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import requests
import os

security = HTTPBearer()

def verify_token(token: HTTPAuthorizationCredentials = Security(security)):
    url = f"{os.getenv('SUPABASE_URL')}/auth/v1/user"
    headers = {
        "Authorization": f"Bearer {token.credentials}",
        "apikey": os.getenv("SUPABASE_ANON_KEY")
    }
    res = requests.get(url, headers=headers)
    if res.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return res.json()
