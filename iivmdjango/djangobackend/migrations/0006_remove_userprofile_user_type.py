# Generated by Django 5.1.1 on 2024-10-05 09:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('djangobackend', '0005_userprofile_user_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='user_type',
        ),
    ]
