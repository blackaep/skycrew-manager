from rest_framework.views import APIView
from rest_framework.response import Response
from .logic import RosterGenerator
from .models import FlightRoster

class GenerateRosterView(APIView):
    def get(self, request, flight_id):
        # 1. Run the Logic
        generator = RosterGenerator(flight_id)
        roster_data = generator.generate()

        if "error" in roster_data:
            return Response(roster_data, status=404)

        # 2. Save to Database (THE FIX)
        # update_or_create looks for a match on flight_id.
        # If found, it updates the 'defaults'. If not found, it creates a new one.
        obj, created = FlightRoster.objects.update_or_create(
            flight_id=flight_id,
            defaults={'roster_data': roster_data}
        )

        # 3. Return JSON
        return Response(roster_data)