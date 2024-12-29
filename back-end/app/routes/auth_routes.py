from flask import Blueprint
from app.controllers.auth_controller import Auth as auth_view


# Khởi tạo Blueprint cho các route liên quan đến auth
auth_bp = Blueprint('auth', __name__)
# /api/auth/register or /api/auth/login
auth_bp.add_url_rule('/register', view_func=auth_view.register, methods=['POST'])
auth_bp.add_url_rule('/login', view_func=auth_view.login, methods=['POST'])
