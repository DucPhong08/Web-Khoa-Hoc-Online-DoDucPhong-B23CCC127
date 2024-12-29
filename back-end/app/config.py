import os
from datetime import timedelta


class Config:
    MONGO_URI = "mongodb://localhost:27017/management"
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key')  # Nên đặt qua biến môi trường
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)