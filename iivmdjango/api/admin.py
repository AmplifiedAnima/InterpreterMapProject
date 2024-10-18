from .models import VocabularyItem,SuggestionToVocabularyItem,NewWordSuggestion,Translation
from django.contrib import admin

admin.site.register(VocabularyItem)
admin.site.register(SuggestionToVocabularyItem)
admin.site.register(NewWordSuggestion)
admin.site.register(Translation)