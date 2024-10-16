from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db import transaction
from .serializers import VocabularyItemSerializer, NewWordSuggestionSerializer, SuggestionToVocabularyItemSerializer
from .models import VocabularyItem, Translation, NewWordSuggestion, SuggestionToVocabularyItem
import uuid

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_new_word_suggestion(request):
    term = request.data.get('term', '').lower()  # Convert to lowercase

    # Check if the word already exists in the VocabularyItem model (case-insensitive)
    if VocabularyItem.objects.filter(term__iexact=term).exists():
        return Response({
            'error': f'The word "{term}" already exists in the vocabulary.',
            'field': 'term'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Check if the suggestion already exists (case-insensitive)
    if NewWordSuggestion.objects.filter(term__iexact=term).exists():
        return Response({
            'error': f'A suggestion for "{term}" already exists.',
            'field': 'term'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Create a new dictionary with lowercase 'term'
    lowercase_data = request.data.copy()
    lowercase_data['term'] = term

    serializer = NewWordSuggestionSerializer(data=lowercase_data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # If the serializer is not valid, return detailed error messages
    error_messages = {}
    for field, errors in serializer.errors.items():
        error_messages[field] = errors[0]  # Get the first error message for each field

    return Response({'errors': error_messages}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_suggestion_for_the_word(request):
    try:
        vocabulary_item = VocabularyItem.objects.get(term=request.data['term'])
    except VocabularyItem.DoesNotExist:
        return Response({"error": f"Vocabulary item '{request.data['term']}' not found"}, status=status.HTTP_404_NOT_FOUND)

    suggestion_type = request.data.get('suggestionType', '')
    language = request.data.get('language', '')[:2]  # Limit to 2 characters for all cases

    serializer_data = {
        'vocabulary_item': vocabulary_item.id,
        'suggestion_type': 'colloquial' if suggestion_type == 'colloquial' else 'translation',
        'suggestion': request.data.get('suggestion', ''),
        'language': language,
        'status': 'pending'
    }

    serializer = SuggestionToVocabularyItemSerializer(data=serializer_data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_new_word_suggestion(request, pk):
    try:
        with transaction.atomic():
            suggestion = NewWordSuggestion.objects.get(pk=pk)
            
            vocabulary_item_id = str(uuid.uuid4())[:10]  # Generate a unique ID
            
            vocabulary_item = VocabularyItem.objects.create(
                id=vocabulary_item_id,  # Assign the unique ID
                term=suggestion.term,
                definition=suggestion.definition,
                category=suggestion.category
            )
            
            Translation.objects.create(
                vocabulary_item=vocabulary_item,
                language=suggestion.language,
                translation=suggestion.translation,
                is_primary=True
            )
            
            suggestion.status = 'accepted'
            suggestion.save()
            
            return Response({
                'message': 'New word suggestion approved and added to vocabulary',
                'vocabulary_item': VocabularyItemSerializer(vocabulary_item).data
            }, status=status.HTTP_200_OK)
    except NewWordSuggestion.DoesNotExist:
        return Response({'error': 'Suggestion not found'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_vocabulary_suggestion(request, pk):
    try:
        with transaction.atomic():
            suggestion = SuggestionToVocabularyItem.objects.get(pk=pk)
            vocabulary_item = suggestion.vocabulary_item
            
            Translation.objects.create(
                vocabulary_item=vocabulary_item,
                language=suggestion.language,
                translation=suggestion.suggestion,
                is_colloquial=(suggestion.suggestion_type == 'colloquial'),
                is_user_proposed=(suggestion.suggestion_type == 'translation')
            )
            
            suggestion.status = 'accepted'
            suggestion.save()
            
            return Response({
                'message': 'Vocabulary suggestion approved and updated',
                'vocabulary_item': VocabularyItemSerializer(vocabulary_item).data
            }, status=status.HTTP_200_OK)
    except SuggestionToVocabularyItem.DoesNotExist:
        return Response({'error': 'Suggestion not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_suggestion(request, pk):
    suggestion_type = request.data.get('suggestion_type')
    
    if suggestion_type == 'new_word':
        model = NewWordSuggestion
    elif suggestion_type == 'vocabulary':
        model = SuggestionToVocabularyItem
    else:
        return Response({'error': 'Invalid suggestion type'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        suggestion = model.objects.get(pk=pk)
        suggestion.status = 'rejected'
        suggestion.save()
        return Response({'message': 'Suggestion rejected'}, status=status.HTTP_200_OK)
    except model.DoesNotExist:
        return Response({'error': 'Suggestion not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def getSuggestionsForWord(request, pk):
    try:
        suggestions_for_word = SuggestionToVocabularyItem.objects.filter(vocabulary_item_id=pk)
        serializer = SuggestionToVocabularyItemSerializer(suggestions_for_word, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def getAllSuggestionsForAllWords(request):
    try:
        existing_word_suggestions = SuggestionToVocabularyItem.objects.all()
        new_word_suggestions = NewWordSuggestion.objects.all()

        existing_word_serializer = SuggestionToVocabularyItemSerializer(existing_word_suggestions, many=True)
        new_word_serializer = NewWordSuggestionSerializer(new_word_suggestions, many=True)

        combined_suggestions = {
            'existing_word_suggestions': existing_word_serializer.data,
            'new_word_suggestions': new_word_serializer.data
        }

        return Response(combined_suggestions)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_vocabulary_suggestion(request, pk):
    try:
        suggestion = SuggestionToVocabularyItem.objects.get(pk=pk)
        if request.user in suggestion.likes.all():
            suggestion.likes.remove(request.user)
            return Response({'liked': False, 'like_count': suggestion.like_count})
        else:
            suggestion.likes.add(request.user)
            return Response({'liked': True, 'like_count': suggestion.like_count})
    except SuggestionToVocabularyItem.DoesNotExist:
        return Response({'error': 'Suggestion not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_new_word_suggestion(request, pk):
    try:
        suggestion = NewWordSuggestion.objects.get(pk=pk)
        if request.user in suggestion.likes.all():
            suggestion.likes.remove(request.user)
            return Response({'liked': False, 'like_count': suggestion.like_count})
        else:
            suggestion.likes.add(request.user)
            return Response({'liked': True, 'like_count': suggestion.like_count})
    except NewWordSuggestion.DoesNotExist:
        return Response({'error': 'Suggestion not found'}, status=status.HTTP_404_NOT_FOUND)
