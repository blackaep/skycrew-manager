from rest_framework import viewsets
from .models import Flight, Airport, PlaneType
from .serializers import FlightSerializer, AirportSerializer, PlaneTypeSerializer

class FlightViewSet(viewsets.ModelViewSet):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer

class AirportViewSet(viewsets.ModelViewSet):
    queryset = Airport.objects.all()
    serializer_class = AirportSerializer

class PlaneTypeViewSet(viewsets.ModelViewSet):
    queryset = PlaneType.objects.all()
    serializer_class = PlaneTypeSerializer