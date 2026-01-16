import jwt
from django.conf import settings
from datetime import datetime, timedelta

def create_token(user):
    payload = {
        "user_id": user.id,
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

def decode_token(token):
    return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
