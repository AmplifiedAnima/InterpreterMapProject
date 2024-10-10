from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile
from .serializers import UserProfileSerializer, UserSerializer
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

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

@api_view(['POST'])
def create_user_profile(request):
    # Debugging: Print out the incoming data
    print(request.data)

    # Create the UserProfile using the serializer
    serializer = UserProfileSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        user_profile = serializer.save()
        print('UserProfile created:', user_profile)
        return Response(UserProfileSerializer(user_profile).data, status=status.HTTP_201_CREATED)
    
    # Debugging: Print out validation errors
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Print incoming data for debugging
    print("Login request received. Username:", username)

    if not username or not password:
        print("Missing username or password.")
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    # Authenticate the user
    user = authenticate(username=username, password=password)

    if user is not None:
        print("User authenticated successfully. Username:", user.username)

        try:
            # Attempt to retrieve the user profile
            user_profile = UserProfile.objects.get(user=user)
            print("UserProfile found for user:", user.username)
        except UserProfile.DoesNotExist:
            print("UserProfile not found for user:", user.username)
            return Response({'error': 'UserProfile not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            print("JWT tokens generated successfully.")

            response_data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username,
                'email': user.email,
                'user_type': user_profile.user_type,
                'savedVocabulary': user_profile.savedVocabulary,
            }
            print(response_data)
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            print("Error generating tokens or building response:", str(e))
            return Response({'error': 'Token generation failed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    else:
        print("Invalid credentials for username:", username)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def default_view(request):
    return Response({'message': 'core of the backend'}, status=status.HTTP_200_OK)
