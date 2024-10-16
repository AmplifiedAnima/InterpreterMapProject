from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile
from .serializers import UserProfileSerializer, UserSerializer
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction

@api_view(['GET'])
def get_user_profile(request):
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'}, status=401)

    try:
        user_profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        return Response({'detail': 'User profile not found.'}, status=404)
    
    # Correct the serializer to use UserProfileSerializer, not UserSerializer
    serializer = UserProfileSerializer(user_profile)
    return Response(serializer.data, status=status.HTTP_200_OK)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from .serializers import UserProfileSerializer

@api_view(['POST'])
def create_user_profile(request):
    serializer = UserProfileSerializer(data=request.data)

    try:
        with transaction.atomic():
            if serializer.is_valid():
                user_profile = serializer.save()
                return Response({
                    'message': 'User profile created successfully',
                    'username': user_profile.user.username,
                    'email': user_profile.user.email,
                    'user_type': user_profile.user_type
                }, status=status.HTTP_201_CREATED)
            else:
                # Return specific validation errors
                return Response({
                    'error': 'Validation failed',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': 'An unexpected error occurred',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required', 'details': {'non_field_errors': ['Both username and password are required.']}}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)

    if user is not None:
        try:
            user_profile = UserProfile.objects.get(user=user)
            refresh = RefreshToken.for_user(user)
            response_data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username,
                'email': user.email,
                'user_type': user_profile.user_type,
                'savedVocabulary': user_profile.savedVocabulary,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({'error': 'UserProfile not found', 'details': {'non_field_errors': ['User profile not found.']}}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': 'Token generation failed.', 'details': {'non_field_errors': ['An error occurred during login.']}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({'error': 'Invalid credentials', 'details': {'non_field_errors': ['The provided username or password is incorrect.']}}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def default_view(request):
    return Response({'message': 'core of the backend'}, status=status.HTTP_200_OK)
