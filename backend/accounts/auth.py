from django.http import JsonResponse
from .jwt import decode_token
from .models import User

def get_user_from_request(request):
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    token = auth.replace("Bearer ", "").strip()
    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
        return User.objects.filter(id=user_id).first()
    except Exception:
        return None

def require_auth(view_func):
    def wrapper(request, *args, **kwargs):
        user = get_user_from_request(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)
        request.user_obj = user
        return view_func(request, *args, **kwargs)
    return wrapper
