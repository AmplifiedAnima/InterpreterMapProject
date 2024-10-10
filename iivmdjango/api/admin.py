from .models import VocabularyItem,SuggestionToVocabularyItem,NewWordSuggestion
from django.contrib import admin

admin.site.register(VocabularyItem)
admin.site.register(SuggestionToVocabularyItem)
admin.site.register(NewWordSuggestion)