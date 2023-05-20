from django.db import models

# Create your models here.

class Book(models.Model):
    title = models.CharField(max_length=200, default='Title', blank=True)
    body = models.TextField(null=True, blank=True)
    last_read = models.DateTimeField(auto_now=True, blank=True)
    
    # TODO: split book into pages
    # TODO: make translations into a dictionary of lists where key = page number and value = list of translations
        # e.g. {1: [<Translation object>, <Translation object>], 2: [<Translation object>]}
    
    def __str__(self):
        return f'{self.title}'

class Translation(models.Model):
    term = models.TextField(null=True, blank=True)
    definition = models.TextField(null=True, blank=True)
    added = models.DateTimeField(auto_now=True)
    book_id = models.ManyToManyField(Book, related_name="translations")
    
    def __str__(self):
        return f'{self.term}: {self.definition}'