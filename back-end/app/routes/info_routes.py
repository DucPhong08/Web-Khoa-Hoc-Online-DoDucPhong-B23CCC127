from flask import Blueprint
from app.controllers.info_controller import UserInfo


# Khởi tạo Blueprint cho các route liên quan đến auth
userInfo_bp = Blueprint("userInfo", __name__)
userInfo_bp.add_url_rule(
    "/getUserInfo", view_func=UserInfo.get_UserInfo, methods=["GET"]
)
userInfo_bp.add_url_rule(
    "/updateUserInfo", view_func=UserInfo.updateInfo, methods=["PUT"]
)
userInfo_bp.add_url_rule(
    "/updateIntroduce", view_func=UserInfo.updateIntroduce, methods=["PUT"]
)
userInfo_bp.add_url_rule(
    "/updateUserMXH", view_func=UserInfo.updateMXH, methods=["PUT"]
)
userInfo_bp.add_url_rule(
    "/updateProperty", view_func=UserInfo.updateProperty, methods=["PATCH"]
)
userInfo_bp.add_url_rule(
    "/register-course/<course_slug>",
    view_func=UserInfo.register_or_unregister_course,
    methods=["POST", "DELETE"],
)


userInfo_bp.add_url_rule(
    "/getCart", view_func=UserInfo.get_cart, methods=["GET"]
)

userInfo_bp.add_url_rule(
    "/addCart/<course_slug>", view_func=UserInfo.add_to_cart, methods=["POST"]
)

userInfo_bp.add_url_rule(
    "/buyCourse", view_func=UserInfo.buy_courses, methods=["POST"]
)
userInfo_bp.add_url_rule(
    "/removeCart/<course_id>", view_func=UserInfo.remove_from_cart, methods=["POST"]
)
