from rest_framework import serializers
from .models import Passenger

class PassengerSerializer(serializers.ModelSerializer):
    affiliated_passengers = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Passenger
        fields = '__all__'

    def validate(self, data):
        """
        Check that infants (0-2) cannot be parents.
        Check that infants MUST have a parent.
        """
        age = data.get('age')
        parent = data.get('parent')

        # Rule 1: Infants cannot be parents
        # We check this by looking at the person assigned as 'parent'. 
        # If the assigned parent is themselves an infant, we block it.
        if parent is not None:
            if parent.age <= 2:
                raise serializers.ValidationError({
                    "parent": f"Passenger '{parent.name}' is an infant (Age {parent.age}). Infants cannot be parents."
                })

        # Rule 2: Infants must have a parent (Per requirements)
        if age is not None and age <= 2 and parent is None:
            raise serializers.ValidationError({
                "parent": "Infant passengers (age 0-2) must have a parent assigned."
            })

        return data