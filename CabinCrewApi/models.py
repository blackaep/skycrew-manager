from django.db import models
# We need to reference PlaneType for the vehicle restrictions
from FlightInfoApi.models import PlaneType

class Attendant(models.Model):
    TYPE_CHOICES = [
        ('CHIEF', 'Chief'),
        ('REGULAR', 'Regular'),
        ('CHEF', 'Chef'),
    ]

    name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=20)
    nationality = models.CharField(max_length=50)
    known_languages = models.CharField(max_length=200) # e.g. "English, French"
    
    attendant_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    
    # Requirement: Multiple vehicle types allowed
    allowed_vehicles = models.ManyToManyField(PlaneType)

    def __str__(self):
        return f"{self.name} ({self.attendant_type})"

class Recipe(models.Model):
    # Requirement: Chefs have 2-4 recipes affiliated with them
    # We link the recipe to the Attendant (Chef)
    chef = models.ForeignKey(Attendant, on_delete=models.CASCADE, related_name='recipes')
    dish_name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.dish_name