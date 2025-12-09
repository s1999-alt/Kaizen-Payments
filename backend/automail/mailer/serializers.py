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

  def validate(self, data):
    nodes = data.get('nodes', [])
    orders = [n["order"] for n in nodes]
    if len(orders) != len(set(orders)):
      raise serializers.ValidationError("Duplicate node order is not allowed.")
    return data

  def create(self, validated_data):
    nodes = validated_data.pop("nodes")
    plan = MailPlan.objects.create(**validated_data)

    for node in nodes:
      MailNode.objects.create(plan=plan, **node)

    return plan

  def update(self, instance, validated_data):
    nodes = validated_data.pop("nodes", None)

    # Update basic plan fields
    for attr, value in validated_data.items():
      setattr(instance, attr, value)
    instance.save()

    # Update nodes if included
    if nodes is not None:
      instance.nodes.all().delete()
      for node in nodes:
        MailNode.objects.create(plan=instance, **node)

    return instance