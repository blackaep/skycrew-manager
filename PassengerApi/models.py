from django.db import models
# We need to link passengers to a specific Flight
from FlightInfoApi.models import Flight

class Passenger(models.Model):
    SEAT_TYPE_CHOICES = [
        ('BUSINESS', 'Business'),
        ('ECONOMY', 'Economy'),
    ]

    # Link to the flight
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, related_name='passengers')
    
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=20)
    nationality = models.CharField(max_length=50)
    seat_type = models.CharField(max_length=10, choices=SEAT_TYPE_CHOICES)
    
    # Requirement: Seat number might be absent (null=True)
    seat_number = models.CharField(max_length=5, blank=True, null=True)
    
    # Requirement: Infant (0-2) has single parent info
    # 'self' allows us to link to another Passenger model
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='infant')
    
    # Requirement: List of affiliated passenger ids (neighbors)
    affiliated_passengers = models.ManyToManyField('self', blank=True)

    def __str__(self):
        return f"{self.name} - {self.flight.flight_number}"