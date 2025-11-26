from django.db import models
from django.core.validators import RegexValidator

class Airport(models.Model):
    # Requirement: Code is AAA format
    code = models.CharField(
        max_length=3, 
        unique=True,
        validators=[RegexValidator(r'^[A-Z]{3}$', 'Code must be 3 uppercase letters')]
    )
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.code} - {self.name}"

class PlaneType(models.Model):
    # Requirement: At least 3 types, seating plan, capacity
    name = models.CharField(max_length=50) # e.g., Boeing 737
    seat_capacity = models.IntegerField()
    crew_limit = models.IntegerField()
    # For the seating plan, we might store a JSON structure or a file path
    seating_plan_layout = models.JSONField(help_text="JSON structure of seat coordinates")
    standard_menu = models.TextField(help_text="Standard menu served on this vehicle")

    def __str__(self):
        return self.name

class Flight(models.Model):
    # Requirement: AANNNN format. First two letters always same (e.g., 'SC' for SkyCrew)
    flight_number = models.CharField(
        max_length=6,
        unique=True,
        validators=[RegexValidator(r'^[A-Z]{2}\d{4}$', 'Format must be AANNNN')]
    )
    departure_time = models.DateTimeField() # Resolution of minutes
    duration = models.DurationField()
    distance = models.FloatField()
    
    source = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='departures')
    destination = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='arrivals')
    
    plane_type = models.ForeignKey(PlaneType, on_delete=models.PROTECT)
    
    # Shared Flight Info
    is_shared = models.BooleanField(default=False)
    partner_company_name = models.CharField(max_length=100, blank=True, null=True)
    partner_flight_number = models.CharField(max_length=6, blank=True, null=True)
    
    # Requirement: Connecting flight info ONLY for shared flights
    connecting_flight_info = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.flight_number