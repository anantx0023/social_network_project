from django.shortcuts import render
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, Post, Reaction
from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    PostSerializer,
    ReactionSerializer
)


class SignupView(generics.CreateAPIView):
    """
    API endpoint for user registration/signup
    POST /api/signup/
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'message': 'User registered successfully',
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    API endpoint for user login
    POST /api/login/
    """
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({
                'error': 'Please provide both email and password'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Convert email to lowercase to match signup
        email = email.lower()
        
        # Authenticate user
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'message': 'Login successful',
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)


class ProfileView(APIView):
    """
    API endpoint to view and update user profile
    GET /api/profile/ - View profile
    PATCH /api/profile/ - Update profile
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get current user's profile"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request):
        """Update current user's profile (except email)"""
        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'user': serializer.data,
                'message': 'Profile updated successfully'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostListCreateView(generics.ListCreateAPIView):
    """
    API endpoint to list all posts and create new post
    GET /api/posts/ - List all posts
    POST /api/posts/ - Create new post
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        """Set the user to the current authenticated user"""
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response({
            'post': serializer.data,
            'message': 'Post created successfully'
        }, status=status.HTTP_201_CREATED)


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint to retrieve, update, or delete a specific post
    GET /api/posts/<id>/ - Get post details
    PATCH /api/posts/<id>/ - Update post
    DELETE /api/posts/<id>/ - Delete post
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter to only allow users to access their own posts"""
        return Post.objects.filter(user=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            'message': 'Post deleted successfully'
        }, status=status.HTTP_200_OK)


class PostLikeView(APIView):
    """
    API endpoint to toggle like on a post
    POST /api/posts/<id>/like/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({
                'error': 'Post not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if user already reacted to this post
        reaction, created = Reaction.objects.get_or_create(
            user=request.user,
            post=post,
            defaults={'is_like': True}
        )
        
        if not created:
            # Reaction exists
            if reaction.is_like:
                # Already liked, remove the like
                reaction.delete()
                message = 'Like removed'
            else:
                # Was dislike, change to like
                reaction.is_like = True
                reaction.save()
                message = 'Changed to like'
        else:
            message = 'Post liked'
        
        return Response({
            'message': message,
            'likes_count': post.likes_count,
            'dislikes_count': post.dislikes_count
        }, status=status.HTTP_200_OK)


class PostDislikeView(APIView):
    """
    API endpoint to toggle dislike on a post
    POST /api/posts/<id>/dislike/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({
                'error': 'Post not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if user already reacted to this post
        reaction, created = Reaction.objects.get_or_create(
            user=request.user,
            post=post,
            defaults={'is_like': False}
        )
        
        if not created:
            # Reaction exists
            if not reaction.is_like:
                # Already disliked, remove the dislike
                reaction.delete()
                message = 'Dislike removed'
            else:
                # Was like, change to dislike
                reaction.is_like = False
                reaction.save()
                message = 'Changed to dislike'
        else:
            message = 'Post disliked'
        
        return Response({
            'message': message,
            'likes_count': post.likes_count,
            'dislikes_count': post.dislikes_count
        }, status=status.HTTP_200_OK)
