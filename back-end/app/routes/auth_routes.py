from flask import Blueprint

# Khởi tạo Blueprint cho các route liên quan đến auth
bp = Blueprint('auth', __name__)

@bp.route('/login')
def login():
    return "Login Page"

@bp.route('/register')
def register():
    return "Register Page"
