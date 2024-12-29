from app.models import User as UserModel
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Course, UserInfo ,CertificateRequest
from flask import jsonify , request
import base64
from datetime import datetime
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt()
class User:
    @staticmethod
    @jwt_required()
    def show_users():
        try:
            users_list = []
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")

            users = UserModel.objects() # pylint: disable=E1101
            user_info = UserInfo.objects()   # pylint: disable=E1101
            courses = Course.objects()  # pylint: disable=E1101

            if role == "admin":
                for user in users:
                    user_info = UserInfo.objects(user = user.id).first() # pylint: disable=E1101
                    print(user.role)
                    if user_info and user.role != 'admin' and user.email != email:
                        users_list.append({
                            "id": str(user.id),
                            "name": user.name,
                            "registered_courses": [
                                {
                                    "id_course": str(course.course.id),
                                    "name": Course.objects(id = course.course.id).first().name, # pylint: disable=E1101
                                    "status": course.status,
                                    "registered_at": course.registered_at.strftime('%d-%m-%Y') if course.registered_at else None,
                                    "completed": Course.objects(id = course.course.id).first().check_completion(user) , # pylint: disable=E1101,
                                    "completed_at": course.completed_at.strftime('%d-%m-%Y') if course.completed_at else None,
                                    "cert": CertificateRequest.objects(course = course.course.id , approved = True).first()  is not None, # pylint: disable=E1101,
                                }
                                for course in user_info.registered_courses
                            ] if user_info.registered_courses else 0,
                            "certificates": len([a for a in  CertificateRequest.objects(user = user.id , approved = True)]), # pylint: disable=E1101
                            "date_of_birth": user_info.date_of_birth.strftime('%d-%m-%Y') if user_info.date_of_birth else None,
                            "hometown": user_info.hometown,
                            "permanent_residence": user_info.permanent_residence,
                        })
                    elif user_info is None and user.role != 'admin' and user.email != email:
                            users_list.append({
                                "id": str(user.id),
                                "name": Course.objects(id = user_info.user.id).first().name,  # pylint: disable=E1101
                                "registered_courses": 0,
                                "date_of_birth": None,
                                "hometown": None,
                                "permanent_residence": None,
                            })

                        

            elif role == "teacher":
                teacher_courses = [
                    course for course in courses if course.created_by.id == UserModel.objects(email = email).first().id  # pylint: disable=E1101
                ]
                print('a')

                if not teacher_courses:
                    return jsonify({"message": "Bạn chưa tạo khóa học nào"}), 200

                teacher_course_ids = {str(course.id) for course in teacher_courses}

                for user in users:
                    user_info = UserInfo.objects(user = user.id).first()  # pylint: disable=E1101
                    if user_info :
                        registered_courses = [
                            {
                                "id": str(course_status.course.id),
                                "name": Course.objects(id = course_status.course.id).name, # pylint: disable=E1101
                                "status": Course.objects(id = course_status.course.id).status, # pylint: disable=E1101
                                "registered_at": course_status.registered_at.strftime('%d-%m-%Y'),
                                "completed": Course.objects(id = course_status.course.id).first().check_completion(user), # pylint: disable=E1101,
                                
                                "completed_at": (
                                    course_status.completed_at.strftime('%d-%m-%Y')
                                    if course_status.completed_at else None
                                )
                            }
                            for course_status in user_info.registered_courses
                            if str(course_status.course.id) in teacher_course_ids
                            
                        ]
                        if registered_courses:
                            users_list.append({
                                "id": str(user_info.user.id),
                                "name":  UserModel.objects(id = user_info.user.id).first().name,  # pylint: disable=E1101
                                "registered_courses": registered_courses
                            })
                    else : 
                        users_list.append({
                            "id": str(user.id),
                            "name": user.name,
                            "registered_courses": 0,
                        })
                    

            return jsonify({"users": users_list}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    @staticmethod
    @jwt_required()
    def show_teacher():
        try:
            users_list = []
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")

            users = UserModel.objects()  # pylint: disable=E1101
            user_info = UserInfo.objects()  # pylint: disable=E1101
            courses = Course.objects()  # pylint: disable=E1101

            if role == "admin":
                for user in users:
                    if user.role == "teacher": 
                        info = next((info for info in user_info if info.user.id == user.id), None)

                        teacher_courses = [course for course in courses if course.created_by.id == user.id]

                        users_list.append({
                            "id": str(user.id),
                            "name": user.name,
                            "email": user.email,
                            "profile": info.to_json(),
                            "courses": len(teacher_courses) ,
                            "created_at": user.created_at.strftime('%Y-%m-%d'),
                            "updated_at": user.updated_at
                        })

            return {"status": "success", "data": users_list}, 200
        except Exception as e:
            return {"status": "error", "message": str(e)}, 500
    @staticmethod
    @jwt_required()
    def change_password():
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, _ = decoded_identity.split("|")

            data = request.get_json()
            current_password = data.get('current_password')
            new_password = data.get('new_password')

            if not current_password or not new_password:
                return jsonify({"error": "Mật khẩu hiện tại và mật khẩu mới bắt buộc"}), 400

            user = UserModel.objects(email=email).first()  # pylint: disable=E1101
            if not user:
                return jsonify({"error": "Người dùng không tồn tại"}), 404

            if not bcrypt.check_password_hash(user.password, current_password):
                return jsonify({"error": "Mật khẩu hiện tại không chính xác"}), 401

            hashed_new_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
            user.password = hashed_new_password
            user.updated_at = datetime.now()
            user.save()

            return jsonify({"message": "Thay đổi mật khẩu thành công"}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    