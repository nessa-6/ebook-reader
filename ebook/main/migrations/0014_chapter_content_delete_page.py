# Generated by Django 4.2 on 2023-05-27 18:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0013_remove_translation_page_chapter_num'),
    ]

    operations = [
        migrations.AddField(
            model_name='chapter',
            name='content',
            field=models.TextField(null=True),
        ),
        migrations.DeleteModel(
            name='Page',
        ),
    ]
