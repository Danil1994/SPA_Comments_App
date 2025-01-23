from django.contrib import admin

from .models import Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'email', 'created_at', 'parent')
    list_filter = ('created_at',)
    search_fields = ('user_name', 'email', 'text')
