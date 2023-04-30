from django.db import models

# Create your models here.

class Book(models.Model):
    body = models.CharField(max_length=500)
    last_read = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.body[0:50] # first 50 chaarcters