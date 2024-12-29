from flask import Blueprint
from app.controllers.course_controller import Courses
from app.controllers.video_controller import VideoService

course_bp = Blueprint('course', __name__)
# Course
course_bp.add_url_rule('/getAllCourse', view_func=Courses.showAll, methods=['GET'])
course_bp.add_url_rule('/getCourse', view_func=Courses.show, methods=['GET'])
course_bp.add_url_rule('/getOneCourse/<course_slug>', view_func=Courses.getOneCourse, methods=['GET'])
course_bp.add_url_rule('/createCourse', view_func=Courses.create, methods=['POST'])
course_bp.add_url_rule('/<course_id>', view_func=Courses.update, methods=['PUT'])
course_bp.add_url_rule('/<course_id>', view_func=Courses.delete, methods=['DELETE'])

# Video 
course_bp.add_url_rule('/video/<video_slug>', view_func=VideoService.get_video, methods=['GET']) 
course_bp.add_url_rule('/video/<course_slug>', view_func=VideoService.create_video, methods=['POST'])
course_bp.add_url_rule('/video/update_progress/<course_slug>/<video_slug>', view_func=VideoService.update_video_progress, methods=['POST'])
course_bp.add_url_rule('/video/<course_slug>/<video_slug>', view_func=VideoService.update_video, methods=['PUT'])
course_bp.add_url_rule('/video/<course_slug>/<video_slug>', view_func=VideoService.delete_video, methods=['DELETE'])
