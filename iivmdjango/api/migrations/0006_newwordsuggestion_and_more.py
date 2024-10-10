# Generated by Django 5.1.1 on 2024-10-04 19:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_suggestiontovocabularyitem_status'),
    ]

    operations = [
        migrations.CreateModel(
            name='NewWordSuggestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('term', models.CharField(max_length=100)),
                ('definition', models.TextField()),
                ('translation', models.CharField(max_length=100)),
                ('language', models.CharField(max_length=2)),
                ('category', models.CharField(max_length=100)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending', max_length=20)),
            ],
        ),
        migrations.AlterField(
            model_name='suggestiontovocabularyitem',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending', max_length=20),
        ),
    ]
