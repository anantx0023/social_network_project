from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    SignupView,
    LoginView,
    ProfileView,
    PostListCreateView,
    PostDetailView,
    PostLikeView,
    PostDislikeView,
)

# Define URL patterns for the users app
urlpatterns = [
    # Authentication endpoints
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profile endpoint
    path('profile/', ProfileView.as_view(), name='profile'),
    
    # Post endpoints
    path('posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:pk>/like/', PostLikeView.as_view(), name='post-like'),
    path('posts/<int:pk>/dislike/', PostDislikeView.as_view(), name='post-dislike'),
]
