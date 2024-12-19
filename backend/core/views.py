import pyotp
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import File, SharedFile
from .serializers import UserSerializer, FileSerializer, SharedFileSerializer
from .permissions import IsAdminUserOrReadOnly, IsOwnerOrAdminOrShared
from .utils import generate_secure_link, encrypt_file, decrypt_file
from django.utils import timezone
from datetime import timedelta
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import PermissionDenied

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error':'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.check_password(password):
        return Response({'error':'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    if user.mfa_enabled and not request.data.get('mfa_code'):
        return Response({'message': 'MFA required'})

    #MFA flow would be added here.
    refresh = RefreshToken.for_user(user)
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }, status=status.HTTP_200_OK)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def user_logout(request):
    try:
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({'error': 'Refresh token required'}, status=status.HTTP_400_BAD_REQUEST)

        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_mfa_qr(request):
    if not request.user.mfa_enabled:
        request.user.mfa_secret = pyotp.random_base32()
        request.user.mfa_enabled = True
        request.user.save()

    totp = pyotp.TOTP(request.user.mfa_secret)
    qr_url = totp.provisioning_uri(request.user.username, issuer_name="SecureFileSharingApp")
    return Response({'qr_code_url': qr_url}, status=status.HTTP_200_OK)
#User API
class UserView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUserOrReadOnly]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class FileListCreateView(generics.ListCreateAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        print(f"Debug: FileListCreateView.get_queryset called by {user.username}")  # Debug
        owned_files = File.objects.filter(owner=user)
        return owned_files

    def perform_create(self, serializer):
        # Get the file content from request
        print("self.request.user", self.request.user)
        uploaded_file = self.request.FILES.get('file_content')
        file_name = self.request.data.get('file_name')
        if not uploaded_file or not file_name:
            return Response({'error': 'Please upload a file and provide a file name.'}, status=status.HTTP_400_BAD_REQUEST)

        # Encrypt the file content
        encrypted_content = encrypt_file(uploaded_file.read())

        serializer.save(owner=self.request.user, file_content=encrypted_content, file_name=file_name)

class FileRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [IsOwnerOrAdminOrShared]

    def retrieve(self, request, *args, **kwargs):
        file_instance = self.get_object()
        encrypted_content = file_instance.file_content
        decrypted_content = decrypt_file(encrypted_content)
        response = Response()
        response['Content-Disposition'] = f'attachment; filename="{file_instance.file_name}"'
        response.content = decrypted_content
        return response

class SharedFileListCreateView(generics.ListCreateAPIView):
    queryset = SharedFile.objects.all()
    serializer_class = SharedFileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Filter shared files for the authenticated user
        return SharedFile.objects.filter(shared_with=user)

    def perform_create(self, serializer):
            
            file_id = self.request.data.get("file")
            shared_with_id = self.request.data.get('shared_with')
            permission = self.request.data.get('permission')
            expiry_days = self.request.data.get("expiry_days", 1)

            try:
                file = File.objects.get(id=file_id)
            except File.DoesNotExist:
                return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
            
            if file.owner != self.request.user:
                raise PermissionDenied("You are not the owner of the file.")

            try:
                shared_with = User.objects.get(id=shared_with_id)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

            share_link = generate_secure_link()
            if isinstance(expiry_days, str):  # If expiry_days is a string
                expiry_days = int(expiry_days)

            expiry_date = timezone.now() + timedelta(days=expiry_days)
            serializer.save(file=file, file_name=file.file_name, shared_with=shared_with, permission=permission, share_link=share_link, expiry_date=expiry_date)


class SharedFileRetrieveView(generics.RetrieveAPIView):
    queryset = SharedFile.objects.all()
    serializer_class = SharedFileSerializer
    permission_classes = [IsOwnerOrAdminOrShared]

    def retrieve(self, request, *args, **kwargs):
        share_link = kwargs.get('pk')
        try:
            shared_file = SharedFile.objects.get(share_link=share_link)
        except SharedFile.DoesNotExist:
            return Response({'error': 'Invalid link or link expired'})

        if shared_file.expiry_date < timezone.now():
            return Response({'error': 'Link expired'})

        file_instance = shared_file.file
        encrypted_content = file_instance.file_content
        decrypted_content = decrypt_file(encrypted_content)
        response = Response()
        response['Content-Disposition'] = f'inline; filename="{file_instance.file_name}"'
        response.content = decrypted_content
        return response