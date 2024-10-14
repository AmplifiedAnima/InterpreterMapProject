from rest_framework import serializers
from .models import VocabularyItem, Translation, NewWordSuggestion, SuggestionToVocabularyItem
import uuid
from itertools import groupby

class TranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Translation
        fields = ['id', 'language', 'translation', 'is_primary', 'is_colloquial', 'is_user_proposed']
        
class VocabularyItemSerializer(serializers.ModelSerializer):
    translations = TranslationSerializer(many=True, read_only=True)
    primary_translations = serializers.SerializerMethodField()
    colloquial_terms = serializers.SerializerMethodField()
    user_proposed_translations = serializers.SerializerMethodField()

    class Meta:
        model = VocabularyItem
        fields = ['id', 'term', 'definition', 'category', 'translations', 'primary_translations', 'colloquial_terms', 'user_proposed_translations']

    def get_primary_translations(self, obj):
        return {t.language: t.translation for t in obj.translations.filter(is_primary=True)}

    def get_colloquial_terms(self, obj):
        colloquial_translations = obj.translations.filter(is_colloquial=True)
        return {
            language: [t.translation for t in language_translations]
            for language, language_translations in groupby(colloquial_translations, key=lambda x: x.language)
        }

    def get_user_proposed_translations(self, obj):
        user_proposed_translations = obj.translations.filter(is_user_proposed=True)
        return {
            language: [t.translation for t in language_translations]
            for language, language_translations in groupby(user_proposed_translations, key=lambda x: x.language)
        }

    def create(self, validated_data):
        if 'id' not in validated_data:
            validated_data['id'] = str(uuid.uuid4())[:10]
        return super().create(validated_data)
    
class NewWordSuggestionSerializer(serializers.ModelSerializer):
    like_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = NewWordSuggestion
        fields = ['id', 'term', 'definition', 'translation', 'language', 'category', 'status', 'like_count']
        read_only_fields = ['status', 'like_count']

class SuggestionToVocabularyItemSerializer(serializers.ModelSerializer):
    vocabulary_item = serializers.PrimaryKeyRelatedField(queryset=VocabularyItem.objects.all())
    like_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = SuggestionToVocabularyItem
        fields = ['id', 'vocabulary_item', 'suggestion_type', 'suggestion', 'language', 'status', 'like_count']
        read_only_fields = ['status', 'like_count']
