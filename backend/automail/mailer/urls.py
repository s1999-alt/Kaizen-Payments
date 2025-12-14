from django.urls import path
from .views import MailPlanList, MailPlanCreate, MailPlanDetail, MailPlanUpdate, RecipientList, RegisterView, LoginView, LogoutView, MailPlanRun


urlpatterns = [
  path("register/", RegisterView.as_view(), name="register"),
  path("login/", LoginView.as_view(), name="login"),
  path("logout/", LogoutView.as_view(), name="logout"),

  path('plans/', MailPlanList.as_view(), name='mailplan-list'),
  path('plans/create/', MailPlanCreate.as_view(), name='mailplan-create'),
  path('plans/<int:pk>/run/', MailPlanRun.as_view(), name='mailplan-run'),
  path('plans/<int:pk>/', MailPlanDetail.as_view(), name='mailplan-detail'),
  path('plans/<int:pk>/update/', MailPlanUpdate.as_view(), name='mailplan-update'),

  path('recipients/', RecipientList.as_view(), name='recipient-list'),
]
