from flask import Blueprint
from app.controllers.notification import Notifications



# Khởi tạo Blueprint cho các route liên quan đến auth
notification_bp = Blueprint("notification", __name__)
notification_bp.add_url_rule(
    "/postNotification", view_func=Notifications.send_notification_to_all_users, methods=["POST"]
)
notification_bp.add_url_rule(
    "/postOneNotification/<user_id>/<title>/<message>", view_func=Notifications.send_notification_to_user, methods=["POST"]
)
notification_bp.add_url_rule(
    "/postRequest/<requested_role>", view_func=Notifications.send_role_request, methods=["POST"]

)
notification_bp.add_url_rule(
    "/getRequestRole", view_func=Notifications.get_role_requests, methods=["GET"]

)
notification_bp.add_url_rule(
    "/approveRequest/<request_id>", view_func=Notifications.approve_role_request, methods=["POST"]

)
notification_bp.add_url_rule(
    "/getNotification", view_func=Notifications.get_notifications, methods=["GET"]
)

notification_bp.add_url_rule("/certificates/request", view_func=Notifications.get_certificate_requests , methods=['GET'])
notification_bp.add_url_rule("/certificates/request/<course_id>", view_func=Notifications.request_certificate , methods=['POST'])
notification_bp.add_url_rule("/certificates/approve/<request_id>", view_func=Notifications.approve_certificate_request , methods=['POST'])
notification_bp.add_url_rule("/certificates/approve/<request_id>", view_func=Notifications.approve_certificate_request , methods=['POST'])


notification_bp.add_url_rule("/get_request", view_func=Notifications.get_qc , methods=['GET'])
notification_bp.add_url_rule("/image_qc/create_request", view_func=Notifications.create_img_request , methods=['POST'])
notification_bp.add_url_rule("/image_qc/approve/<request_id>", view_func=Notifications.approve_img_request , methods=['POST'])
notification_bp.add_url_rule("/image_qc/reject/<request_id>", view_func=Notifications.reject_img_request , methods=['POST'])