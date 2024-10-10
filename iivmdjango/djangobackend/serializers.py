from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    # Do not nest the user_type under user, keep it flat
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    
    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'user_type', 'savedVocabulary']

    def create(self, validated_data):
        # Extract the user data and user profile data separately
        user_data = validated_data.pop('user')
        user_serializer = UserSerializer(data=user_data)
        
        if user_serializer.is_valid():
            user = user_serializer.save()
        else:
            raise serializers.ValidationError(user_serializer.errors)
        
        # Create the UserProfile object with the new user
        user_profile = UserProfile.objects.create(
            user=user, 
            user_type=validated_data.get('user_type', 'interpreter'),
            savedVocabulary=validated_data.get('savedVocabulary', [])
        )
        return user_profile

    def validate_user_type(self, value):
        if value not in [choice[0] for choice in UserProfile.USER_TYPE_CHOICES]:
            raise serializers.ValidationError("Invalid user type")
        return value
