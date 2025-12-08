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

  



