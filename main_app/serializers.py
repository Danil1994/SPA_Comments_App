import re

import bleach
from captcha.models import CaptchaStore
from rest_framework import serializers

from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    captcha_key = serializers.CharField(write_only=True, required=True)
    captcha_value = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Comment
        fields = ['id', 'user_name', 'email', 'home_page', 'text', 'created_at', 'parent',
                  'captcha_key', 'captcha_value', 'image', 'file']

    def validate(self, data):
        captcha_key = data.get('captcha_key')
        captcha_value = data.get('captcha_value')

        if not captcha_key or not captcha_value:
            raise serializers.ValidationError("CAPTCHA is required.")

        try:
            captcha = CaptchaStore.objects.get(hashkey=captcha_key)
            if captcha.response != captcha_value.lower():
                raise serializers.ValidationError({"captcha_value": "bad CAPTCHA."})
        except CaptchaStore.DoesNotExist:

            raise serializers.ValidationError({"captcha_value": "CAPTCHA invalid."})

        del data['captcha_key']
        del data['captcha_value']

        return data

    def validate_text(self, value):
        value = value.replace('\r\n', '<br>')
        value = value.replace('\n', '<br>').replace('\r', '<br>')

        def preserve_code_blocks(match):
            content = match.group(1)
            return f"<code style=\"white-space: pre;\">{content}</code>"

        value = re.sub(r"<code>(.*?)</code>", preserve_code_blocks, value, flags=re.DOTALL)

        ALLOWED_TAGS = ['a', 'code', 'i', 'strong', 'br']
        ALLOWED_ATTRIBUTES = {
            'a': ['href', 'title']
        }

        clean_text = bleach.clean(
            value,
            tags=ALLOWED_TAGS,
            attributes=ALLOWED_ATTRIBUTES,
            strip=True
        )

        clean_text = clean_text.replace('<code>', '<code style="white-space: pre;">')
        if clean_text != value:
            raise serializers.ValidationError({"captcha_value": "Incorrect or prohibited HTML code."})

        return clean_text
