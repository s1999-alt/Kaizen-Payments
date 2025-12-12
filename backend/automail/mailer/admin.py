from django.contrib import admin
from .models import Recipient, MailPlan, MailNode, MailLog

admin.site.register(Recipient)
admin.site.register(MailPlan)
admin.site.register(MailNode)
admin.site.register(MailLog)
