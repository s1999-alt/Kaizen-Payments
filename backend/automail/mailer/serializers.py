from rest_framework import serializers
from .models import Recipient, MailPlan, MailNode
from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
  password = serializers.CharField(write_only=True)
  password2 = serializers.CharField(write_only=True)

  class Meta:
    model = User
    fields = ['id', 'username', 'email', 'password', 'password2']
  
  def validate_email(self, value):
    if User.objects.filter(email=value).exists():
      raise serializers.ValidationError("Email already exists")
    return value

  def validate(self, data):
    if data['password'] != data['password2']:
      raise serializers.ValidationError({
        "password": "Passwords do not match"
      })
    return data

  def create(self, validated_data):
    validated_data.pop('password2')
    user = User.objects.create_user(
      username=validated_data['username'],
      email=validated_data.get('email', ""),
      password=validated_data['password']
    )
    return user


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
    nodes_data = validated_data.pop("nodes", None)

    for attr, value in validated_data.items():
      setattr(instance, attr, value)
    instance.save()

    if nodes_data is not None:

      existing_nodes = {n.id: n for n in instance.nodes.all()}

      for node in nodes_data:
        node_id = node.get("id", None)

        if node_id and node_id in existing_nodes:
          node_obj = existing_nodes[node_id]
          for attr, value in node.items():
              setattr(node_obj, attr, value)
          node_obj.save()
          del existing_nodes[node_id]
        else:
          MailNode.objects.create(plan=instance, **node)

      for leftover in existing_nodes.values():
        leftover.delete()

    return instance