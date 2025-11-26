from rest_framework import viewsets
from .models import Attendant
from .serializers import AttendantSerializer

class AttendantViewSet(viewsets.ModelViewSet):
    queryset= Attendant.objects.all()
    serializer_class= AttendantSerializer