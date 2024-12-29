from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import base64
from app.models import Course, User, UserInfo ,Review
from datetime import datetime


class Courses:
    @staticmethod
    def showAll():
        try:
            offset = int(request.args.get('offset', 0))  
            limit = int(request.args.get('limit', 4))  

            total_courses = Course.objects().count()  # pylint: disable=E1101

            courses = Course.objects.skip(offset).limit(limit)  # pylint: disable=E1101

            if not courses:
                return jsonify({"message": "Không có khóa học nào."}), 404

            # Format dữ liệu khóa học
            course_list = [
                {
                    "name": course.name,
                    "image": course.image,
                    "price": course.price,
                    "discount": course.discount,
                    "content": course.content,
                    "what_learn": course.what_learn,
                    "description": course.description,
                    "start_date": course.start_date.strftime('%d-%m-%Y'),
                    "end_date": course.end_date.strftime('%d-%m-%Y'),
                    "final_price": course.final_price,
                    "student": len(course.students) or "",
                    "tag": course.tag,
                    "videos":len(course.videos),
                    "created_by": course.created_by.name,
                    "slug": course.slug
                }
                for course in courses
            ]

            return jsonify({
                "courses": course_list,
                "total_courses": total_courses,
                "offset": offset,
                "limit": limit,
                "has_more": offset + limit < total_courses 
            }), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @staticmethod
    def getOneCourse(course_slug):
        try:
            course = Course.objects(slug=course_slug).first()  # pylint: disable=E1101

            if not course:
                return jsonify({"message": "Không có khóa học này."}), 404
            reviews = Review.objects(course=course.id)  # pylint: disable=E1101
            review_list = [
                {
                    "user_name": User.objects(id=review.user.id).first().name, # pylint: disable=E1101
                    "rating": review.rating,
                    "comment": review.comment,
                    "created_at": review.created_at
                }
                for review in reviews] 

            course_data = {
                "name": course.name,
                "image": course.image,
                "price": course.price,
                "discount": course.discount,
                "content": course.content,
                "what_learn": course.what_learn, 
                "videos": [
                                    {
                                        "title": video.title,        
                                        "url": video.url,            
                                        "duration": video.duration,
                                        "description" : video.description ,
                                        "watched_duration_by_user": [progress.to_dict() for progress in video.watched_duration_by_user],
                                        "duration_by_user" : video.duration,
                                        "slug_video" : video.slug,
                                    }
                                    for video in course.videos  
                                ],
                "description": course.description,
                "start_date": course.start_date.strftime('%Y-%m-%d'),
                "end_date": course.end_date.strftime('%Y-%m-%d'),
                "final_price": course.final_price,
                "student": len(course.students) or "",
                "tag": course.tag,
                "created_by": course.created_by.name,
                "reviews": review_list or [],
                "slug": course.slug
            }

            return jsonify({"course": course_data}), 200  
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    @staticmethod
    @jwt_required()
    def show():
        try:
            courses = Course.objects()  # pylint: disable=E1101
            course_list = []
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")
            print(role)

            if role == "admin":
                # Trả về tất cả các khóa học
                for course in courses:
                    created_by_user = User.objects(# pylint: disable=E1101
                        id=course.created_by.id
                    ).first()  
                    course_list.append(
                        {
                            "id": str(course.id),
                            "slug": course.slug,
                            "name": course.name,
                            "course": course.name,
                            "content": course.content,
                            "what_learn": course.what_learn,
                            "description": course.description,
                            "videos": [
                                    {
                                        "title": video.title,        
                                        "url": video.url,            
                                        "duration": video.duration,   
                                        "slug_video" : video.slug,
                                        "description" : video.description, 
                                    }
                                    for video in course.videos  
                                ],
                            "tag": course.tag,
                            "start_date": course.start_date.strftime('%d-%m-%Y'),
                            "end_date": course.end_date.strftime('%d-%m-%Y'),
                            "final_price": course.final_price,
                            "revenue": course.revenue or 0,
                            "created_by": (
                                created_by_user.name
                                if created_by_user
                                else "Không tìm thấy thông tin người tạo"
                            ),  # Thông tin người tạo khóa học
                        }
                    )

            elif role == "teacher":
                # Lọc các khóa học mà giảng viên đã tạo
                teacher_courses = [
                    course for course in courses if course.created_by.email == email
                ]
                if not teacher_courses:
                    return (
                        jsonify({"message": "Bạn chưa tạo khóa học nào"}),
                        200,
                    )  # Thông báo cho giảng viên

                for course in teacher_courses:
                    created_by_user = User.objects(# pylint: disable=E1101
                        id=course.created_by.id
                    ).first()  
                    course_list.append(
                        {
                            "id": str(course.id),
                            "slug": course.slug,
                            "name": course.name,
                            "course": course.name,
                            "content": course.content,
                            "what_learn": course.what_learn,
                            "videos": [
                                    {
                                        "title": video.title,        
                                        "url": video.url,            
                                        "duration": video.duration, 
                                        "slug_video" : video.slug,
                                        "description" : video.description 
                                    }
                                    for video in course.videos  
                                ],
                            "revenue": course.revenue or 0,
                            "description": course.description,
                            "tag": course.tag,
                            "start_date": course.start_date.strftime('%d-%m-%Y'),
                            "end_date": course.end_date.strftime('%d-%m-%Y'),
                            "final_price": course.final_price,
                            "created_by": (
                                created_by_user.name
                                if created_by_user
                                else "Không tìm thấy thông tin người tạo"
                            ),
                        }
                    )

            return jsonify({"courses": course_list}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @jwt_required()
    def create():
        try:
            # Lấy dữ liệu từ body
            data = request.get_json()
            if not data:
                return (
                    jsonify(
                        {"error": "Dữ liệu không hợp lệ, không tìm thấy body request."}
                    ),
                    400,
                )

            # Lấy thông tin từ JWT
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")
            print(email)

            # Kiểm tra quyền
            if role not in ["admin", "teacher"]:
                return jsonify({"error": "Bạn không có quyền tạo khóa học."}), 403

            # Kiểm tra dữ liệu bắt buộc
            required_fields = {
                "name": "Tên khóa học",
                "start_date": "Ngày bắt đầu",
                "end_date": "Ngày kết thúc",
                "content": "Nội dung khóa học",
            }

            missing_fields = [
                field
                for field in required_fields
                if field not in data
                or not isinstance(data[field], str)
                or not data[field].strip()
            ]

            if missing_fields:
                missing_descriptions = [
                    required_fields[field] for field in missing_fields
                ]
                return (
                    jsonify(
                        {
                            "error": f"Dữ liệu không hợp lệ, thiếu hoặc rỗng thông tin bắt buộc: {', '.join(missing_descriptions)}"
                        }
                    ),
                    400,
                )
            try:
                start_date = datetime.fromisoformat(data["start_date"])
                end_date = datetime.fromisoformat(data["end_date"])
                if start_date >= end_date:
                    return (
                        jsonify({"error": "Ngày bắt đầu phải nhỏ hơn ngày kết thúc."}),
                        400,
                    )
            except ValueError:
                return jsonify({"error": "Lỗi định dạng ngày tháng "}), 400

            existing_course_name = Course.objects(# pylint: disable=E1101
                name=data["name"]
            ).first()  
            existing_course_course = Course.objects(# pylint: disable=E1101
                 content=data["content"]
            ).first() 
            if existing_course_name or existing_course_course :
                return (
                    jsonify({"error": "Khóa học với tên hoặc nội dung này đã tồn tại."}),
                    400,
                )

            # Kiểm tra và xử lý danh sách học viên
            student_ids = data.get("students", [])
            students = []
            for student_id in student_ids:
                student = UserInfo.objects(# pylint: disable=E1101
                    id=student_id
                ).first()  
                if student:
                    students.append(student)
                else:
                    return (
                        jsonify(
                            {"error": f"Học viên với ID {student_id} không tồn tại."}
                        ),
                        400,
                    )

            current_user = User.objects(email=email).first()  # pylint: disable=E1101
            if not current_user:
                return jsonify({"error": "Người dùng không tồn tại."}), 404

            course = Course(
                name=data.get("name"),
                start_date=start_date,
                end_date=end_date,
                image=data.get("image", ""),
                price=data.get("price", 0),
                discount=data.get("discount", 0),
                tag=data.get("tag", "Khóa học"),
                content=data.get("content", ""),
                what_learn=data.get("what_learn", ""),
                description=data.get("description", ""),
                created_by=current_user,
                students=students,
            )
            course.save()  # Lưu vào cơ sở dữ liệu

            return (
                jsonify(
                    {
                        "message": "Khóa học đã được tạo thành công",
                        "course": course.to_json(),
                    }
                ),
                201,
            )

        except Exception as e:
            return jsonify({"error": f"Đã xảy ra lỗi khi tạo khóa học: {str(e)}"}), 500

    @staticmethod
    @jwt_required()
    def update(course_id):
        data = request.get_json()
        identity = get_jwt_identity()
        decoded_identity = base64.b64decode(identity).decode("utf-8")
        email, role = decoded_identity.split("|")

        # Lấy khóa học cần cập nhật
        course = Course.objects(slug=course_id).first()  # pylint: disable=E1101

        if not course:
            return jsonify({"error": "Khóa học không tồn tại"}), 404

        if role != "admin" and course.created_by.email != email:
            return jsonify({"error": "Bạn không có quyền sửa khóa học này."}), 403

        for key, value in data.items():
            if hasattr(course, key):
                if key == "students":
                    students = []
                    for student_id in value:
                        student = UserInfo.objects(# pylint: disable=E1101
                            id=student_id
                        ).first()  
                        if student:
                            students.append(student)
                        else:
                            return (
                                jsonify(
                                    {
                                        "error": f"Học viên với ID {student_id} không tồn tại."
                                    }
                                ),
                                400,
                            )
                    setattr(course, key, students)  # Gán danh sách học viên
                else:
                    setattr(course, key, value)

        course.save()

        return (
            jsonify(
                {
                    "message": "Khóa học đã được cập nhật thành công",
                    "course": course.to_json(),
                }
            ),
            200,
        )

    @staticmethod
    @jwt_required()
    def delete(course_id):
        """Xóa khóa học"""
        try:
            # Lấy thông tin từ token
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")

            course = Course.objects(id=course_id).first()  # pylint: disable=E1101

            if not course:
                return jsonify({"error": "Khóa học không tồn tại"}), 404

            # Kiểm tra quyền người tạo khóa học
            if role == "admin":
                pass
            elif role == "teacher":
                if course.created_by.email != email:
                    return (
                        jsonify({"error": "Bạn không có quyền xóa khóa học này."}),
                        403,
                    )
            else:
                return jsonify({"error": "Quyền hạn không hợp lệ."}), 403

            # Tiến hành xóa khóa học
            course.delete()
            return jsonify({"message": "Khóa học đã được xóa thành công"}), 200

        except Exception as e:
            return jsonify({"error": f"Đã xảy ra lỗi khi xóa khóa học: {str(e)}"}), 500
