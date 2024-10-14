# from rest_framework.response import Response
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework import status
# from django.db import transaction
# from .serializers import VocabularyItemSerializer, TranslationSerializer, NewWordSuggestionSerializer, SuggestionToVocabularyItemSerializer
# from .models import VocabularyItem, Translation, NewWordSuggestion, SuggestionToVocabularyItem
# from djangobackend.models import UserProfile
# import uuid

# # @api_view(['GET'])
# # def getAllVocabularyItems(request):
# #     queryset = VocabularyItem.objects.all().prefetch_related('translations')
# #     if not queryset.exists():
# #         return Response({'detail': 'Vocabulary has not been fetched'}, status=404)
# #     serializer = VocabularyItemSerializer(queryset, many=True)
# #     return Response(serializer.data)

# # @api_view(['GET'])
# # def getSpecificVocabularyItem(request, pk):
# #     try:
# #         vocabulary_item = VocabularyItem.objects.prefetch_related('translations').get(pk=pk)
# #     except VocabularyItem.DoesNotExist:
# #         return Response({'detail': 'Vocabulary item does not exist'}, status=404)
    
# #     serializer = VocabularyItemSerializer(vocabulary_item)
# #     categories = list(VocabularyItem.objects.values_list('category', flat=True).distinct())
    
# #     category_items = VocabularyItem.objects.filter(category=vocabulary_item.category).prefetch_related('translations')
# #     category_serializer = VocabularyItemSerializer(category_items, many=True)
    
# #     return Response({
# #         'item': serializer.data,
# #         'categoryItems': category_serializer.data,
# #         'categories': categories
# #     })

# # @api_view(['GET'])
# # def getVocabularyByGroup(request, category):
# #     queryset = VocabularyItem.objects.filter(category=category).prefetch_related('translations')
# #     serializer = VocabularyItemSerializer(queryset, many=True)
# #     categories = list(VocabularyItem.objects.values_list('category', flat=True).distinct())
    
# #     return Response({
# #         'items': serializer.data,
# #         'categories': categories
# #     })

# # @api_view(['GET'])
# # def getCategoryLabels(request):
# #     categories = list(VocabularyItem.objects.values_list('category', flat=True).distinct())
# #     return Response(categories, status=status.HTTP_200_OK)

# # @api_view(['GET'])
# # def searchVocabulary(request):
# #     query = request.GET.get('q', '')
# #     language = request.GET.get('lang', '')
    
# #     items = VocabularyItem.objects.filter(
# #         Q(term__icontains=query) |
# #         Q(translations__translation__icontains=query)
# #     ).distinct()
    
# #     if language:
# #         items = items.filter(translations__language=language)
    
# #     serializer = VocabularyItemSerializer(items, many=True)
# #     return Response(serializer.data)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def create_new_word_suggestion(request):
#     serializer = NewWordSuggestionSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # @api_view(['POST'])
# # @permission_classes([IsAuthenticated])
# # def create_vocabularyItem(request):
# #     with transaction.atomic():
# #         vocabulary_data = {
# #             'term': request.data.get('term'),
# #             'definition': request.data.get('definition'),
# #             'category': request.data.get('category', 'uncategorized'),
# #         }
# #         vocabulary_serializer = VocabularyItemSerializer(data=vocabulary_data)
# #         if vocabulary_serializer.is_valid():
# #             vocabulary_item = vocabulary_serializer.save()
            
# #             translations = request.data.get('translations', {})
# #             for lang, trans in translations.items():
# #                 Translation.objects.create(
# #                     vocabulary_item=vocabulary_item,
# #                     language=lang,
# #                     translation=trans,
# #                     is_primary=True
# #                 )
            
# #             return Response(VocabularyItemSerializer(vocabulary_item).data, status=status.HTTP_201_CREATED)
# #         return Response(vocabulary_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # @api_view(['GET'])
# # def getSuggestionsForWord(request, pk):
# #     try:
# #         suggestions_for_word = SuggestionToVocabularyItem.objects.filter(vocabulary_item_id=pk)
# #         serializer = SuggestionToVocabularyItemSerializer(suggestions_for_word, many=True)
# #         return Response(serializer.data)
# #     except Exception as e:
# #         return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# # @api_view(['GET'])
# # def getAllSuggestionsForAllWords(request):
# #     try:
# #         existing_word_suggestions = SuggestionToVocabularyItem.objects.all()
# #         new_word_suggestions = NewWordSuggestion.objects.all()

