from mongoengine import Document, StringField, ReferenceField, BooleanField, DateTimeField
from datetime import datetime
from app.models import User

class Notification(Document):
    sender = ReferenceField(User, required=True) 
    recipient = ReferenceField(User, required=False) 
    title = StringField(required=True)  
    message = StringField(required=True)  
    read = BooleanField(default=False)  
    type = StringField(choices=["general", "role_request", "certificate"], required=True)
    created_at = DateTimeField(default=datetime.now) 
    updated_at = DateTimeField(default=datetime.now) 

    def mark_as_read(self):
        self.read = True
        self.updated_at = datetime.now()
        self.save()

    meta = {
        "collection": "Notification",
        "ordering": ["-created_at"],
    }
