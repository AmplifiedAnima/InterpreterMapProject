# Generated by Django 5.1.1 on 2024-10-06 09:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_rename_translations_vocabularyitem_primary_translations_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vocabularyitem',
            name='primary_translations',
            field=models.JSONField(default=dict),
        ),
    ]