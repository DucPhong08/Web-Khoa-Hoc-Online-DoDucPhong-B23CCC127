from flask import Blueprint
from app.controllers.user_controller import User

# Định nghĩa Blueprint
user_bp = Blueprint("user", __name__)
user_bp.add_url_rule("getUser", view_func=User.show_users , methods=['GET'])
user_bp.add_url_rule("getTeacher", view_func=User.show_teacher , methods=['GET'])
user_bp.add_url_rule("changepassword", view_func=User.change_password , methods=['POST'])


