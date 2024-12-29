from flask import Blueprint
from app.controllers.post_controller import Posts

Post_bp = Blueprint("post", __name__)

Post_bp.add_url_rule("/getAllPost", view_func=Posts.get_posts, methods=["GET"])
Post_bp.add_url_rule("/create_post", view_func=Posts.create_post, methods=["POST"])
Post_bp.add_url_rule("/update_post/<post_id>", view_func=Posts.update_post, methods=["PUT"])
Post_bp.add_url_rule("/delete_post/<post_id>", view_func=Posts.delete_post, methods=["DELETE"])
