import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Search, Plane } from "lucide-react";
import type { Flight } from "../data/mockData";

interface FlightSelectorProps {
  flights: Flight[];
  onSelectFlight: (flight: Flight) => void;
  isLoading?: boolean;
}

export function FlightSelector({ flights, onSelectFlight, isLoading = false }: FlightSelectorProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mb-2">Flight Selection</h2>
          <p className="text-neutral-600">
            Loading available flights...
          </p>
        </div>
        <Card className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-neutral-600">Loading flights from Django backend...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Flight Selection</h2>
        <p className="text-neutral-600">
          Select a flight to view and manage its roster
        </p>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <Label htmlFor="flightNumber">Search by Flight Number</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="flightNumber"
              placeholder="e.g., TK1234"
              className="flex-1"
            />
            <Button>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Available Flights</Label>
          {flights.length === 0 ? (
            <div className="text-center py-12 text-neutral-600">
              <Plane className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No flights available</p>
              <p className="text-sm">Please check your Django backend connection</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {flights.map((flight) => (
                <Card
                  key={flight.flightNumber}
                  className="p-4 hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => onSelectFlight(flight)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <Plane className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded">
                            {flight.flightNumber}
                          </span>
                          {flight.sharedFlight && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                              Shared with {flight.sharedFlight.airline}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <span className="text-neutral-600">From:</span>{" "}
                            <span>
                              {flight.source.city} ({flight.source.airportCode})
                            </span>
                          </div>
                          <div>→</div>
                          <div>
                            <span className="text-neutral-600">To:</span>{" "}
                            <span>
                              {flight.destination.city} (
                              {flight.destination.airportCode})
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-neutral-600">
                          <span>
                            {new Date(flight.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span>•</span>
                          <span>
                            {Math.floor(flight.duration / 60)}h{" "}
                            {flight.duration % 60}m
                          </span>
                          <span>•</span>
                          <span>{flight.distance} km</span>
                          <span>•</span>
                          <span>{flight.vehicleType.name}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Select
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}