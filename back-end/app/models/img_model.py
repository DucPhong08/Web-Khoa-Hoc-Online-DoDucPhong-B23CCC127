from mongoengine import Document, ReferenceField, StringField, DateTimeField, BooleanField, ListField
from datetime import datetime

class ImgRequest(Document):
    user = ReferenceField('User', required=True)  
    requested_at = DateTimeField(default=datetime.now) 
    img = ListField(StringField()) 
    approved = BooleanField(default=False)  
    approved_by = ReferenceField('User', null=True)  
    approved_at = DateTimeField(null=True)  
    
    def approve(self, approved_by_user):
        self.__class__.objects.filter(approved=True).update(approved=False)  # pylint: disable=E1101
    
        self.approved = True
        self.approved_by = approved_by_user
        self.approved_at = datetime.now()
        self.save()
    def reject(self, rejected_by_user):
        self.approved = False 
        self.approved_by = rejected_by_user
        self.approved_at = datetime.now()  
        self.save()

    meta = {
        'collection': 'ImgRequest', 
        'ordering': ['-requested_at'],  
    }
