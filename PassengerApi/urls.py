from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_passengers),
    path('create/', views.create_passenger),
    path('<int:passenger_id>/', views.passenger_detail),
    path('flight/<str:flight_id>/', views.get_flight_passengers),
    path('flight/<str:flight_id>/info/', views.get_flight_info),
]
