from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from captcha.models import CaptchaStore
from captcha.helpers import captcha_image_url
from .models import Comment
from .serializers import CommentSerializer


class CaptchaAPIView(APIView):
    def get(self, request):
        captcha_key = CaptchaStore.generate_key()
        captcha_image = captcha_image_url(captcha_key)
        absolute_captcha_image = request.build_absolute_uri(captcha_image)

        return Response({
            'captcha_key': captcha_key,
            'captcha_image': absolute_captcha_image
        })

class CommentPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100


class CommentListView(APIView):
    pagination_class = CommentPagination

    def get(self, request):
        sort_by = request.query_params.get('sort_by', 'created_at')
        order = request.query_params.get('order', 'desc')
        sort_field = f"{'-' if order == 'desc' else ''}{sort_by}"
        comments = Comment.objects.filter(parent=None).order_by(sort_field)
        paginator = CommentPagination()
        paginated_comments = paginator.paginate_queryset(comments, request)
        serializer = CommentSerializer(paginated_comments, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReplyListView(APIView):
    def get(self, request, parent_id):
        limit = int(request.query_params.get('limit', 10))
        replies = Comment.objects.filter(parent_id=parent_id).order_by('-created_at')[:limit]
        serializer = CommentSerializer(replies, many=True)
        return Response(serializer.data)
