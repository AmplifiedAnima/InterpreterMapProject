# Generated by Django 5.1.1 on 2024-09-28 19:14

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_suggestiontovocabularyitem'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='suggestiontovocabularyitem',
            name='colloquial_term_propositions',
        ),
        migrations.RemoveField(
            model_name='suggestiontovocabularyitem',
            name='translation_propositions',
        ),
        migrations.AddField(
            model_name='suggestiontovocabularyitem',
            name='language',
            field=models.CharField(default=django.utils.timezone.now, max_length=2),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='suggestiontovocabularyitem',
            name='suggestion',
            field=models.TextField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='suggestiontovocabularyitem',
            name='suggestion_type',
            field=models.CharField(choices=[('colloquial', 'Colloquial Term'), ('translation', 'Translation')], default=django.utils.timezone.now, max_length=20),
            preserve_default=False,
        ),
    ]