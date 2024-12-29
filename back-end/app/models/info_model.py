from mongoengine import (
    Document,
    StringField,
    DateTimeField,
    ReferenceField,
    ListField,
    EmbeddedDocumentField,
    EmbeddedDocument,
    IntField,
)
from app.models import User
from datetime import datetime


class CourseStatus(EmbeddedDocument):
    course = ReferenceField("Course", required=True)
    status = StringField(choices=["learning", "completed"], default="learning")
    registered_at = DateTimeField(default=datetime.now)
    completed_at = DateTimeField()
    
class CartItem(EmbeddedDocument):
    course = ReferenceField("Course", required=True)
    quantity = IntField(default=1)  
    added_at = DateTimeField(default=datetime.now)



class Mxh(EmbeddedDocument):
    zalo = StringField(default="")
    fb = StringField(default="")
    google = StringField(default="")


class Certificate(EmbeddedDocument):
    course = ReferenceField("Course", required=True)
    issued_by = ReferenceField(User)
    request_at = DateTimeField(default=datetime.now)
    issued_at = DateTimeField()
    status = StringField(choices=["pending", "approved"], default="pending")


class UserInfo(Document):
    user = ReferenceField(User, required=True)
    date_of_birth = DateTimeField()
    hometown = StringField()
    permanent_residence = StringField()
    registered_courses = ListField(EmbeddedDocumentField(CourseStatus))
    certificates = ListField(EmbeddedDocumentField(Certificate))
    socials = EmbeddedDocumentField(Mxh)
    introduce = StringField(default="")
    cart = ListField(EmbeddedDocumentField(CartItem))
    property = IntField(default=0)
    created_at = DateTimeField(default=datetime.now)
    updated_at = DateTimeField(default=datetime.now)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if not self.socials:
            self.socials = Mxh()

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now()
        return super(UserInfo, self).save(*args, **kwargs)

    meta = {
        "collection": "UserInfo",
    }
