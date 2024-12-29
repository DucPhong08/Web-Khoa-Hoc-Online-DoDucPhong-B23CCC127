from mongoengine import Document, StringField, DateTimeField, ReferenceField
from app.models import User
from datetime import datetime


class Like(Document):
    target_type = StringField(choices=["post", "comment"], required=True)
    target_id = StringField(required=True)  
    user = ReferenceField(User, required=True)
    created_at = DateTimeField(default=datetime.now)

    meta = {"collection": "Like"}
