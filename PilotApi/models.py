from django.db import models
# We need to reference PlaneTypes. 
# Since these are separate Apps, we can either import the model if it's a monolith
# OR keep them loosely coupled using strings. For a Uni project, importing is safer.
from FlightInfoApi.models import PlaneType 

class Pilot(models.Model):
    SENIORITY_CHOICES = [
        ('TRAINEE', 'Trainee'),
        ('JUNIOR', 'Junior'),
        ('SENIOR', 'Senior'),
    ]

    name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=20)
    nationality = models.CharField(max_length=50)
    known_languages = models.CharField(max_length=200) # Comma-separated or JSON
    
    # Requirement: Pilot vehicle restriction (Single type)
    allowed_vehicle = models.ForeignKey(PlaneType, on_delete=models.PROTECT)
    
    # Requirement: Max allowed distance
    allowed_range = models.FloatField()
    
    # Requirement: Seniority Level
    seniority = models.CharField(max_length=10, choices=SENIORITY_CHOICES)

    def __str__(self):
        return f"{self.name} ({self.seniority})"