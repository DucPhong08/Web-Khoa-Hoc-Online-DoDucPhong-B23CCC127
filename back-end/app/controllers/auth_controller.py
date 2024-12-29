from flask import request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, create_refresh_token
from app.models import User
from datetime import datetime
import base64

bcrypt = Bcrypt()

class Auth:
    @staticmethod
    def register():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if  not email or not password:
            return jsonify({"error": "Email and password bắt buộc "}), 400

        if User.objects(email=email).first(): # pylint: disable=E1101
            return jsonify({"error": "Tài khoản này đã tồn tại"}), 400

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user = User(
            email=email,
            password=hashed_password,
            role='student',  # Mặc định là học viên
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        user.save()

        return jsonify({"message": "Đăng kí thành công"}), 201

    @staticmethod
    def login():
        try:
            # Lấy thông tin từ request
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
            

            if request.headers.get('Authorization'):
                return jsonify({"message": "Bạn đã đăng nhập rồi."}), 200

            user = User.objects(email=email).first()  # pylint: disable=E1101
            if not user or not bcrypt.check_password_hash(user.password, password):
                return jsonify({"error": "Tài khoản không tồn tại hoặc sai mai khẩu"}), 401
            if user.look:  
                return jsonify({"error": "Tài khoản bị khóa do vi phạm , liên hệ với quản trị viên để được tư vấn "}), 401

            user_email = user.email
            user_role = user.role

            identity = base64.b64encode(f"{user_email}|{user_role}".encode('utf-8')).decode('utf-8')
            
            # Tạo access và refresh token
            access_token = create_access_token(identity= identity)

            return jsonify({
                "message": "Đăng nhập thành công ",
                "access_token": access_token,
            }), 200
        
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    
