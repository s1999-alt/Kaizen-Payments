from celery import shared_task
from django.core.mail import send_mail
from .models import MailNode, Recipient, MailPlan, MailLog
from django.utils import timezone

@shared_task
def get_next_node(current_node):
  return MailNode.objects.filter(
    plan=current_node.plan,
    order__gt=current_node.order
  ).order_by("order").first()

@shared_task
def send_scheduled_mail(node_id):
  try:
    node = MailNode.objects.get(id=node_id)
  except MailNode.DoesNotExist:
    return f"Node {node_id} does not exist"
  
  recipients = Recipient.objects.all()
  filters = node.recipient_filter or {}

  if "email" in filters:
    recipients = recipients.filter(email__icontains=filters["email"])

  if "tags" in filters:
    tag = filters["tags"]
    recipients = recipients.filter(tags__contains=[tag])

  if not recipients.exists():
    return f"No recipients found for node {node_id}"
  
  for r in recipients:
    try:
      send_mail(
        subject=node.subject,
        message=node.body,
        from_email="noreply@example.com",
        recipient_list=[r.email],
        fail_silently=False,
      )

      MailLog.objects.create(
        node=node,
        recipient=r.email,
        status="success"
      )
    except Exception as e:
      MailLog.objects.create(
        node=node,
        recipient=r.email,
        status="failed",
        error=str(e)
      )
  next_node = get_next_node(node)
  if next_node:
    execute_node.delay(next_node.id)   
  return f"Emails processed for node {node_id}"

@shared_task
def execute_node(node_id):
  node = MailNode.objects.get(id=node_id)

  if node.trigger_type == 'delay':
    send_scheduled_mail.apply_async((node.id,), countdown=node.delay_minutes * 60)
    return f"Delayed node {node.id}"

  if node.trigger_type == 'schedule':
    send_scheduled_mail.apply_async((node.id,), eta=node.scheduled_datetime)
    return f"Scheduled node {node.id}"

  if node.trigger_type == "on_event":
    return f"Node {node.id} waiting for event {node.event_name}"

  send_scheduled_mail.delay(node.id)
  return f"Executed immediate node {node.id}"

@shared_task
def execute_mail_plan(plan_id):
  plan = MailPlan.objects.get(id=plan_id)
  first_node = plan.nodes.order_by("order").first()
  if first_node:
      execute_node.delay(first_node.id)
  return f"Mail plan {plan.name} started"

# @shared_task
# def check_and_run_plans():
#   active_plans = MailPlan.objects.filter(is_active=True, last_executed_at__isnull=True)

#   for plan in active_plans:
#     execute_mail_plan.delay(plan.id)
#     plan.last_executed_at = timezone.now()
#     plan.save()

#   return f"Triggered {active_plans.count()} new plans"



   

      

