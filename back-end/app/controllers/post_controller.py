from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from mongoengine import ValidationError
from app.models import Course, User, Review,Post
import base64
from datetime import datetime


class Posts:
    @staticmethod
    def get_posts():
        try:
            offset = int(request.args.get('offset', 0))  
            limit = int(request.args.get('limit', 4))  
            tag = request.args.get('tag', None) 
            
            query = {}
            if tag:
                query['tags'] = tag  
            total_posts = Post.objects(**query).count() # pylint: disable=E1101
            
            posts = Post.objects(**query).skip(offset).limit(limit)# pylint: disable=E1101

            response = []
            for post in posts:
                response.append({
                    "id": str(post.id),
                    "title": post.title,
                    "content": post.content,
                    "author": User.objects(id=post.author.id).first().name,  # pylint: disable=E1101 
                    "img": User.objects(id=post.author.id).first().image,  # pylint: disable=E1101 
                    "tags": post.tags,
                    "image": post.image,
                    "likes": len(post.likes),
                    "created_at": post.created_at,
                    "updated_at": post.updated_at
                })
            
            return jsonify({
                "total": total_posts,
                "posts": response
            }), 200

        except Exception as e:
            return jsonify({"error": "An error occurred", "details": str(e)}), 500


    @staticmethod
    @jwt_required()
    def create_post():
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")
            user = User.objects(email=email).first() # pylint: disable=E1101
            if not user:
                return jsonify({"error": "Người dùng không tồn tại"}), 404

            data = request.json
            title = data.get("title")
            content = data.get("content")
            tags = data.get("tags")
            image = data.get("image","")

            if not title or not content:
                return jsonify({"error": "Tiêu đề và nội dung không được để trống"}), 400

            post = Post(title=title, content=content, author=user, tags=tags,image= image) # pylint: disable=E1101
            post.save()

            return jsonify({
                "message": "Tạo bài viết thành công",
                "post": {
                    "title": post.title,
                    "content": post.content,
                    "tags": post.tags,
                    "created_at": post.created_at
                }
            }), 201

        except Exception as e:
            return jsonify({"error": "Đã xảy ra lỗi", "details": str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def update_post(post_id):
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")
            user = User.objects(email=email).first() # pylint: disable=E1101
            if not user:
                return jsonify({"error": "Người dùng không tồn tại"}), 404

            post = Post.objects(id=post_id, author=user).first() # pylint: disable=E1101
            if not post:
                return jsonify({"error": "Bài viết không tồn tại hoặc bạn không có quyền chỉnh sửa"}), 404

            data = request.json
            title = data.get("title")
            content = data.get("content")
            tags = data.get("tags")
            img = data.get("image","")

            if title:
                post.title = title
            if content:
                post.content = content
            if tags:
                post.tags = tags
            if img:
                post.image = img

            post.save()

            return jsonify({
                "message": "Cập nhật bài viết thành công",
                "post": {
                    "id": str(post.id),
                    "title": post.title,
                    "content": post.content,
                    "image": post.image,
                    "tags": post.tags,
                    "updated_at": post.updated_at
                }
            }), 200

        except Exception as e:
            return jsonify({"error": "Đã xảy ra lỗi", "details": str(e)}), 500

    @staticmethod
    @jwt_required()
    def delete_post(post_id):
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")
            user = User.objects(email=email).first() # pylint: disable=E1101
            if not user:
                return jsonify({"error": "Người dùng không tồn tại"}), 404

            post = Post.objects(id=post_id, author=user).first() # pylint: disable=E1101
            if not post:
                return jsonify({"error": "Bài viết không tồn tại hoặc bạn không có quyền xóa"}), 404

            post.delete()

            return jsonify({"message": "Xóa bài viết thành công"}), 200

        except Exception as e:
            return jsonify({"error": "Đã xảy ra lỗi", "details": str(e)}), 500

    @staticmethod
    @jwt_required()
    def like_post(post_id):
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")
            user = User.objects(email=email).first() # pylint: disable=E1101
            if not user:
                return jsonify({"error": "Người dùng không tồn tại"}), 404

            post = Post.objects(id=post_id).first() # pylint: disable=E1101
            if not post:
                return jsonify({"error": "Bài viết không tồn tại"}), 404

            if user in post.likes:
                return jsonify({"error": "Bạn đã thích bài viết này rồi"}), 400

            post.likes.append(user)
            post.save()

            return jsonify({"message": "Đã thích bài viết"}), 200

        except Exception as e:
            return jsonify({"error": "Đã xảy ra lỗi", "details": str(e)}), 500

    @staticmethod
    @jwt_required()
    def unlike_post(post_id):
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")
            user = User.objects(email=email).first() # pylint: disable=E1101
            if not user:
                return jsonify({"error": "Người dùng không tồn tại"}), 404

            post = Post.objects(id=post_id).first() # pylint: disable=E1101
            if not post:
                return jsonify({"error": "Bài viết không tồn tại"}), 404

            if user not in post.likes:
                return jsonify({"error": "Bạn chưa thích bài viết này"}), 400

            post.likes.remove(user)
            post.save()

            return jsonify({"message": "Đã bỏ thích bài viết"}), 200

        except Exception as e:
            return jsonify({"error": "Đã xảy ra lỗi", "details": str(e)}), 500

