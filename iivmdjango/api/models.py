from django.db import models
from django.contrib.auth.models import User

class VocabularyItem(models.Model):
    id = models.CharField(max_length=10, primary_key=True)
    term = models.CharField(max_length=100)
    definition = models.CharField(max_length=1000)
    category = models.CharField(max_length=100)

    def __str__(self):
        return self.term

class Translation(models.Model):
    vocabulary_item = models.ForeignKey(VocabularyItem, related_name='translations', on_delete=models.CASCADE)
    language = models.CharField(max_length=2)
    translation = models.CharField(max_length=100)
    is_primary = models.BooleanField(default=False)
    is_colloquial = models.BooleanField(default=False)
    is_user_proposed = models.BooleanField(default=False)

    class Meta:
        unique_together = ['vocabulary_item', 'language', 'translation']

    def __str__(self):
        return f"{self.vocabulary_item.term} - {self.language}: {self.translation}"

class NewWordSuggestion(models.Model):
    term = models.CharField(max_length=100)
    definition = models.TextField()
    translation = models.CharField(max_length=100)
    language = models.CharField(max_length=2)
    category = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected')
    ], default='pending')
    likes = models.ManyToManyField(User, related_name='liked_new_word_suggestions', blank=True)

    def __str__(self):
        return f"New word suggestion: {self.term}"

    @property
    def like_count(self):
        return self.likes.count()

class SuggestionToVocabularyItem(models.Model):
    vocabulary_item = models.ForeignKey(VocabularyItem, on_delete=models.CASCADE)
    suggestion_type = models.CharField(max_length=20, choices=[('colloquial', 'Colloquial Term'), ('translation', 'Translation')])
    suggestion = models.TextField()
    language = models.CharField(max_length=2)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending')
    likes = models.ManyToManyField(User, related_name='liked_vocabulary_suggestions', blank=True)

    def __str__(self):
        return f"Suggestion for {self.vocabulary_item.term}"

    @property
    def like_count(self):
        return self.likes.count()
