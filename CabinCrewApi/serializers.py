from rest_framework import serializers
from .models import Attendant, Recipe

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ['dish_name']

class AttendantSerializer(serializers.ModelSerializer):
    # Nested serializer: This will show the actual recipes, not just IDs
    recipes = RecipeSerializer(many=True, read_only=True)
    

    class Meta:
        model = Attendant
        fields = '__all__'