from django.contrib import admin

# Register your models here.

from .models import Book, Chapter, Translation

admin.site.register(Book)
admin.site.register(Chapter)
admin.site.register(Translation)