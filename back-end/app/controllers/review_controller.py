from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from mongoengine import ValidationError
from app.models import Course, User, Review
import base64
from datetime import datetime


class Reviews:
    

    @staticmethod
    @jwt_required()
    def create_review(course_slug):
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|") 
            user = User.objects(email=email).first() # pylint: disable=E1101
            if not user:
                return jsonify({"error": "Học viên chưa tồn tại"}), 404
            
            data = request.json
            rating = data.get("rating")
            comment = data.get("comment")

           
            if not course_slug or not rating:
                return jsonify({"error": "Bạn chưa đánh giá"}), 400

            course = Course.objects(slug=course_slug).first() # pylint: disable=E1101
            if not course:
                return jsonify({"error": "Khóa học chưa tồn tại"}), 404

            existing_review = Review.objects(user=user.id, course=course.id).first() # pylint: disable=E1101
            if existing_review:
                return jsonify({"error": "Bạn đã đánh giá khóa học này rồi"}), 400

            review = Review(user=user, course=course, rating=rating, comment=comment)
            review.save()

            return jsonify({
                "message": "Đã đánh giá , cảm ơn bạn",
                "review": {
                    "course": str(course.id),
                    "user": str(user.id),
                    "rating": review.rating,
                    "comment": review.comment,
                    "created_at": review.created_at
                }
            }), 201

        except ValidationError as e:
            return jsonify({"error": str(e)}), 400

        except Exception as e:
            return jsonify({"error": "An error occurred", "details": str(e)}), 500
    @staticmethod
    @jwt_required()
    def delete_review(course_slug):
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")
            user = User.objects(email=email).first()  # pylint: disable=E1101
            if not user:
                return jsonify({"error": "Người dùng chưa tồn tại"}), 404


            if not course_slug:
                return jsonify({"error": "Bạn chưa cung cấp slug khóa học"}), 400

            course = Course.objects(slug=course_slug).first()  # pylint: disable=E1101
            if not course:
                return jsonify({"error": "Khóa học chưa tồn tại"}), 404

            review = Review.objects(user=user.id, course=course.id).first()  # pylint: disable=E1101
            if not review:
                return jsonify({"error": "Bạn chưa đánh giá khóa học này"}), 404

            review.delete()

            return jsonify({"message": "Đánh giá đã được xóa"}), 200

        except Exception as e:
            return jsonify({"error": "An error occurred", "details": str(e)}), 500

