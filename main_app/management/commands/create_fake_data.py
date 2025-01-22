import random
from django.core.management.base import BaseCommand
from faker import Faker
from ....main_app.models import Comment

fake = Faker()


class Command(BaseCommand):
    help = "Generate random comments and replies for testing"

    def add_arguments(self, parser):
        parser.add_argument('num_comments', type=int, help="Number of comments to generate")
        parser.add_argument('max_replies', type=int, help="Maximum number of replies per comment")

    def handle(self, *args, **kwargs):
        num_comments = kwargs['num_comments']
        max_replies = kwargs['max_replies']

        self.stdout.write("Generating random comments...")

        for _ in range(num_comments):
            comment = Comment.objects.create(
                user_name=fake.user_name(),
                email=fake.email(),
                home_page=fake.url(),
                text=fake.text(max_nb_chars=200),
            )
            self.stdout.write(f"Created comment: {comment.id} by {comment.user_name}")

            num_replies = random.randint(0, max_replies)
            for _ in range(num_replies):
                reply = Comment.objects.create(
                    user_name=fake.user_name(),
                    email=fake.email(),
                    home_page=fake.url(),
                    text=fake.text(max_nb_chars=200),
                    parent=comment,
                )
                self.stdout.write(f"  Created reply: {reply.id} to comment {comment.id}")

        self.stdout.write(self.style.SUCCESS("Random comments and replies generated successfully!"))
