from rest_framework import permissions
from .models import SharedFile

class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Allows admin users full access and read-only access for other users
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)

class IsOwnerOrAdminOrShared(permissions.BasePermission):
    """
    Allows admin users full access, or only the owner user and those who the file is shared with
    """
    def has_object_permission(self, request, view, obj):
        # Allow access for admin users
        
        if request.user and request.user.is_staff:
            return True

        # Allow access for file owner
        if obj.owner == request.user:
            return True
        
        # Allow access if the file is shared with the user
        # if SharedFile.objects.filter(file=obj, shared_with=request.user).exists():
        #     # Optionally, check for permissions like "view" or "download"
        #     shared_file = SharedFile.objects.get(file=obj, shared_with=request.user)
        #     if shared_file.permission in ['view', 'download']:  # Adjust based on your use case
        #         return True

        return False