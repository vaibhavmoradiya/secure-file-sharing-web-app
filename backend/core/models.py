from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid

class User(AbstractUser):
    # Additional fields such as MFA related field
    mfa_enabled = models.BooleanField(default=False)
    mfa_secret = models.CharField(max_length=255, blank=True, null=True)

class File(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=255)
    file_content = models.BinaryField() # Store encrypted content
    upload_date = models.DateTimeField(default=timezone.now)

class SharedFile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.ForeignKey(File, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=255,default="Default File Name")
    shared_with = models.ForeignKey(User, on_delete=models.CASCADE)
    permission_choices = [("view", "View"), ("download", "Download")]
    permission = models.CharField(max_length=10, choices=permission_choices, default="view")
    share_link = models.CharField(max_length=255, unique=True)  # Secure, unique link
    expiry_date = models.DateTimeField()