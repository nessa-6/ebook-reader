from django.db import models

# Create your models here.

class Book(models.Model):
    title = models.CharField(max_length=200, default='Title', blank=True)
    body = models.TextField(null=True)
    last_read = models.DateTimeField(auto_now=True)
    
    # TODO: create chapter field
    # TODO: split book into pages
    
    def __str__(self):
        return f'{self.title}'

class Translation(models.Model):
    term = models.TextField(null=True, blank=True)
    definition = models.TextField(null=True, blank=True)
    added = models.DateTimeField(auto_now=True)
    book_id = models.ManyToManyField(Book, related_name="translations")
    timesTranslated = models.IntegerField(default=1)
    
    def __str__(self):
        return f'{self.term}: {self.definition}'
    
    # TODO: create chapter foreign key to categorise translations by chapter