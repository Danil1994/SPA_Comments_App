import re

import bleach
from django.core.exceptions import ValidationError
from django.db import models


class Comment(models.Model):
    user_name = models.CharField(max_length=50, verbose_name="User Name")
    email = models.EmailField(verbose_name="Email")
    home_page = models.URLField(blank=True, null=True, verbose_name="Home Page")
    text = models.TextField(verbose_name="Text")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    image = models.ImageField(
        upload_to="images/",
        blank=True,
        null=True,
        verbose_name="Attached Image"
    )
    file = models.FileField(
        upload_to="files/",
        blank=True,
        null=True,
        verbose_name="Attached File"
    )
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='replies',
        verbose_name="Parent Comment"
    )

    def __str__(self):
        return f"{self.user_name} - {self.text[:30]}"

    def clean(self):
        ALLOWED_TAGS = ['a', 'code', 'i', 'strong', 'br']
        ALLOWED_ATTRIBUTES = {
            'a': ['href', 'title']
        }

        if not re.match(r'^[a-zA-Z0-9]*$', self.user_name):
            raise ValidationError("The username can only contain Latin letters and numbers..")

        self.text = bleach.clean(
            self.text,
            tags=ALLOWED_TAGS,
            attributes=ALLOWED_ATTRIBUTES,
            strip=True
        )

        if not bleach.ALLOWED_TAGS or not bleach.ALLOWED_ATTRIBUTES:
            raise ValidationError("HTML-messages code invalid.")

        super().clean()

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Comment"
        verbose_name_plural = "Comments"
