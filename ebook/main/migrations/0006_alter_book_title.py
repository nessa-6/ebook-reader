# Generated by Django 4.2 on 2023-05-19 18:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_remove_translation_books_translation_book_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='title',
            field=models.CharField(blank=True, default='Title', max_length=200),
        ),
    ]