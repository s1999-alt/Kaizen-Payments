from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.contrib.auth.models import User

from .models import MailPlan, Recipient, MailNode
from .serializers import MailPlanSerializer, RecipientSerializer, RegisterSerializer
from .scheduler import schedule_plan


class RegisterView(APIView):
  permission_classes = [AllowAny]

  def post(self, request):
    serializer = RegisterSerializer(data=request.data)

    if not serializer.is_valid():
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()
    refresh = RefreshToken.for_user(user)

    return Response({
      "message": "User registered successfully",
      "access": str(refresh.access_token),
      "refresh": str(refresh),
      "user": {
          "id": user.id,
          "username": user.username,
          "email": user.email
      }
    }, status=status.HTTP_201_CREATED)
  

class LoginView(APIView):
  permission_classes = [AllowAny]

  def post(self, request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
      user_obj = User.objects.get(email=email)
      username = user_obj.username
    except User.DoesNotExist:
      return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)

    if not user:
      return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    refresh = RefreshToken.for_user(user)

    return Response({
      "access": str(refresh.access_token),
      "refresh": str(refresh),
      "user": {
        "id": user.id,
        "username": user.username,
        "email": user.email
      }
    })

    
class MailPlanList(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    plans = MailPlan.objects.filter(created_by=request.user)
    serializer = MailPlanSerializer(plans, many=True)
    return Response(serializer.data)
  

class MailPlanCreate(APIView):
  permission_classes = [IsAuthenticated]

  def post(self, request):
    data = request.data
    data["created_by"] = request.user.id

    serializer = MailPlanSerializer(data=data, context={"request": request})
    if serializer.is_valid():
      plan = serializer.save()
      schedule_plan(plan)
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  

class MailPlanDetail(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request, pk):
    try:
        plan = MailPlan.objects.get(id=pk, created_by=request.user)
    except MailPlan.DoesNotExist:
        return Response({"error": "Plan not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = MailPlanSerializer(plan)
    return Response(serializer.data)
  
  def delete(self, request, pk):
    plan = MailPlan.objects.filter(id=pk, created_by=request.user).first()
    if not plan:
      return Response({"error": "Plan not found"}, status=status.HTTP_404_NOT_FOUND)

    plan.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


class MailPlanUpdate(APIView):
  permission_classes = [IsAuthenticated]

  def put(self, request, pk):
    try:
      plan = MailPlan.objects.get(id=pk, created_by=request.user)
    except MailPlan.DoesNotExist:
      return Response({"error": "Plan not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = MailPlanSerializer(plan, data=request.data)
    if not serializer.is_valid():
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    plan = serializer.save()

    schedule_plan(plan)
    return Response(MailPlanSerializer(plan).data)

  
class RecipientList(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    filters = request.query_params

    qs = Recipient.objects.all()

    if "email" in filters:
      qs = qs.filter(email__icontains=filters["email"])
    if "tag" in filters:
      qs = qs.filter(tags__icontains=[filters["tag"]])
    
    serializer = RecipientSerializer(qs, many=True)
    return Response(serializer.data)
  

class LogoutView(APIView):
  permission_classes = [IsAuthenticated]

  def post(self, request):
    try:
      refresh_token = request.data.get("refresh")
      if not refresh_token:
          return Response({"error": "Refresh token required"}, status=400)

      token = RefreshToken(refresh_token)
      token.blacklist()

      return Response({"message": "Logout successful"}, status=200)

    except Exception:
      return Response({"error": "Invalid token"}, status=400)



