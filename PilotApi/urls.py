from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PilotViewSet

router = DefaultRouter()
router.register(r'pilots', PilotViewSet)

urlpatterns = [
    path('', include(router.urls)),
]