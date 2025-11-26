from rest_framework import viewsets
from .models import Pilot
from .serializers import PilotSerializer

class PilotViewSet(viewsets.ModelViewSet):
    queryset = Pilot.objects.all()
    serializer_class = PilotSerializer