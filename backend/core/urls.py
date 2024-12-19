from django.urls import path
from .views import (
    get_mfa_qr,
    register_user,
    user_login,
    user_logout,
    UserView,
    FileListCreateView,
    FileRetrieveDestroyView,
    SharedFileListCreateView,
    SharedFileRetrieveView
)
urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('users/<int:pk>/', UserView.as_view(), name='user-detail'),
    path('files/', FileListCreateView.as_view(), name='file-list-create'),
    path('files/<uuid:pk>/', FileRetrieveDestroyView.as_view(), name='file-detail'),
    path('shares/', SharedFileListCreateView.as_view(), name='shared-file-list-create'),
    path('shares/<str:pk>/', SharedFileRetrieveView.as_view(), name='shared-file-detail'),
    path('mfa-qr/', get_mfa_qr, name='mfa-qr'),
]