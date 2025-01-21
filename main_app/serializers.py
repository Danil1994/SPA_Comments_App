from rest_framework import serializers
from captcha.models import CaptchaStore
from captcha.helpers import captcha_image_url
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    captcha_key = serializers.CharField(write_only=True, required=True)
    captcha_value = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Comment
        fields = ['id', 'user_name', 'email', 'home_page', 'text', 'created_at', 'parent', 'captcha_key', 'captcha_value', 'image', 'file']

    def validate(self, data):
        # Проверяем CAPTCHA
        captcha_key = data.get('captcha_key')
        captcha_value = data.get('captcha_value')
        print(data)

        if not captcha_key or not captcha_value:
            raise serializers.ValidationError("CAPTCHA обязательна.")

        try:
            captcha = CaptchaStore.objects.get(hashkey=captcha_key)
            if captcha.response != captcha_value.lower():
                raise serializers.ValidationError("Неверный код CAPTCHA.")
        except CaptchaStore.DoesNotExist:
            raise serializers.ValidationError("CAPTCHA недействительна.")

        print(captcha_key)
        del data['captcha_key']
        del data['captcha_value']
        # Удаляем использованную CAPTCHA
        # CaptchaStore.objects.filter(hashkey=captcha_key).delete()
        print(captcha_key)

        return data