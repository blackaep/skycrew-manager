from django.urls import path
from .views import GenerateRosterView

urlpatterns = [
    # URL will look like: /main/generate/SC1001/
    path('generate/<str:flight_id>/', GenerateRosterView.as_view()),
]