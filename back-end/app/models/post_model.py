from mongoengine import Document, StringField, DateTimeField, ReferenceField, ListField
from app.models import User
from datetime import datetime

class Post(Document):
    title = StringField(required=True)
    content = StringField(required=True)
    author = ReferenceField(User, required=True)
    image = StringField(required=True)
    tags = StringField()
    likes = ListField(ReferenceField(User))  # Danh sách người dùng thích bài viết
    created_at = DateTimeField(default=datetime.now)
    updated_at = DateTimeField(default=datetime.now)
    
    def save(self, *args, **kwargs):
        self.updated_at = datetime.now()  
        return super(Post, self).save(*args, **kwargs)
    
    meta = {
        'collection': 'Post',  
    }
