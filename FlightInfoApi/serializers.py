from rest_framework import serializers
from .models import Flight, Airport, PlaneType

class AirportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airport
        fields = '__all__'

class PlaneTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaneType
        fields = '__all__'

class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = '__all__'