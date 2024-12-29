import yt_dlp
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Course, Video, User,VideoProgress
import base64
from datetime import datetime

from slugify import slugify

def get_video_duration(url):
    try:
        ydl_opts = {
            'quiet': True,
            'extract_flat': True  # Chỉ lấy metadata mà không tải video
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=False)
            duration = info_dict.get('duration', None)  # Thời gian video (giây)

            if duration:
                return duration
            else:
                return None
    except Exception as e:
        return None

class VideoService:
    
    @jwt_required()
    @staticmethod
    def get_video(video_slug):
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")
            current_user = User.objects(email=email).first()  # pylint: disable=E1101

            if not current_user:
                return jsonify({"error": "Người dùng không tồn tại."}), 404

            course = Course.objects(videos__slug=video_slug).first()  # pylint: disable=E1101
            if not course:
                return jsonify({"error": "Video không thuộc về khóa học nào."}), 404

            # Tìm video trong danh sách videos của khóa học
            video = next((v for v in course.videos if v.slug == video_slug), None)
            if not video:
                return jsonify({"error": "Video không tồn tại trong khóa học."}), 404

            # Kiểm tra người dùng đã xem video chưa
            watched_percentage = VideoService.get_watched_percentage(video, current_user.id)

            return jsonify({
                "title": video.title,
                "description": video.description,
                "url": video.url,
                "duration": video.duration,
                "watched_percentage": watched_percentage
            }), 200

        except Exception as e:
            return jsonify({"error": f"Đã xảy ra lỗi: {str(e)}"}), 500

    @jwt_required()
    @staticmethod
    def get_watched_percentage(video, user_id):
        """Tính phần trăm đã xem của video cho người dùng."""
        progress = next(
            (p for p in video.watched_duration_by_user if str(p.user.id) == str(user_id)), 
            None
        )
        if progress:
            return (progress.watched_duration / video.duration) * 100
        return 0
    @jwt_required()
    @staticmethod
    def create_video(course_slug):
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")
            current_user = User.objects(email=email).first()  # pylint: disable=E1101

            if not current_user:
                return jsonify({"error": "Người dùng không tồn tại."}), 404

            course = Course.objects(slug=course_slug).first()  # pylint: disable=E1101
            if not course:
                return jsonify({"error": "Khóa học không tồn tại."}), 404

            video_data = request.get_json()

            title = video_data.get("title")
            url = video_data.get("url")
            description = video_data.get("description", "")

            if not title or not url:
                return jsonify({"error": "Thiếu thông tin bắt buộc (title, url)."}), 400
            duration = get_video_duration(url)
            if not duration:
                return jsonify({"error": "Không thể lấy thời gian video từ URL."}), 400
            video_slug = slugify(title)

            existing_video = next((v for v in course.videos if v.slug == video_slug), None)
            if existing_video:
                return jsonify({"error": f"Video với slug '{video_slug}' đã tồn tại trong khóa học."}), 400

            video = Video(
                title=title,
                url=url,
                description=description,
                duration=duration,
                slug=video_slug
            )

            # Lưu video vào khóa học
            course.videos.append(video)
            course.save()

            return jsonify({"message": "Video đã được tạo và thêm vào khóa học."}), 201

        except Exception as e:
            return jsonify({"error": f"Đã xảy ra lỗi: {str(e)}"}), 500
        
    
    @jwt_required()
    @staticmethod
    def update_video(course_slug, video_slug):
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")
            current_user = User.objects(email=email).first()  # pylint: disable=E1101

            if not current_user:
                return jsonify({"error": "Người dùng không tồn tại."}), 404

            course = Course.objects(slug=course_slug).first()  # pylint: disable=E1101
            if not course:
                return jsonify({"error": "Khóa học không tồn tại."}), 404

            video = next((v for v in course.videos if v.slug == video_slug), None)
            if not video:
                return jsonify({"error": "Video không tồn tại."}), 404

            video_data = request.get_json()
            title = video_data.get("title", video.title)  # Nếu không có title mới, giữ nguyên
            url = video_data.get("url", video.url)
            description = video_data.get("description", video.description)
            duration = video_data.get("duration", video.duration)

            video.title = title
            video.url = url
            video.description = description
            video.duration = duration
            video.slug = slugify(title)  

            course.save()

            return jsonify({"message": "Video đã được cập nhật."}), 200

        except Exception as e:
            return jsonify({"error": f"Đã xảy ra lỗi: {str(e)}"}), 500

    @jwt_required()
    @staticmethod
    def delete_video(course_slug, video_slug):
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")
            current_user = User.objects(email=email).first()  # pylint: disable=E1101

            if not current_user:
                return jsonify({"error": "Người dùng không tồn tại."}), 404

            course = Course.objects(slug=course_slug).first()  # pylint: disable=E1101
            if not course:
                return jsonify({"error": "Khóa học không tồn tại."}), 404

            video = next((v for v in course.videos if v.slug == video_slug), None)
            if not video:
                return jsonify({"error": "Video không tồn tại."}), 404

            course.videos.remove(video)
            course.save()

            return jsonify({"message": "Video đã được xóa khỏi khóa học."}), 200

        except Exception as e:
            return jsonify({"error": f"Đã xảy ra lỗi: {str(e)}"}), 500
    
    @jwt_required()
    @staticmethod
    def update_video_progress(course_slug, video_slug):
        try:
            # Lấy thông tin người dùng từ JWT
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")
            current_user = User.objects(email=email).first() # pylint: disable=E1101

            if not current_user:
                return jsonify({"error": "Người dùng không tồn tại."}), 404

            course = Course.objects(slug=course_slug).first() # pylint: disable=E1101
            if not course:
                return jsonify({"error": "Khóa học không tồn tại."}), 404

            video = next((v for v in course.videos if v.slug == video_slug), None)
            if not video:
                return jsonify({"error": "Video không tồn tại trong khóa học."}), 404

            progress_data = request.get_json()
            watched_duration = progress_data.get("watched_duration", 0)

            if watched_duration < 0:
                return jsonify({"error": "Thời gian xem không hợp lệ."}), 400

            progress = next((p for p in video.watched_duration_by_user if p.user == current_user), None)
            if not progress:
                progress = VideoProgress(user=current_user, watched_duration=watched_duration) # pylint: disable=E1101
                video.watched_duration_by_user.append(progress)
            else:
                progress.watched_duration = min(watched_duration, video.duration)
                progress.completed = progress.watched_duration >= video.duration * 0.8
            course.save()

           

            return jsonify({"message": "Cập nhật tiến độ video thành công.", "completed": progress.completed }), 200

        except Exception as e:
            return jsonify({"error": f"Đã xảy ra lỗi: {str(e)}"}), 500


