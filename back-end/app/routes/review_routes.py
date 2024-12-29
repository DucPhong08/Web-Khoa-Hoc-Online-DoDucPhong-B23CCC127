from flask import Blueprint
from app.controllers.review_controller import Reviews

Review_bp = Blueprint('review', __name__)

Review_bp.add_url_rule('/Review/<course_slug>', view_func=Reviews.create_review, methods=['POST'])
Review_bp.add_url_rule('/DeleteReview/<course_slug>', view_func=Reviews.delete_review, methods=['DELETE'])

