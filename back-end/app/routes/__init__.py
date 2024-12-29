from .auth_routes import auth_bp
from .user_routes import user_bp
from .course_routes import course_bp
from .info_routes import userInfo_bp
from .review_routes import Review_bp
from .post_routes import Post_bp
from .notification import notification_bp

blueprints = [
    (auth_bp, "auth"),
    (user_bp, "user"),
    (course_bp, "courses"),
    (userInfo_bp, "info"),
    (Review_bp, "review"),
    (Post_bp, "blog"),
    (notification_bp,"notification"),
]
