from mongoengine import (
    Document,
    StringField,
    EmbeddedDocument,
    DateTimeField,
    ReferenceField,
    ListField,
    IntField,
    EmbeddedDocumentField,BooleanField
)
from datetime import datetime
from slugify import slugify
from app.models import User, UserInfo

class VideoProgress(EmbeddedDocument):
    user = ReferenceField(User, required=True)  
    watched_duration = IntField(default=0, min_value=0) 
    completed = BooleanField(default=False)  
    created_at = DateTimeField(default=datetime.now) 
    def to_dict(self):
        return {
            "user": str(self.user.id) if self.user else None,
            "watched_duration": self.watched_duration,
            "completed": self.completed,
            "created_at": self.created_at.isoformat(),
        }

class Video(EmbeddedDocument):
    title = StringField(required=True)  
    url = StringField(required=True) 
    description = StringField()  
    duration = IntField(required=True, min_value=1)  
    watched_duration = IntField(default=0, min_value=0)  
    watched_duration_by_user = ListField(EmbeddedDocumentField(VideoProgress)) 
    created_at = DateTimeField(default=datetime.now) 
    slug = StringField()

    
class Course(Document):
    name = StringField(required=True)
    slug = StringField(unique=True)
    image = StringField()
    price = IntField(min_value=0)
    discount = IntField(default=0, min_value=0, max_value=100)
    tag = StringField()
    start_date = DateTimeField(required=True)
    end_date = DateTimeField(required=True)
    content = StringField()
    what_learn = StringField()
    description = StringField(default="")
    students = ListField(ReferenceField(UserInfo))
    videos = ListField(EmbeddedDocumentField(Video))
    revenue= IntField(default=0)
    completed = IntField( default=0 , min_value=0)  
    created_by = ReferenceField(User, required=True)
    created_at = DateTimeField(default=datetime.now)
    updated_at = DateTimeField(default=datetime.now)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        self.updated_at = datetime.now()
        return super(Course, self).save(*args, **kwargs)

    @property
    def final_price(self):
        return self.price * (1 - self.discount / 100)
    def check_completion(self, user):
        total_videos = len(self.videos)
        if total_videos == 0:
            return False

        completed_videos = 0
        for video in self.videos:
            progress = next((p for p in video.watched_duration_by_user if p.user == user), None)
            if progress and progress.completed:
                completed_videos += 1

        completed=completed_videos / total_videos 
        
        self.completed = completed
        self.save()
        return completed
    meta = {
        "collection": "Course","ordering": ["-created_at"],
    }
