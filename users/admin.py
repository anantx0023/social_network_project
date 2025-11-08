from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Post, Reaction


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'full_name', 'date_of_birth', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'date_joined')
    search_fields = ('email', 'full_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'date_of_birth', 'profile_picture')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'description_preview', 'created_at', 'likes_count', 'dislikes_count')
    list_filter = ('created_at', 'user')
    search_fields = ('description', 'user__email')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at', 'likes_count', 'dislikes_count')
    
    def description_preview(self, obj):
        return obj.description[:50] + '...' if len(obj.description) > 50 else obj.description
    description_preview.short_description = 'Description'


@admin.register(Reaction)
class ReactionAdmin(admin.ModelAdmin):
    """Admin configuration for Reaction model"""
    
    list_display = ('id', 'user', 'post', 'reaction_type', 'created_at')
    list_filter = ('is_like', 'created_at')
    search_fields = ('user__email', 'post__description')
    ordering = ('-created_at',)
    
    def reaction_type(self, obj):
        """Display Like or Dislike"""
        return '👍 Like' if obj.is_like else '👎 Dislike'
    reaction_type.short_description = 'Reaction'
