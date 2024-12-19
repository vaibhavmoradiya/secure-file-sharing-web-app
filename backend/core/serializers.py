import pyotp
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import File, SharedFile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username', 'email', 'password', 'mfa_enabled', 'mfa_secret']
        extra_kwargs = {'password': {'write_only': True}, 'mfa_secret': {'read_only': True}}

    def create(self, validated_data):
        mfa_enabled = validated_data.pop('mfa_enabled', False)
        user = User.objects.create_user(**validated_data)
        if mfa_enabled:
            user.mfa_secret = pyotp.random_base32()
            user.mfa_enabled = True
            user.save()
        return user

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id','owner', 'file_name', 'file_content', 'upload_date']
        read_only_fields = ['owner']

class SharedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedFile
        fields = ['id','file','file_name','shared_with','permission','share_link','expiry_date']
        read_only_fields = ['share_link','expiry_date']