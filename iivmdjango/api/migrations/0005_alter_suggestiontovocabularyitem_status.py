# Generated by Django 5.1.1 on 2024-10-03 12:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_suggestiontovocabularyitem_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='suggestiontovocabularyitem',
            name='status',
            field=models.CharField(choices=[('pending', 'accepted')], max_length=20),
        ),
    ]
