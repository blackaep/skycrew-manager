from django.db import models

# Create your models here.


from django.db import models

class Passenger(models.Model):
    passenger_id = models.AutoField(primary_key=True)
    flight_id = models.CharField(max_length=10)  # Matches Flight API

    # Core info
    name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10)
    nationality = models.CharField(max_length=50)

    # Seat info (only for seated passengers)
    SEAT_TYPES = [
        ('business', 'Business'),
        ('economy', 'Economy'),
    ]
    seat_type = models.CharField(max_length=10, choices=SEAT_TYPES, blank=True, null=True)
    seat_number = models.CharField(max_length=5, blank=True, null=True)

    # For infants → links to parent
    parent_passenger = models.ForeignKey(
        'self',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='infants'
    )

    # For grouped passengers (family/friends sitting together)
    affiliated_passenger_ids = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.flight_id})"

    @property
    def is_infant(self):
        """Derived property for logic convenience"""
        return self.age <= 2

