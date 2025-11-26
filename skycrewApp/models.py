from django.db import models

class FlightRoster(models.Model):
    # We store the Flight ID (e.g., "SC1001") as a string.
    # We do NOT use a ForeignKey because, architecturally, the Flight API 
    # is supposed to be a "separate service."
    flight_id = models.CharField(max_length=10, unique=True)
    
    # When did we generate this roster?
    generated_at = models.DateTimeField(auto_now_add=True)
    
    # The Magic Field: This will store the final Pilot, Crew, and Passenger lists
    # effectively as a document. This makes the "Export to JSON" requirement trivial.
    roster_data = models.JSONField()

    def __str__(self):
        return f"Roster for {self.flight_id}"