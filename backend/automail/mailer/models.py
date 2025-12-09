from django.db import models
from django.contrib.auth.models import User


class Recipient(models.Model):
  email = models.EmailField(unique=True)
  name = models.CharField(max_length=100, blank=True)
  tags = models.JSONField(default=list, blank=True)

  def __str__(self):
    return self.email
  

class MailPlan(models.Model):
  name = models.CharField(max_length=200)
  description = models.TextField(blank=True)
  created_by = models.ForeignKey(User, on_delete=models.CASCADE)
  is_active = models.BooleanField(default=True)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return self.name

  
class MailNode(models.Model):
  TRIGGER_TYPES = [
    ("on_event", "On Event"),
    ("delay", "After Delay"),
    ("schedule", "Scheduled Time"),
  ]

  plan = models.ForeignKey(MailPlan, related_name='nodes', on_delete=models.CASCADE)
  order = models.PositiveIntegerField()
  trigger_type = models.CharField(max_length=20, choices=TRIGGER_TYPES)

  delay_minutes = models.IntegerField(null=True, blank=True)
  scheduled_datetime = models.DateTimeField(null=True, blank=True)
  event_name = models.CharField(max_length=100, blank=True)

  subject = models.CharField(max_length=200)
  body = models.TextField()

  recipient_filter = models.JSONField(default=dict)

  def __str__(self):
    return f"{self.plan.name} -> Node {self.order}"


class MailLog(models.Model):
  node = models.ForeignKey(MailNode, on_delete=models.CASCADE)
  recipient = models.EmailField()
  status = models.CharField(max_length=20)
  sent_at = models.DateTimeField(auto_now_add=True)
  error = models.TextField(blank=True)