# #         existing_word_serializer = SuggestionToVocabularyItemSerializer(existing_word_suggestions, many=True)
# #         new_word_serializer = NewWordSuggestionSerializer(new_word_suggestions, many=True)

# #         combined_suggestions = {
# #             'existing_word_suggestions': existing_word_serializer.data,
# #             'new_word_suggestions': new_word_serializer.data
# #         }

# #         return Response(combined_suggestions)
# #     except Exception as e:
# #         return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
# # @api_view(['POST'])
# # @permission_classes([IsAuthenticated])
# # def approve_new_word_suggestion(request, pk):
# #     try:
# #         with transaction.atomic():
# #             suggestion = NewWordSuggestion.objects.get(pk=pk)
            
# #             vocabulary_item_id = str(uuid.uuid4())[:10]  # Generate a unique ID
            
# #             vocabulary_item = VocabularyItem.objects.create(
# #                 id=vocabulary_item_id,  # Assign the unique ID
# #                 term=suggestion.term,
# #                 definition=suggestion.definition,
# #                 category=suggestion.category
# #             )
            
# #             Translation.objects.create(
# #                 vocabulary_item=vocabulary_item,
# #                 language=suggestion.language,
# #                 translation=suggestion.translation,
# #                 is_primary=True
# #             )
            
# #             suggestion.status = 'accepted'
# #             suggestion.save()
            
# #             return Response({
# #                 'message': 'New word suggestion approved and added to vocabulary',
# #                 'vocabulary_item': VocabularyItemSerializer(vocabulary_item).data
# #             }, status=status.HTTP_200_OK)
# #     except NewWordSuggestion.DoesNotExist:
# #         return Response({'error': 'Suggestion not found'}, status=status.HTTP_404_NOT_FOUND)
# # @api_view(['POST'])
# # @permission_classes([IsAuthenticated])
# # def approve_vocabulary_suggestion(request, pk):
# #     try:
# #         with transaction.atomic():
# #             suggestion = SuggestionToVocabularyItem.objects.get(pk=pk)
# #             vocabulary_item = suggestion.vocabulary_item
            
# #             Translation.objects.create(
# #                 vocabulary_item=vocabulary_item,
# #                 language=suggestion.language,
# #                 translation=suggestion.suggestion,
# #                 is_colloquial=(suggestion.suggestion_type == 'colloquial'),
# #                 is_user_proposed=(suggestion.suggestion_type == 'translation')
# #             )
            
# #             suggestion.status = 'accepted'
# #             suggestion.save()
            
# #             return Response({
# #                 'message': 'Vocabulary suggestion approved and updated',
# #                 'vocabulary_item': VocabularyItemSerializer(vocabulary_item).data
# #             }, status=status.HTTP_200_OK)
# #     except SuggestionToVocabularyItem.DoesNotExist:
# #         return Response({'error': 'Suggestion not found'}, status=status.HTTP_404_NOT_FOUND)

# # @api_view(['POST'])
# # @permission_classes([IsAuthenticated])
# # def reject_suggestion(request, pk):
# #     suggestion_type = request.data.get('suggestion_type')
    
# #     if suggestion_type == 'new_word':
# #         model = NewWordSuggestion
# #     elif suggestion_type == 'vocabulary':
# #         model = SuggestionToVocabularyItem
# #     else:
# #         return Response({'error': 'Invalid suggestion type'}, status=status.HTTP_400_BAD_REQUEST)
    
# #     try:
# #         suggestion = model.objects.get(pk=pk)
# #         suggestion.status = 'rejected'
# #         suggestion.save()
# #         return Response({'message': 'Suggestion rejected'}, status=status.HTTP_200_OK)
# #     except model.DoesNotExist:
# #         return Response({'error': 'Suggestion not found'}, status=status.HTTP_404_NOT_FOUND)

# # @api_view(['POST'])
# # @permission_classes([IsAuthenticated])
# # def create_suggestion_for_the_word(request):
# #     try:
# #         vocabulary_item = VocabularyItem.objects.get(term=request.data['term'])
# #     except VocabularyItem.DoesNotExist:
# #         return Response({"error": f"Vocabulary item '{request.data['term']}' not found"}, status=status.HTTP_404_NOT_FOUND)

