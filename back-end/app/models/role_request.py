from mongoengine import Document, StringField, ReferenceField, BooleanField, DateTimeField
from datetime import datetime
from app.models import User
class RoleRequest(Document):
    user = ReferenceField(User, required=True)
    requested_role = StringField(choices=["teacher", "admin"], required=True) 
    approved = BooleanField(default=False) 
    reason = StringField()      
    created_at = DateTimeField(default=datetime.now)
    updated_at = DateTimeField(default=datetime.now)

    def approve(self):
        self.approved = True
        self.updated_at = datetime.now()
        self.save()

    meta = {
        "collection": "RoleRequest",
        "ordering": ["-created_at"],
    }
