from mongoengine import Document, ReferenceField, StringField, DateTimeField, BooleanField
from datetime import datetime

class CertificateRequest(Document):
    user = ReferenceField('User', required=True)
    course = ReferenceField('Course', required=True)
    requested_at = DateTimeField(default=datetime.now)
    approved = BooleanField(default=False)
    approved_by = ReferenceField('User', null=True)  # Người duyệt yêu cầu
    approved_at = DateTimeField(null=True)
