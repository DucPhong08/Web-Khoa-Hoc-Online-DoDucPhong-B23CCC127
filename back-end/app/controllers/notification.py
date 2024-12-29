from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User, Notification, RoleRequest,CertificateRequest,Course ,ImgRequest

from datetime import datetime
import base64
from mongoengine.errors import ValidationError  
class Notifications:
    @staticmethod
    @jwt_required()
    def send_notification_to_all_users():
        identity = get_jwt_identity()
        decoded_identity = base64.b64decode(identity).decode("utf-8")
        email, role = decoded_identity.split("|")
        
        if role != "admin":
            return jsonify({"error": "Chỉ admin mới có quyền gửi thông báo."}), 403
        
        data = request.get_json()
        if not data or "title" not in data or "message" not in data:
            return jsonify({"error": "Dữ liệu không hợp lệ. Cần có title và message."}), 400
        
        title = data["title"]
        message = data["message"]
        
        users = User.objects() # pylint: disable=E1101
        notifications = []
        for user in users:
            notification = Notification(
                sender=User.objects(email=email).first(),  # pylint: disable=E1101
                recipient=user,
                title=title,
                message=message,
                type="general", 
                created_at=datetime.now(),
                updated_at=datetime.now(),
            )
            notifications.append(notification)
        
        if notifications:
            Notification.objects.insert(notifications)  # pylint: disable=E1101
        
        return jsonify({"success": True, "message": "Thông báo đã được gửi tới tất cả người dùng."}), 200
    
    
    

    @staticmethod
    @jwt_required()
    def send_role_request(requested_role):
        identity = get_jwt_identity()
        decoded_identity = base64.b64decode(identity).decode("utf-8")
        email, role = decoded_identity.split("|")
        user = User.objects(email=email).first() # pylint: disable=E1101
        if not user: 
            return jsonify({"success": False, "error": "Không tìm thấy người dùng."}), 404
        
        existing_request = RoleRequest.objects(user=user, requested_role=requested_role, approved=False).first() # pylint: disable=E1101
        if existing_request:
            return jsonify({"success": False, "error": "Bạn đã có yêu cầu nâng role đang chờ phê duyệt."}), 400
        
        role_request = RoleRequest(user=user, requested_role=requested_role)
        role_request.save()

        return jsonify({"success": True, "message": "Yêu cầu nâng role đã được gửi thành công."}), 201
    
    @staticmethod
    @jwt_required()
    def get_role_requests():
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")

            if role not in ["admin", "teacher"]:
                return jsonify({"success": False, "error": "Bạn không có quyền truy cập danh sách yêu cầu."}), 403

            role_requests = RoleRequest.objects()  # pylint: disable=E1101

            data = [
                {
                    "id": str(req.id),
                    "user": req.user.name,
                    "current_role": req.user.role,
                    "requested_role": req.requested_role,
                    "created_at": req.created_at.strftime('%Y-%m-%d'),
                    "approved": req.approved,
                }
                for req in role_requests
            ]

            return jsonify({"success": True, "data": data}), 200

        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    
    
    @staticmethod
    @jwt_required()
    def approve_role_request(request_id):
        # Lấy thông tin người dùng từ JWT
        identity = get_jwt_identity()
        decoded_identity = base64.b64decode(identity).decode("utf-8")
        email, role = decoded_identity.split("|")
        
        if role not in ["admin", "teacher"]:
            return jsonify({"success": False, "error": "Chỉ admin hoặc teacher mới có quyền phê duyệt yêu cầu."}), 403

        role_request = RoleRequest.objects(id=request_id).first()  # pylint: disable=E1101
        if not role_request:
            return jsonify({"success": False, "error": "Yêu cầu không tồn tại."}), 404
        
        user = User.objects(id=role_request.user.id).first()  # pylint: disable=E1101
        if not user:
            return jsonify({"success": False, "error": "Người dùng không tồn tại."}), 404
        
        user.role = role_request.requested_role
        user.save()

        
        role_request.approve()

        title = "Yêu cầu nâng role đã được phê duyệt"
        message = f"Chúc mừng! Yêu cầu nâng role của bạn đã được phê duyệt và bạn đã trở thành {role_request.requested_role}."
        Notifications.send_notification_to_user(user.id, title, message)

        return jsonify({"success": True, "message": "Yêu cầu nâng role đã được phê duyệt và thông báo đã được gửi."}), 200

    @staticmethod
    @jwt_required()
    def send_notification_to_user(user_id, title, message):
        # Lấy thông tin người dùng từ ID
        user = User.objects(id=user_id).first() # pylint: disable=E1101
        if not user:
            return jsonify({"success": False, "error": "Người dùng không tồn tại."}), 404
        print('a')
        
        # Tạo thông báo
        notification = Notification(
            sender=user,  # Đảm bảo 'user' là đối tượng hợp lệ
            recipient=user,
            title=title,
            message=message,
            type="role_approval",  # Loại thông báo
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        print(notification)
        
        try:
            Notification.objects.insert(notification) # pylint: disable=E1101
        except ValidationError as e:  # Đây là nơi sẽ bắt ValidationError nếu có
            return jsonify({"success": False, "error": str(e)}), 400

        return jsonify({"success": True, "message": "Thông báo đã được gửi đến người dùng."}), 200
    @staticmethod
    @jwt_required()
    def get_notifications():
        identity = get_jwt_identity()
        decoded_identity = base64.b64decode(identity).decode("utf-8")
        email, role = decoded_identity.split("|")
        
        user = User.objects(email=email).first()  # pylint: disable=E1101
        if not user:
            return jsonify({"success": False, "error": "Không tìm thấy người dùng."}), 404
        
        notifications = Notification.objects(recipient=user).order_by("-created_at")  # pylint: disable=E1101
        
        if not notifications:
            return jsonify({"success": False, "message": "Không có thông báo nào."}), 404
        
        notifications_data = [
            {
                "sender": notification.sender.name if notification.sender else None,
                "title": notification.title,
                "message": notification.message,
                "type": notification.type,
                "created_at": notification.created_at,
                "updated_at": notification.updated_at
            }
            for notification in notifications
        ]
        
        return jsonify({"success": True, "notifications": notifications_data}), 200
    @staticmethod
    @jwt_required()
    def request_certificate(course_id):
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, _ = decoded_identity.split("|")

            user = User.objects(email=email).first()  # pylint: disable=E1101
            if not user:
                return jsonify({"error": "Người dùng không tồn tại"}), 404

            course = Course.objects(slug=course_id).first()  # pylint: disable=E1101
            if not course:
                return jsonify({"error": "Khóa học không tồn tại"}), 404

            existing_request = CertificateRequest.objects(user=user.id, course=course.id, approved=False).first()  # pylint: disable=E1101
            if existing_request:
                return jsonify({"error": "Yêu cầu cấp chứng chỉ đã được gửi trước đó"}), 400

            certificate_request = CertificateRequest(user=user, course=course)
            certificate_request.save()

            return jsonify({"success": True, "message": "Yêu cầu cấp chứng chỉ đã được gửi"}), 201

        except Exception as e:
            return jsonify({"error": str(e)}), 500
    @staticmethod
    @jwt_required()
    def approve_certificate_request(request_id):
        try:
            # Xác thực người dùng
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")

            if role != "admin":
                return jsonify({"error": "Bạn không có quyền duyệt yêu cầu"}), 403

            admin_user = User.objects(email=email).first()  # pylint: disable=E1101
            if not admin_user:
                return jsonify({"error": "Admin không tồn tại"}), 404

            certificate_request = CertificateRequest.objects(id=request_id).first()  # pylint: disable=E1101
            if not certificate_request:
                return jsonify({"error": "Yêu cầu không tồn tại"}), 404

            # Cập nhật trạng thái yêu cầu
            certificate_request.approved = True
            certificate_request.approved_by = admin_user
            certificate_request.approved_at = datetime.now()
            certificate_request.save()

            # Tạo thông báo cho người dùng
            user = certificate_request.user
            title = "Chứng chỉ của bạn đã được phê duyệt"
            message = f"Chúc mừng {user.name}! Chứng chỉ của bạn cho khóa học '{certificate_request.course.name}' đã được phê duyệt."
            
            notification = Notification(
                sender=admin_user,
                recipient=user,
                title=title,
                message=message,
                type="certificate_approval",
                created_at=datetime.now(),
                updated_at=datetime.now(),
            )
            notification.save()

            return jsonify({"success": True, "message": "Yêu cầu đã được duyệt và thông báo đã được gửi"}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def get_certificate_requests():
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")

            if role not in ["admin", "teacher"]:
                return jsonify({"error": "Bạn không có quyền truy cập danh sách yêu cầu"}), 403

            user = User.objects(email=email).first()  # pylint: disable=E1101
            if not user:
                return jsonify({"error": "Không tìm thấy người dùng"}), 404

            courses = Course.objects(created_by=user.id)  # pylint: disable=E1101
            if not courses:
                return jsonify({"message": "Người dùng không tạo khóa học nào"}), 200

            course_ids = [course.id for course in courses]
            pending_requests = CertificateRequest.objects(course__in=course_ids)  # pylint: disable=E1101
            if not pending_requests:
                return jsonify({"message": "Không có yêu cầu nào"}), 200

            data = [
                {
                    "id": str(request.id),
                    "user_name": request.user.name,
                    "course_name": request.course.name,
                    "requested_at": request.requested_at.strftime('%d-%m-%Y'),
                    "approved": request.approved,
                }
                for request in pending_requests
            ]

            return jsonify(data), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
    @staticmethod
    @jwt_required()
    def create_img_request():
        try:
            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")
            
            user = User.objects(email=email).first()  # pylint: disable=E1101
            if not user:
                return jsonify({"error": "Không tìm thấy người dùng"}), 404
            
            data = request.get_json()
            
            if not data.get("img"):
                return jsonify({"error": "Thiếu trường bắt buộc"}), 400
            
            img = data["img"]
            
            # Nếu img không phải là danh sách, chuyển nó thành danh sách
            if not isinstance(img, list):
                img = [img]
            
            img_request = ImgRequest(
                user=user,
                img=img  # Lưu img dưới dạng danh sách
            )
            
            img_request.save()

            return jsonify({"success": "Yêu cầu hình ảnh đã được tạo thành công"}), 201
        
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @jwt_required()
    def approve_img_request(request_id):
        try:
            # Tìm yêu cầu ImgRequest từ ID
            img_request = ImgRequest.objects(id=request_id).first() # pylint: disable=E1101
            if not img_request:
                return jsonify({"error": "Không tìm thấy yêu cầu"}), 404

            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")

            if role != "admin":
                return jsonify({"error": "Bạn không có quyền duyệt yêu cầu"}), 403

            admin_user = User.objects(email=email).first() # pylint: disable=E1101
            if not admin_user:
                return jsonify({"error": "Admin không tồn tại"}), 404

            img_request.approve(approved_by_user=admin_user)

            return jsonify({"success": "Yêu cầu đã được duyệt thành công"}), 200
        
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @jwt_required()
    def reject_img_request(request_id):
        try:
            # Tìm yêu cầu ImgRequest từ ID
            img_request = ImgRequest.objects(id=request_id).first() # pylint: disable=E1101
            if not img_request:
                return jsonify({"error": "Không tìm thấy yêu cầu"}), 404

            identity = get_jwt_identity()
            decoded_identity = base64.b64decode(identity).decode("utf-8")
            email, role = decoded_identity.split("|")

            if role != "admin":
                return jsonify({"error": "Bạn không có quyền từ chối yêu cầu"}), 403

            admin_user = User.objects(email=email).first() # pylint: disable=E1101
            if not admin_user:
                return jsonify({"error": "Admin không tồn tại"}), 404
            img_request.reject(approved_by_user=admin_user)

            return jsonify({"success": "Yêu cầu đã bị từ chối thành công"}), 200
        
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    @staticmethod
    def get_qc():
        try:
            

            img_requests = ImgRequest.objects()  # pylint: disable=E1101

            data = [
                {
                    "id": str(req.id),
                    "user": req.user.name,  
                    "img": req.img, 
                    "requested_at": req.requested_at.strftime('%Y-%m-%d'), 
                    "approved": req.approved,
                    "approved_by": req.approved_by.name if req.approved_by else None,
                    "approved_at": req.approved_at.strftime('%Y-%m-%d') if req.approved_at else None,
                }
                for req in img_requests
            ]

            return jsonify({"success": True, "data": data}), 200

        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500