# #     suggestion_type = request.data.get('suggestionType', '')
# #     language = request.data.get('language', '')[:2]  # Limit to 2 characters for all cases

# #     serializer_data = {
# #         'vocabulary_item': vocabulary_item.id,
# #         'suggestion_type': 'colloquial' if suggestion_type == 'colloquial' else 'translation',
# #         'suggestion': request.data.get('suggestion', ''),
# #         'language': language,
# #         'status': 'pending'
# #     }

# #     serializer = SuggestionToVocabularyItemSerializer(data=serializer_data)
# #     if serializer.is_valid():
# #         serializer.save()
# #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    
# #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # @api_view(['POST'])
# # @permission_classes([IsAuthenticated])
# # def like_vocabulary_suggestion(request, pk):
# #     try:
# #         suggestion = SuggestionToVocabularyItem.objects.get(pk=pk)
# #         if request.user in suggestion.likes.all():
# #             suggestion.likes.remove(request.user)
# #             return Response({'liked': False, 'like_count': suggestion.like_count})
# #         else:
# #             suggestion.likes.add(request.user)
# #             return Response({'liked': True, 'like_count': suggestion.like_count})
# #     except SuggestionToVocabularyItem.DoesNotExist:
# #         return Response({'error': 'Suggestion not found'}, status=status.HTTP_404_NOT_FOUND)

# # @api_view(['POST'])
# # @permission_classes([IsAuthenticated])
# # def like_new_word_suggestion(request, pk):
# #     try:
# #         suggestion = NewWordSuggestion.objects.get(pk=pk)
# #         if request.user in suggestion.likes.all():
# #             suggestion.likes.remove(request.user)
# #             return Response({'liked': False, 'like_count': suggestion.like_count})
# #         else:
# #             suggestion.likes.add(request.user)
# #             return Response({'liked': True, 'like_count': suggestion.like_count})
# #     except NewWordSuggestion.DoesNotExist:
# #         return Response({'error': 'Suggestion not found'}, status=status.HTTP_404_NOT_FOUND)

# # @api_view(['GET'])
# # @permission_classes([IsAuthenticated])
# # def getSavedVocabularyItemsOfUser(request):
# #     try: 
# #         user_profile = UserProfile.objects.get(user=request.user)
# #         saved_vocabulary_ids = user_profile.savedVocabulary
# #         saved_vocabulary_items = VocabularyItem.objects.filter(id__in=saved_vocabulary_ids).prefetch_related('translations')
# #         serializer = VocabularyItemSerializer(saved_vocabulary_items, many=True)
# #         return Response(serializer.data)
# #     except UserProfile.DoesNotExist:
# #         return Response({'detail': 'User profile not found'}, status=404)

# # @api_view(['POST'])
# # @permission_classes([IsAuthenticated])
# # @transaction.atomic
# # def saveVocabularyForSavedVocabularyOfUser(request):
# #     try:
# #         user_profile = UserProfile.objects.get(user=request.user)
# #         vocabulary_ids = request.data.get('vocabulary_ids', [])
        
# #         current_saved_vocabulary = set(user_profile.savedVocabulary)
# #         new_saved_vocabulary = list(current_saved_vocabulary.union(vocabulary_ids))
        
# #         user_profile.savedVocabulary = new_saved_vocabulary
# #         user_profile.save()
        
# #         return Response({'message': 'Vocabulary items saved successfully'}, status=200)
# #     except UserProfile.DoesNotExist:
# #         return Response({'detail': 'User profile not found'}, status=404)

# # @api_view(['POST'])
# # @permission_classes([IsAuthenticated])
# # @transaction.atomic
# # def removeSavedVocabularyOfUser(request):
# #     try:
# #         user_profile = UserProfile.objects.get(user=request.user)
# #         vocabulary_ids = request.data.get('vocabulary_ids', [])
        
# #         current_saved_vocabulary = set(user_profile.savedVocabulary)
# #         new_saved_vocabulary = list(current_saved_vocabulary.difference(vocabulary_ids))
        
# #         user_profile.savedVocabulary = new_saved_vocabulary
# #         user_profile.save()
        
# #         return Response({'message': 'Vocabulary items removed successfully'}, status=200)
# #     except UserProfile.DoesNotExist:
# #         return Response({'detail': 'User profile not found'}, status=404)