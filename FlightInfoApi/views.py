from django.shortcuts import render

# Create your views here.

from django.http import JsonResponse

def get_routes(request):
    routes = {
        "GET /api/flightinfo/flights/": "List all flights",
        "GET /api/flightinfo/flights/<id>/": "Get details for one flight",
    }
    return JsonResponse(routes)

def flight_list(request):
    data = [
        {"flight_id": "TK1933", "origin": "Istanbul", "destination": "Berlin"},
        {"flight_id": "BA067", "origin": "London", "destination": "New York"},
    ]
    return JsonResponse(data, safe=False)

def flight_detail(request, pk):
    data = {"flight_id": f"FLIGHT-{pk}", "origin": "Istanbul", "destination": "Rome"}
    return JsonResponse(data)
