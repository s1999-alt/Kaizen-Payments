from celery import shared_task
from django.core.mail import send_mail
from .models import MailNode, Recipient

@shared_task
def send_scheduled_mail(node_id):
  try:
    node = MailNode.objects.get(node_id)
  except MailNode.DoesNotExist:
    return f"Node {node_id} does not exist"
  
  recipients = Recipient.objects.all()
  filters = node.recipient_filter or {}

  if "email" in filters:
      recipients = recipients.filter(email__icontains=filters["email"])

  if "tags" in filters:
      recipients = recipients.filter(tags__icontains=[filters["tags"]])

  recipient_emails = [r.email for r in recipients]

  if not recipient_emails:
        return f"No recipients found for node {node_id}"

  send_mail(
    subject=node.subject,
    message=node.body,
    from_email="noreply@example.com",
    recipient_list=recipient_emails,
    fail_silently=False,
  )
  return f"Email sent for node {node_id} to {recipient_emails}"



