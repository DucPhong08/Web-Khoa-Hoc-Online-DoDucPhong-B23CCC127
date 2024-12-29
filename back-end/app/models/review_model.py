from mongoengine import Document, StringField, DateTimeField, ReferenceField,ValidationError,IntField
from app.models import Course
from app.models import User
from datetime import datetime

def validate_rating(value):
    if not (1 <= value <= 5):
        raise ValidationError("Rating must be between 1 and 5")
class Review(Document):
    course = ReferenceField(Course, required=True)
    user = ReferenceField(User, required=True)
    rating = IntField(min_value=1, max_value=5, required=True, validators=[validate_rating])
    comment = StringField()
    created_at = DateTimeField(default=datetime.now)

    meta = {"collection": "Review", "indexes": ["course", "user"]}
