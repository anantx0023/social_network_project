from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User, Post, Reaction
import re


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration/signup"""
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    re_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    profile_picture = serializers.ImageField(required=False)
    
    class Meta:
        model = User
        fields = ('email', 'full_name', 'password', 're_password', 
                  'date_of_birth', 'profile_picture')
        extra_kwargs = {
            'email': {'required': True},
            'full_name': {'required': True},
        }
    
    def validate_email(self, value):
        """Validate email format and uniqueness"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        
        # Email format validation
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, value):
            raise serializers.ValidationError("Enter a valid email address.")
        
        return value.lower()
    
    def validate_profile_picture(self, value):
        """Validate profile picture file type and size"""
        if value:
            # Check file size (max 5MB)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Profile picture size should not exceed 5MB.")
            
            # Check file type
            allowed_types = ['image/jpeg', 'image/jpg', 'image/png']
            if value.content_type not in allowed_types:
                raise serializers.ValidationError("Only JPEG, JPG, and PNG files are allowed.")
        
        return value
    
    def validate(self, attrs):
        """Validate that passwords match"""
        if attrs['password'] != attrs['re_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        """Create and return a new user"""
        validated_data.pop('re_password')
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile view and update"""
    
    profile_picture = serializers.ImageField(required=False)
    
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'date_of_birth', 'profile_picture')
        read_only_fields = ('id', 'email')  # Email cannot be changed
    
    def validate_profile_picture(self, value):
        """Validate profile picture file type and size"""
        if value:
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Profile picture size should not exceed 5MB.")
            
            allowed_types = ['image/jpeg', 'image/jpg', 'image/png']
            if value.content_type not in allowed_types:
                raise serializers.ValidationError("Only JPEG, JPG, and PNG files are allowed.")
        
        return value


class PostSerializer(serializers.ModelSerializer):
    """Serializer for Post model"""
    
    user = UserSerializer(read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    dislikes_count = serializers.IntegerField(read_only=True)
    image = serializers.ImageField(required=False)
    user_reaction = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ('id', 'user', 'description', 'image', 'created_at', 
                  'updated_at', 'likes_count', 'dislikes_count', 'user_reaction')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')
    
    def get_user_reaction(self, obj):
        """Get current user's reaction on this post"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            reaction = Reaction.objects.filter(user=request.user, post=obj).first()
            if reaction:
                return 'like' if reaction.is_like else 'dislike'
        return None
    
    def validate_image(self, value):
        """Validate post image file type and size"""
        if value:
            # Check file size (max 10MB)
            if value.size > 10 * 1024 * 1024:
                raise serializers.ValidationError("Image size should not exceed 10MB.")
            
            # Check file type
            allowed_types = ['image/jpeg', 'image/jpg', 'image/png']
            if value.content_type not in allowed_types:
                raise serializers.ValidationError("Only JPEG, JPG, and PNG files are allowed.")
        
        return value
    
    def validate_description(self, value):
        """Validate description is not empty"""
        if not value or not value.strip():
            raise serializers.ValidationError("Description cannot be empty.")
        return value


class ReactionSerializer(serializers.ModelSerializer):
    """Serializer for Reaction model"""
    
    class Meta:
        model = Reaction
        fields = ('id', 'user', 'post', 'is_like', 'created_at')
        read_only_fields = ('id', 'user', 'created_at')
