from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    USER_TYPE_CHOICES = [
        ('interpreter', 'Interpreter'),
        ('overseer', 'Overseer'),
        ('superuser', 'Superuser'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='interpreter')
    savedVocabulary = models.JSONField(default=list)

    def __str__(self):
        return f"{self.user.username} - {self.get_user_type_display()}"

    def is_interpreter(self):
        return self.user_type == 'interpreter'

    def is_overseer(self):
        return self.user_type == 'overseer'

    def is_superuser(self):
        return self.user_type == 'superuser'