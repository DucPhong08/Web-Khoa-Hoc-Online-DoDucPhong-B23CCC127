from mongoengine import ( 
    Document,
    StringField,
    DateTimeField,BooleanField
)
from datetime import datetime




class User(Document):
    name = StringField(default = "User-Web",unique=True)
    email = StringField(required=True, unique=True)
    password = StringField(required=True)
    role = StringField(choices=["admin", "teacher", "student"], required=True)
    look = BooleanField(default=False)
    image = StringField(default="")
    created_at = DateTimeField(default=datetime.now)
    updated_at = DateTimeField(default=datetime.now)

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now()
        user = super(User, self).save(*args, **kwargs)
        if self.role == "student":
            from app.models import UserInfo

            if not UserInfo.objects(user=self).first():  # pylint: disable=E1101
                student = UserInfo(user=self)
                student.save()
        return user

    meta = {
        "collection": "User",
    }
