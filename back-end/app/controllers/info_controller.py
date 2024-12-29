from app.models import UserInfo as UserInfos
from app.models import User, Course , Certificate , CourseStatus,Mxh,CartItem,CertificateRequest
from flask_jwt_extended import jwt_required, get_jwt_identity
import base64
from flask import jsonify, request
from datetime import datetime


class UserInfo:
    @staticmethod
    @jwt_required()
    def get_UserInfo():
        try:
            # Lấy thông tin từ JWT
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")

            user = User.objects(email=email).first()  # pylint: disable=E1101
            UserInfo = UserInfos.objects(user=user.id).first()  # pylint: disable=E1101

            if not UserInfo:
                return jsonify({"error": "Không có dữ liệu người dùng"}), 404

            # Trả về dữ liệu UserInfo
            return jsonify(
                {
                    "id": str(UserInfo.id),
                    "user_id": str(UserInfo.user.id),
                    "name": user.name,
                    "account": email,
                    "image": user.image,
                    "property" : UserInfo.property,
                    "date_of_birth": UserInfo.date_of_birth.strftime('%Y-%m-%d') if UserInfo.date_of_birth else None,
                    "hometown": UserInfo.hometown,
                    "permanent_residence": UserInfo.permanent_residence,
                    "registered_courses": [
                        {
                            "title" : Course.objects(id = course.course.id).first().name,  # pylint: disable=E1101
                            "image" : Course.objects(id = course.course.id).first().image,  # pylint: disable=E1101
                            "content" : Course.objects(id = course.course.id).first().content,  # pylint: disable=E1101
                            "created_by" : Course.objects(id = course.course.id).first().created_by.name,  # pylint: disable=E1101
                            "slug" : Course.objects(id = course.course.id).first().slug,  # pylint: disable=E1101
                            "status" : course.status , 
                            "registered_at": course.registered_at.strftime('%d-%m-%Y'),
                            "completed_at": course.completed_at.strftime('%d-%m-%Y') if course.completed_at else None,
                            "completed": Course.objects(id = course.course.id).first().check_completion(user), # pylint: disable=E1101,
                            "cert": CertificateRequest.objects(course = course.course.id , approved = True).first()  is not None, # pylint: disable=E1101,
                        }
                        
                        
                        
                        for course in UserInfo.registered_courses
                    ],
                    
                    'zalo':UserInfo.socials.zalo ,
                    'fb':UserInfo.socials.fb,
                    'google':UserInfo.socials.google,
                    'introduce': UserInfo.introduce,
                    "created_at": UserInfo.created_at,
                    "updated_at": UserInfo.updated_at,
                    
                }
            ),200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    


    @staticmethod
    @jwt_required()
    def updateInfo():
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")

            user = User.objects(email=email).first()  # pylint: disable=E1101
            
            if not user :
                return jsonify({"error": "User not found"}), 404
            UserInfo = UserInfos.objects(user=user.id).first()  # pylint: disable=E1101
            if not UserInfo:
                return jsonify({"error": "UserInfo not found"}), 404

            data = request.get_json()

            update_data = {}
            if "date_of_birth" in data and data["date_of_birth"]:
                try:
                    update_data["date_of_birth"] = datetime.fromisoformat(data["date_of_birth"])
                except ValueError:
                    return jsonify({"error": "Invalid date format"}), 400
            if "name" in data:  
                update_data["name"] = data["name"]
            if "image" in data:  
                update_data["image"] = data["image"]
            if "hometown" in data:
                update_data["hometown"] = data["hometown"]
            if "permanent_residence" in data:
                update_data["permanent_residence"] = data["permanent_residence"]

            result = UserInfo.update(  # pylint: disable=E1101
                
                set__date_of_birth=update_data.get("date_of_birth"),
                set__hometown=update_data.get("hometown"),
                set__permanent_residence=update_data.get("permanent_residence"),
                set__updated_at=datetime.now(),
            )
            name_user = user.update(
                set__name=update_data.get("name"),
                set__image = update_data.get("image"),
                set__updated_at=datetime.now()
            )

            if result == 0 and name_user == 0:
                return (
                    jsonify({"error": "không có sự thay đổi "}),
                    400,
                )

            return jsonify({"message": "UserInfo updated successfully"}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
    @staticmethod
    @jwt_required()
    def updateIntroduce():
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")
            user = User.objects(email=email).first()  # pylint: disable=E1101
            if not user :
                return jsonify({"error": "User not found"}), 404
            

            # Tìm sinh viên liên kết với User
            UserInfo = UserInfos.objects(user=user.id).first()  # pylint: disable=E1101
            if not UserInfo:
                return jsonify({"error": "UserInfo not found"}), 404

            data = request.get_json()

            update_data = {}
            
            if "introduce" in data:
                update_data["introduce"] = data["introduce"]
            

            result = UserInfos.objects(user=user.id).update_one(  # pylint: disable=E1101
                set__introduce=update_data.get("introduce"),
                set__updated_at=datetime.now(),
            )

            if result == 0:
                return (
                    jsonify({"error": "không có sự thay đổi "}),
                    400,
                )

            return jsonify({"message": "UserInfo updated successfully"}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
    @staticmethod
    @jwt_required()
    def updateMXH():
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")

            user = User.objects(email=email).first()# pylint: disable=E1101
            if not user:
                return jsonify({"error": "User not found"}), 404

            user_info = UserInfos.objects(user=user.id).first() # pylint: disable=E1101
            if not user_info:
                return jsonify({"error": "UserInfo not found"}), 404

            data = request.get_json()

            if "socials" not in data:
                return jsonify({"error": "No social data provided"}), 400

            social_data = data.get("socials")
            if not isinstance(social_data, dict):
                return jsonify({"error": "Invalid social data format"}), 400

            if user_info.socials:
                user_info.socials.zalo = social_data.get("zalo", user_info.socials.zalo)
                user_info.socials.fb = social_data.get("fb", user_info.socials.fb)
                user_info.socials.google = social_data.get("google", user_info.socials.google)
            else:
                user_info.socials = Mxh(
                    zalo=social_data.get("zalo", ""),
                    fb=social_data.get("fb", ""),
                    google=social_data.get("google", "")
                )

            # Lưu cập nhật
            user_info.updated_at = datetime.now()
            user_info.save()

            return jsonify({"message": "UserInfo updated successfully"}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
    @staticmethod
    @jwt_required()
    def updateProperty():
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")
            user = User.objects(email=email).first()  # pylint: disable=E1101
            if not user :
                return jsonify({"error": "User not found"}), 404
            

            UserInfo = UserInfos.objects(user=user.id).first()  # pylint: disable=E1101
            if not UserInfo:
                return jsonify({"error": "UserInfo not found"}), 404

            data = request.get_json()

            update_data = {}
            
            if "property" in data:
                update_data["property"] = data["property"]
            

            result = UserInfos.objects(user=user.id).update_one(  # pylint: disable=E1101
                set__property=update_data.get("property"),
                set__updated_at=datetime.now(),
            )

            if result == 0:
                return (
                    jsonify({"error": "không có sự thay đổi "}),
                    400,
                )

            return jsonify({"message": "UserInfo updated successfully"}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
    

    

    @staticmethod
    @jwt_required()
    def register_or_unregister_course(course_slug):
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")

           
            user = User.objects(email=email).first()  # pylint: disable=E1101
            if not user:
                return jsonify({"error": "Người dùng không tồn tại"}), 404

            user_info = UserInfos.objects(user=user.id).first()  # pylint: disable=E1101
            if not user_info:
                return jsonify({"error": "UserInfo not found"}), 404

            course = Course.objects(slug=course_slug).first()  # pylint: disable=E1101
            if not course:
                return jsonify({"error": "Course not found"}), 404

            if request.method == "POST":
                if any(course_status.course == course for course_status in user_info.registered_courses):
                    return jsonify({"error": "Học viên đã đăng kí khóa học"}), 400

                course_status = CourseStatus(course=course, status="learning")
                user_info.registered_courses.append(course_status)

                course.students.append(user_info)

            elif request.method == "DELETE":
                course_status_to_remove = None
                for course_status in user_info.registered_courses:
                    if course_status.course == course:
                        course_status_to_remove = course_status
                        break

                if not course_status_to_remove:
                    return jsonify({"error": "Học viên không trong khóa học"}), 400

                user_info.registered_courses.remove(course_status_to_remove)
                course.students.remove(user_info)

            user_info.save()
            course.save()

            action = "Đăng kí" if request.method == "POST" else "Hủy đăng kí"
            return jsonify({"message": f"Học viên {action} khóa học "}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
    @staticmethod
    @jwt_required()
    def request_certificate(course_id):
        try:
            # Lấy thông tin người dùng từ JWT
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")

            user = User.objects(email=email).first() # pylint: disable=E1101
            UserInfo = UserInfos.objects(user=user.id).first()  # pylint: disable=E1101
            if not UserInfo:
                return jsonify({"error": "UserInfo not found"}), 404

            course = Course.objects(slug=course_id).first() # pylint: disable=E1101
            if not course:
                return jsonify({"error": "Course not found"}), 404

            existing_certificate = next((certificate for certificate in UserInfo.certificates if certificate.course.id == course.id), None)
            if existing_certificate:
                return jsonify({"error": "Bạn đã gửi yêu cầu chứng chỉ cho khóa học này rồi"}), 400

            certificate = Certificate(# pylint: disable=E1101
                course=course,
                issued_by=None,  
                status="pending" 
            )

            # Thêm chứng chỉ vào UserInfo
            UserInfo.certificates.append(certificate)
            UserInfo.save()

            return jsonify({"message": "Bạn đã gửi yêu cầu chứng chỉ thành công"}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
    @staticmethod
    @jwt_required()
    def buy_courses():
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")
            abc = User.objects(email=email).first() # pylint: disable=E1101
            user = UserInfos.objects(user =abc.id).first() # pylint: disable=E1101

            if not user:
                return jsonify({"error": "Người dùng không tồn tại"}), 404

            data = request.get_json()
            course_ids = data.get("course_ids", [])  # Nếu không có course_ids, mặc định là []
            
            if not course_ids:
                course_ids = [str(item.course.id) for item in user.cart]

            if not course_ids:
                return jsonify({"error": "Không có khóa học để mua"}), 400

            total_price = 0
            courses_to_buy = []

            for course_id in course_ids:
                course = Course.objects(id=course_id).first()  # pylint: disable=E1101
                if not course:
                    return jsonify({"error": f"Khóa học {course.name} không tồn tại"}), 404
                
                # Kiểm tra nếu người dùng đã đăng ký khóa học này
                if any(course_status.course == course for course_status in user.registered_courses):
                    return jsonify({"error": f"Bạn đã đăng ký khóa học {course.name}"}), 400
                print('a')
                
                total_price += course.final_price # Tính tổng tiền
                courses_to_buy.append(course)

            if user.property < total_price:
                return jsonify({"error": "Không đủ xu để mua các khóa học"}), 400

            for course in courses_to_buy:
                user.property -= course.final_price
                course.revenue += course.final_price
                course.save()

                course_status = CourseStatus(course=course, status="learning")
                user.registered_courses.append(course_status)

            user.cart = [item for item in user.cart if str(item.course.id) not in course_ids]
            user.save()

            return jsonify({
                "message": "Mua các khóa học thành công",
                "remaining_coins": user.property,
            }), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
    @staticmethod
    @jwt_required()
    def add_to_cart(course_slug):
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, _ = decoded_identity.split("|")
            abc = User.objects(email=email).first() # pylint: disable=E1101
            user_info = UserInfos.objects(user =abc.id).first() # pylint: disable=E1101
            course_id = Course.objects(slug = course_slug).first()  # pylint: disable=E1101

            if not user_info:
                return jsonify({"error": "User not found"}), 404

            for item in user_info.cart:
                if str(item.course.id) == str(course_id.id):
                    return jsonify({"error": "Khóa học đã có trong giỏ hàng"}), 400

            course = Course.objects(id=course_id.id).first() # pylint: disable=E1101
            if not course:
                return jsonify({"error": "Khóa học không tồn tại"}), 404

            cart_item = CartItem(course=course)
            user_info.cart.append(cart_item)
            user_info.save()

            return jsonify({"message": "Đã thêm vào giỏ hàng"}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @jwt_required()
    def get_cart():
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, _ = decoded_identity.split("|")
            abc = User.objects(email=email).first() # pylint: disable=E1101
            user_info = UserInfos.objects(user =abc.id).first() # pylint: disable=E1101
            

            if not user_info:
                return jsonify({"error": "User not found"}), 404

            cart_items = [
                {
                "course_id": str(item.course.id), 
                "title": Course.objects(id = item.course.id).first().name, # pylint: disable=E1101
                "price":Course.objects(id = item.course.id).first().final_price, # pylint: disable=E1101,
                "created_by":Course.objects(id = item.course.id).first().created_by.name, # pylint: disable=E1101
                "crea":len(Course.objects(id = item.course.id).first().videos), # pylint: disable=E1101
                }
                for item in user_info.cart
            ]

            return jsonify({"cart": cart_items}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @jwt_required()
    def remove_from_cart(course_id):
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, _ = decoded_identity.split("|")
            abc = User.objects(email=email).first() # pylint: disable=E1101
            user_info = UserInfos.objects(user =abc.id).first() # pylint: disable=E1101

            if not user_info:
                return jsonify({"error": "User not found"}), 404

            # Xóa khóa học khỏi giỏ
            user_info.cart = [item for item in user_info.cart if str(item.course.id) != course_id]
            user_info.save()

            return jsonify({"message": "Đã xóa khóa học khỏi giỏ hàng"}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500




