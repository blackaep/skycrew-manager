from django.shortcuts import render

# Create your views here.

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Passenger
from .serializers import PassengerSerializer
import requests

@api_view(['GET'])
def list_passengers(request):
    """Return all passengers"""
    passengers = Passenger.objects.all()
    serializer = PassengerSerializer(passengers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def passenger_detail(request, passenger_id):
    """Return a single passenger"""
    try:
        passenger = Passenger.objects.get(passenger_id=passenger_id)
    except Passenger.DoesNotExist:
        return Response({"error": "Passenger not found"}, status=404)
    
    serializer = PassengerSerializer(passenger)
    return Response(serializer.data)

@api_view(['POST'])
def create_passenger(request):
    """Create a new passenger"""
    serializer = PassengerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_flight_passengers(request, flight_id):
    """Get all passengers on a specific flight (used by cabin crew / flight API)"""
    passengers = Passenger.objects.filter(flight_id=flight_id)
    serializer = PassengerSerializer(passengers, many=True)
    return Response(serializer.data)

# Example: Communicate with Flight API
@api_view(['GET'])
def get_flight_info(request, flight_id):
    """Retrieve flight details from the Flight API"""
    FLIGHT_API_URL = "http://127.0.0.1:8002/api/flights/"  # Example URL
    try:
        flight_data = requests.get(f"{FLIGHT_API_URL}{flight_id}/").json()
        return Response(flight_data)
    except Exception as e:
        return Response({"error": f"Could not fetch flight info: {e}"}, status=500)
