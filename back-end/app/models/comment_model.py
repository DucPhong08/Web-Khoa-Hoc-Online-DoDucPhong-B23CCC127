from mongoengine import Document, StringField, DateTimeField , ReferenceField, ListField
from app.models import User
from datetime import datetime

class Comment(Document):
    post = ReferenceField('Post', required=True)
    user = ReferenceField(User, required=True)
    content = StringField(required=True)
    likes = ListField(ReferenceField(User))  # Danh sách người dùng thích bình luận
    created_at = DateTimeField(default=datetime.now)
