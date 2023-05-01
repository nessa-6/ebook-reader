from django.db import models

# Create your models here.

class Book(models.Model):
    title = models.CharField(max_length=200, default='Title')
    body = models.TextField(null=True, blank=True)
    last_read = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title