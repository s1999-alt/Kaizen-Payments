from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import MailPlan, Recipient, MailNode
from .serializers import MailPlanSerializer, RecipientSerializer


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

    serializer = MailPlanSerializer(data=data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)
  

class MailPlanDetail(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request, pk):
    plan = MailPlan.objects.get(id=pk)
    serializer = MailPlanSerializer(plan)
    return Response(serializer.data)
  
  def delete(self, request, pk):
    plan = MailPlan.objects.filter(id=pk)
    plan.delete()
    return Response({'msg': 'Deleted'}, status=204)


class MailPlanUpdate(APIView):
  permission_classes = [IsAuthenticated]

  def put(self, request, pk):
    try:
      plan = MailPlan.objects.get(id=pk, created_by=request.user)
    except MailPlan.DoesNotExist:
      return Response({"error": "Plan not found"}, status=404)
    
    data = request.data
    nodes_data = data.pop("nodes", None)

    serializer = MailPlanSerializer(plan, data=data, partial=True)
    if not serializer.is_valid():
      return Response(serializer.errors, status=400)
    
    serializer.save()

    if nodes_data is not None:
      plan.nodes.all().delete() 

      for node in nodes_data:
        MailNode.objects.create(plan=plan, **node)
    return Response({"msg": "Updated successfully"}, status=200)
  

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


