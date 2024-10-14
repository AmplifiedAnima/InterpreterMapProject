from django.urls import path
from . import vocabulary_views
from . import suggestion_views
from .suggestion_views import create_suggestion_for_the_word,create_new_word_suggestion

urlpatterns = [
    # Vocabulary retrieval URLs
    path("vocabulary-items/", vocabulary_views.getAllVocabularyItems, name="vocabulary-items"),
    path("vocabulary-items/<str:pk>/", vocabulary_views.getSpecificVocabularyItem, name="vocabulary-items-detail"),
    path('vocabulary-items/category/<str:category>/', vocabulary_views.getVocabularyByGroup, name='vocabulary-items-by-category'),
    path('get-category-labels/', vocabulary_views.getCategoryLabels, name='get-category-labels'),
    
    # Search URL
    path('search-vocabulary/', vocabulary_views.searchVocabulary, name='search-vocabulary'),
    
    # Vocabulary creation URL
    path('save-vocabulary-item/', vocabulary_views.create_vocabularyItem, name='save-vocabulary-item'),
    
    # User-specific vocabulary URLs
    path('saved-vocabulary-user/', vocabulary_views.getSavedVocabularyItemsOfUser, name='saved-vocabulary-user'),
    path('save-vocabulary-items-user/', vocabulary_views.saveVocabularyForSavedVocabularyOfUser, name='save-vocabulary-items-user'),
    path('remove-saved-vocabulary-user/', vocabulary_views.removeSavedVocabularyOfUser, name='remove-saved-vocabulary-user'),
    
    # Suggestion-related URLs
    path('suggest-new-word/', create_new_word_suggestion, name='suggest-new-word'),
    path('save-suggestion-for-specific-word/', create_suggestion_for_the_word, name='save-suggestion-for-specific-word'),
    path('get-suggestions-for-specific-word/<str:pk>/', suggestion_views.getSuggestionsForWord, name='get-suggestions-for-specific-word'),
    path('get-suggestions-for-all-words/', suggestion_views.getAllSuggestionsForAllWords, name='get-suggestions-for-all-words'),
    
    # Like-related URLs
    path('like-vocabulary-suggestion/<int:pk>/', suggestion_views.like_vocabulary_suggestion, name='like-vocabulary-suggestion'),
    path('like-new-word-suggestion/<int:pk>/', suggestion_views.like_new_word_suggestion, name='like-new-word-suggestion'),
    
    # Approval-related URLs
    path('approve-new-word-suggestion/<int:pk>/', suggestion_views.approve_new_word_suggestion, name='approve-new-word-suggestion'),
    path('approve-vocabulary-suggestion/<int:pk>/', suggestion_views.approve_vocabulary_suggestion, name='approve-vocabulary-suggestion'),
    path('reject-suggestion/<int:pk>/', suggestion_views.reject_suggestion, name='reject-suggestion'),
]