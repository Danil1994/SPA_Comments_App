from django.urls import path
from .views import CommentListView, ReplyListView, CaptchaAPIView

urlpatterns = [
    path('comments/', CommentListView.as_view(), name='comment-list'),
    path('comments/<int:parent_id>/replies/', ReplyListView.as_view(), name='reply-list'),
    path('captcha/', CaptchaAPIView.as_view(), name='captcha'),
]
