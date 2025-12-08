from rest_framework import serializers
from .models import Recipient, MailPlan, MailNode


class RecipientSerializer(serializers.ModelSerializer):
  class Meta:
    model = Recipient
    fields = '__all__'


class MailNodeSerializer(serializers.ModelSerializer):
  class Meta:
    model = MailNode
    fields = "__all__"
 
  def validate(self, data):
    trigger = data.get('trigger_type')

    if trigger == 'delay' and not data.get('delay_minutes'):
      raise serializers.ValidationError("delay_minutes is required for delay trigger.")
    if trigger == 'schedule' and not data.get('scheduled_datetime'):
      raise serializers.ValidationError("scheduled_datetime is required.")
    if trigger == 'on_event' and not data.get('event_name'):
      raise serializers.ValidationError("event_name is required.")
    
    return data
  

class MailPlanSerializer(serializers.ModelSerializer):
  nodes = MailNodeSerializer(many=True)

  class Meta:
    model = MailPlan
    fields = ['id', 'name', 'description', 'is_active', 'nodes']
  
  def create(self, validated_data):
    nodes = validated_data.pop("nodes")
    plan = MailPlan.objects.create(**validated_data)

    for node in nodes:
      MailNode.objects.create(plan=plan, **node)

    return plan