from django.db import models

# Create your models here.

class Book(models.Model):
    title = models.CharField(max_length=200, default='Title', blank=True)
    last_read = models.DateTimeField(auto_now=True)
    normalisation = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f'{self.title}'
    
class Chapter(models.Model):
    book = models.ForeignKey('Book', on_delete=models.CASCADE, related_name="chapters")
    name = models.CharField(max_length=200, default='Chapter', blank=True)
    num = models.IntegerField(null=True, blank=True) # TODO: make unique?
    content = models.TextField(default='content')
    # TODO: add sentence field (separate content by sentence for translation purposes)
    
    def __str__(self):
        return f'{self.book}: {self.name} - {self.content[:30]}'
    

class Translation(models.Model):
    term = models.CharField(max_length=300, null=True, blank=True)
    definition = models.CharField(max_length=400, null=True, blank=True)
    added = models.DateTimeField(auto_now=True)
    book_id = models.ManyToManyField(Book, related_name="translations")
    timesTranslated = models.IntegerField(default=1)
    
    def __str__(self):
        return f'{self.term}: {self.definition}'
    