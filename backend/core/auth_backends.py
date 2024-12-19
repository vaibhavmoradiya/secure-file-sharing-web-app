from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
import pyotp

User = get_user_model()


class MFAAuthenticationBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, mfa_code=None):
        if not username or not password:
            return None
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return None
        if not user.check_password(password):
            return None
        if user.mfa_enabled:
            if not mfa_code:
                return None  # MFA code missing
            totp = pyotp.TOTP(user.mfa_secret)
            if not totp.verify(mfa_code):  # Validate MFA code
                return None  # Invalid MFA code
        return user