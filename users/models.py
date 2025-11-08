from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager  # Add this import at the top


class User(AbstractUser):
    """Custom User model extending Django's AbstractUser"""
    
    # Remove username, use email for authentication
    username = None
    
    # Custom fields for your assignment
    full_name = models.CharField(max_length=255)
    email = models.EmailField(_('email address'), unique=True)
    date_of_birth = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    
    # Set email as the unique identifier
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']
    
    objects = CustomUserManager()  # ADD THIS LINE HERE
    
    def __str__(self):
        return self.email
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'


class Post(models.Model):
    """Model for user posts"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    description = models.TextField(max_length=500)
    image = models.ImageField(upload_to='post_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Post by {self.user.email} - {self.created_at}"
    
    @property
    def likes_count(self):
        """Count total likes for this post"""
        return self.reactions.filter(is_like=True).count()
    
    @property
    def dislikes_count(self):
        """Count total dislikes for this post"""
        return self.reactions.filter(is_like=False).count()
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'


class Reaction(models.Model):
    """Model to track likes and dislikes on posts"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reactions')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reactions')
    is_like = models.BooleanField(default=True)  # True for like, False for dislike
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        # Ensure one user can only have one reaction per post
        unique_together = ('user', 'post')
        verbose_name = 'Reaction'
        verbose_name_plural = 'Reactions'
    
    def __str__(self):
        reaction_type = "liked" if self.is_like else "disliked"
        return f"{self.user.email} {reaction_type} post {self.post.id}"
