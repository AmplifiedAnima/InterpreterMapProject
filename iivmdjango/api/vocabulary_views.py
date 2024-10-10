from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db import transaction
from .serializers import VocabularyItemSerializer, TranslationSerializer, NewWordSuggestionSerializer, SuggestionToVocabularyItemSerializer
from .models import VocabularyItem, Translation, NewWordSuggestion, SuggestionToVocabularyItem
from djangobackend.models import UserProfile
import uuid

@api_view(['GET'])
def getAllVocabularyItems(request):
    queryset = VocabularyItem.objects.all().prefetch_related('translations')
    if not queryset.exists():
        return Response({'detail': 'Vocabulary has not been fetched'}, status=404)
    serializer = VocabularyItemSerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getSpecificVocabularyItem(request, pk):
    try:
        vocabulary_item = VocabularyItem.objects.prefetch_related('translations').get(pk=pk)
    except VocabularyItem.DoesNotExist:
        return Response({'detail': 'Vocabulary item does not exist'}, status=404)
    
    serializer = VocabularyItemSerializer(vocabulary_item)
    categories = list(VocabularyItem.objects.values_list('category', flat=True).distinct())
    
    category_items = VocabularyItem.objects.filter(category=vocabulary_item.category).prefetch_related('translations')
    category_serializer = VocabularyItemSerializer(category_items, many=True)
    
    return Response({
        'item': serializer.data,
        'categoryItems': category_serializer.data,
        'categories': categories
    })

@api_view(['GET'])
def getVocabularyByGroup(request, category):
    queryset = VocabularyItem.objects.filter(category=category).prefetch_related('translations')
    serializer = VocabularyItemSerializer(queryset, many=True)
    categories = list(VocabularyItem.objects.values_list('category', flat=True).distinct())
    
    return Response({
        'items': serializer.data,
        'categories': categories
    })

@api_view(['GET'])
def getCategoryLabels(request):
    categories = list(VocabularyItem.objects.values_list('category', flat=True).distinct())
    return Response(categories, status=status.HTTP_200_OK)

@api_view(['GET'])
def searchVocabulary(request):
    query = request.GET.get('q', '')
    language = request.GET.get('lang', '')
    
    items = VocabularyItem.objects.filter(
        Q(term__icontains=query) |
        Q(translations__translation__icontains=query)
    ).distinct()
    
    if language:
        items = items.filter(translations__language=language)
    
    serializer = VocabularyItemSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_new_word_suggestion(request):
    serializer = NewWordSuggestionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_vocabularyItem(request):
    with transaction.atomic():
        vocabulary_data = {
            'term': request.data.get('term'),
            'definition': request.data.get('definition'),
            'category': request.data.get('category', 'uncategorized'),
        }
        vocabulary_serializer = VocabularyItemSerializer(data=vocabulary_data)
        if vocabulary_serializer.is_valid():
            vocabulary_item = vocabulary_serializer.save()
            
            translations = request.data.get('translations', {})
            for lang, trans in translations.items():
                Translation.objects.create(
                    vocabulary_item=vocabulary_item,
                    language=lang,
                    translation=trans,
                    is_primary=True
                )
            
            return Response(VocabularyItemSerializer(vocabulary_item).data, status=status.HTTP_201_CREATED)
        return Response(vocabulary_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getSavedVocabularyItemsOfUser(request):
    try: 
        user_profile = UserProfile.objects.get(user=request.user)
        saved_vocabulary_ids = user_profile.savedVocabulary
        saved_vocabulary_items = VocabularyItem.objects.filter(id__in=saved_vocabulary_ids).prefetch_related('translations')
        serializer = VocabularyItemSerializer(saved_vocabulary_items, many=True)
        return Response(serializer.data)
    except UserProfile.DoesNotExist:
        return Response({'detail': 'User profile not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def saveVocabularyForSavedVocabularyOfUser(request):
    try:
        user_profile = UserProfile.objects.get(user=request.user)
        vocabulary_ids = request.data.get('vocabulary_ids', [])
        
        current_saved_vocabulary = set(user_profile.savedVocabulary)
        new_saved_vocabulary = list(current_saved_vocabulary.union(vocabulary_ids))
        
        user_profile.savedVocabulary = new_saved_vocabulary
        user_profile.save()
        
        return Response({'message': 'Vocabulary items saved successfully'}, status=200)
    except UserProfile.DoesNotExist:
        return Response({'detail': 'User profile not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def removeSavedVocabularyOfUser(request):
    try:
        user_profile = UserProfile.objects.get(user=request.user)
        vocabulary_ids = request.data.get('vocabulary_ids', [])
        
        current_saved_vocabulary = set(user_profile.savedVocabulary)
        new_saved_vocabulary = list(current_saved_vocabulary.difference(vocabulary_ids))
        
        user_profile.savedVocabulary = new_saved_vocabulary
        user_profile.save()
        
        return Response({'message': 'Vocabulary items removed successfully'}, status=200)
    except UserProfile.DoesNotExist:
        return Response({'detail': 'User profile not found'}, status=404)