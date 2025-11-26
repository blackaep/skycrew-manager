from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AttendantViewSet

router = DefaultRouter()
router.register(r'attendants', AttendantViewSet)

urlpatterns = [
    path('', include(router.urls)),
]