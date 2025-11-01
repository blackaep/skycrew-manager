from django.db import models

# 1. Airport Model
# Stores detailed location information to avoid redundancy in the Flight model.
class Airport(models.Model):
    """
    Represents an airport with its geographical and identifier details.
    Code is in AAA format (e.g., IST, JFK).
    """
    code = models.CharField(max_length=3, unique=True, primary_key=True, 
                            help_text="Airport code (AAA format).")
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} ({self.code})"

# 2. Vehicle Type Model
# Stores details about the plane used for the flight.
class VehicleType(models.Model):
    """
    Represents a type of aircraft with capacity and menu information.
    """
    type_name = models.CharField(max_length=50, unique=True)
    total_seats = models.IntegerField(help_text="Total number of passenger seats.")
    max_flight_crew = models.IntegerField(help_text="Maximum allowed flight crew (pilots).")
    max_cabin_crew = models.IntegerField(help_text="Maximum allowed cabin crew.")
    
    # Simple representation of the seating plan and menu
    seating_plan_info = models.TextField(help_text="JSON or descriptive text detailing seat layout.")
    standard_menu = models.TextField(help_text="Description of the standard menu served.")

    def __str__(self):
        return self.type_name

# 3. Shared Flight Information Model
# Stores information if a flight is shared with another airline.
class SharedFlightInfo(models.Model):
    """
    Details about a shared flight arrangement.
    """
    partner_flight_number = models.CharField(max_length=6, help_text="Partner airline's flight number (AANNNN format).")
    partner_company_name = models.CharField(max_length=100)
    connecting_flight_info = models.TextField(blank=True, null=True, 
                                              help_text="Details on any additional connecting flight (optional).")
    
    def __str__(self):
        return f"Shared with {self.partner_company_name} ({self.partner_flight_number})"

# 4. Flight Model (The core)
class Flight(models.Model):
    """
    The main flight record, aggregating all related information.
    Flight number is AANNNN format, where AA is constant for this company.
    """
    flight_number = models.CharField(max_length=6, unique=True, primary_key=True, 
                                     help_text="Unique flight ID (AANNNN format).")
    
    # Flight Information (Date, Duration, Distance)
    departure_time = models.DateTimeField(help_text="The date and time the flight is scheduled to take off.")
    duration_minutes = models.IntegerField(help_text="Duration of the flight in minutes.")
    distance_km = models.IntegerField(help_text="Flight distance in kilometers.")
    
    # Source and Destination (Foreign Keys to Airport)
    source = models.ForeignKey(Airport, on_delete=models.PROTECT, related_name='departures', 
                               help_text="Originating airport.")
    destination = models.ForeignKey(Airport, on_delete=models.PROTECT, related_name='arrivals', 
                                    help_text="Destination airport.")
    
    # Vehicle Type (Foreign Key)
    vehicle_type = models.ForeignKey(VehicleType, on_delete=models.PROTECT, related_name='flights', 
                                     help_text="The type of aircraft used for this flight.")

    # Shared Flight Info (One-to-One relationship, optional)
    shared_info = models.OneToOneField(SharedFlightInfo, on_delete=models.SET_NULL, null=True, blank=True,
                                       help_text="Optional link to shared flight details.")

    def __str__(self):
        return f"Flight {self.flight_number}: {self.source.code} to {self.destination.code}"

    class Meta:
        ordering = ['departure_time']
