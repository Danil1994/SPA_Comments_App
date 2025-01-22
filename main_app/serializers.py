import bleach

from rest_framework import serializers
from captcha.models import CaptchaStore
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    captcha_key = serializers.CharField(write_only=True, required=True)
    captcha_value = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Comment
        fields = ['id', 'user_name', 'email', 'home_page', 'text', 'created_at', 'parent', 'captcha_key', 'captcha_value', 'image', 'file']

    def validate(self, data):
        captcha_key = data.get('captcha_key')
        captcha_value = data.get('captcha_value')

        if not captcha_key or not captcha_value:
            raise serializers.ValidationError("CAPTCHA обязательна.")

        try:
            captcha = CaptchaStore.objects.get(hashkey=captcha_key)
            if captcha.response != captcha_value.lower():
                raise serializers.ValidationError("Неверный код CAPTCHA.")
        except CaptchaStore.DoesNotExist:
            raise serializers.ValidationError("CAPTCHA недействительна.")

        del data['captcha_key']
        del data['captcha_value']

        return data

    def validate_text(self, value):
        # Разрешённые HTML-теги и атрибуты
        ALLOWED_TAGS = ['a', 'code', 'i', 'strong']
        ALLOWED_ATTRIBUTES = {
            'a': ['href', 'title']
        }

        # Очищаем текст
        clean_text = bleach.clean(
            value,
            tags=ALLOWED_TAGS,
            attributes=ALLOWED_ATTRIBUTES,
            strip=True
        )

        # Проверяем, что текст корректен
        if clean_text != value:
            raise serializers.ValidationError("Некорректный или запрещённый HTML-код.")

        return clean_text
