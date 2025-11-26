from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/flight-info/', include('FlightInfoApi.urls')),
    path('api/pilots/', include('PilotApi.urls')),
    path('api/cabin-crew/', include('CabinCrewApi.urls')),
    path('api/passengers/', include('PassengerApi.urls')),
    path('main/', include('skycrewApp.urls')),
]