import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Login } from "./components/Login";
import { FlightSelector } from "./components/FlightSelector";
import { TabularView } from "./components/TabularView";
import { PlaneView } from "./components/PlaneView";
import { ExtendedView } from "./components/ExtendedView";
import { RosterActions } from "./components/RosterActions";
import type {
  Flight,
} from "./data/mockData";
import { Plane, ArrowLeft } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import {
  fetchFlights,
  generateRoster,
} from "./services/api";
import type { GenerateRosterResponse } from "./services/api";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, setEmployeeId] = useState("");
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [activeTab, setActiveTab] = useState("tabular");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoadingFlights, setIsLoadingFlights] = useState(false);
  const [rosterData, setRosterData] = useState<GenerateRosterResponse | null>(null);
  const [isLoadingRoster, setIsLoadingRoster] = useState(false);
  const [autoAssignCrew, setAutoAssignCrew] = useState(true);
  const [autoAssignSeats, setAutoAssignSeats] = useState(true);

  // Fetch flights when logged in
  useEffect(() => {
    if (isLoggedIn) {
      loadFlights();
    }
  }, [isLoggedIn]);

  const loadFlights = async () => {
    setIsLoadingFlights(true);
    try {
      const flightsData = await fetchFlights();
      setFlights(flightsData);
    } catch (error) {
      toast.error("Failed to load flights", {
        description: error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setIsLoadingFlights(false);
    }
  };

  const loadRoster = async (flight: Flight) => {
    setIsLoadingRoster(true);
    try {
      const roster = await generateRoster({
        flightNumber: flight.flightNumber,
        autoAssignCrew,
        autoAssignSeats,
      });
      setRosterData(roster);
    } catch (error) {
      toast.error("Failed to generate roster", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsLoadingRoster(false);
    }
  };

  const handleSelectFlight = async (flight: Flight) => {
    setSelectedFlight(flight);
    setActiveTab("tabular");
    await loadRoster(flight);
  };

  const handleBackToSelection = () => {
    setSelectedFlight(null);
    setRosterData(null);
  };

  const handleRegenerateRoster = async () => {
    if (selectedFlight) {
      await loadRoster(selectedFlight);
      toast.success("Roster regenerated", {
        description: "New crew and seat assignments have been generated",
      });
    }
  };

  const handleAssignmentSettingsChange = (crew: boolean, seats: boolean) => {
    setAutoAssignCrew(crew);
    setAutoAssignSeats(seats);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Toaster />
        <div className="border-b bg-white">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-3">
              <Plane className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="mb-0">Flight Roster Management System</h1>
                <p className="text-sm text-neutral-600">
                  Generate and manage flight rosters for airline operations
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          <Login
            onLogin={(id) => {
              setIsLoggedIn(true);
              setEmployeeId(id);
            }}
          />
        </div>
      </div>
    );
  }

  if (!selectedFlight) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Toaster />
        <div className="border-b bg-white">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-3">
              <Plane className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="mb-0">Flight Roster Management System</h1>
                <p className="text-sm text-neutral-600">
                  Generate and manage flight rosters for airline operations
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          <FlightSelector
            flights={flights}
            onSelectFlight={handleSelectFlight}
            isLoading={isLoadingFlights}
          />
        </div>
      </div>
    );
  }

  // Show loading state while roster is being generated
  if (isLoadingRoster || !rosterData) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Toaster />
        <div className="border-b bg-white">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-3">
              <Plane className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="mb-0">Flight Roster Management System</h1>
                <p className="text-sm text-neutral-600">
                  Loading roster data...
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Generating roster...</p>
          </div>
        </div>
      </div>
    );
  }

  const { pilots: flightPilots, cabinCrew: flightCabinCrew, passengers: flightPassengers } = rosterData;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Toaster />
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToSelection}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="h-8 w-px bg-neutral-200" />
              <Plane className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="mb-0">Flight {selectedFlight.flightNumber}</h1>
                <p className="text-sm text-neutral-600">
                  {selectedFlight.source.city} → {selectedFlight.destination.city}
                </p>
              </div>
            </div>

            <Card className="px-4 py-2">
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-neutral-600">Aircraft:</span>{" "}
                  <span>{selectedFlight.vehicleType.name}</span>
                </div>
                <div>
                  <span className="text-neutral-600">Crew:</span>{" "}
                  <span>
                    {flightPilots.length + flightCabinCrew.length}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-600">Passengers:</span>{" "}
                  <span>{flightPassengers.length}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="tabular">Tabular View</TabsTrigger>
                <TabsTrigger value="plane">Plane View</TabsTrigger>
                <TabsTrigger value="extended">Extended View</TabsTrigger>
              </TabsList>

              <TabsContent value="tabular">
                <TabularView
                  pilots={flightPilots}
                  cabinCrew={flightCabinCrew}
                  passengers={flightPassengers}
                />
              </TabsContent>

              <TabsContent value="plane">
                <PlaneView
                  vehicleType={selectedFlight.vehicleType}
                  pilots={flightPilots}
                  cabinCrew={flightCabinCrew}
                  passengers={flightPassengers}
                />
              </TabsContent>

              <TabsContent value="extended">
                <ExtendedView
                  pilots={flightPilots}
                  cabinCrew={flightCabinCrew}
                  passengers={flightPassengers}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <RosterActions
              flightNumber={selectedFlight.flightNumber}
              pilots={flightPilots}
              cabinCrew={flightCabinCrew}
              passengers={flightPassengers}
              onRegenerateRoster={handleRegenerateRoster}
              onAssignmentSettingsChange={handleAssignmentSettingsChange}
              autoAssignCrew={autoAssignCrew}
              autoAssignSeats={autoAssignSeats}
            />
          </div>
        </div>
      </div>
    </div>
  );
}