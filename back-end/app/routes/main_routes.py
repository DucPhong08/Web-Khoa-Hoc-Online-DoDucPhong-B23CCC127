from flask import Blueprint

# Khởi tạo Blueprint
bp = Blueprint('main', __name__)

# Định nghĩa route mặc định
@bp.route('/')
def home():
    return "Welcome to the Flask App xin chào!"
