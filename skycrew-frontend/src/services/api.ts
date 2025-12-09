import {
  API_BASE_URL,
  API_ENDPOINTS,
  getAuthHeaders,
  setAuthToken,
  removeAuthToken
} from '../config/api';
import type {
  Flight,
  Pilot,
  CabinCrew,
  Passenger,
} from '../data/mockData';
import {
  vehicleTypes as mockVehicleTypes,
} from '../data/mockData';

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getAuthHeaders();

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Unauthorized - clear token and redirect to login
        removeAuthToken();
        throw new Error('Authentication failed. Please login again.');
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error. Please check your connection.');
  }
}

// Authentication API
export async function loginUser(
  employeeId: string,
  _password: string
): Promise<{ token: string; employeeId: string; name?: string }> {
  // MOCK LOGIN
  const response = {
    token: "mock-token-123",
    employee_id: employeeId || "SC-1001",
    name: "Demo User"
  };

  // Save token to localStorage
  setAuthToken(response.token);

  return {
    token: response.token,
    employeeId: response.employee_id,
    name: response.name,
  };
}

export async function logoutUser(): Promise<void> {
  try {
    await apiRequest(API_ENDPOINTS.LOGOUT, {
      method: 'POST',
    });
  } finally {
    removeAuthToken();
  }
}

// Adapters
function adaptFlight(data: any): Flight {
  // Defensive coding: handle potentially missing nested data if serializer or data is incomplete
  const source = data.source || {};
  const destination = data.destination || {};
  const plane = data.plane_type || {};

  // Standardize plane name keys to match mock keys (A320, B737, B787)
  let modelKey = "A320";
  if (plane.name?.includes("737")) modelKey = "B737";
  if (plane.name?.includes("787")) modelKey = "B787";

  // Robust Seating Layout Parsing
  let seatingLayout = plane.seating_plan_layout;
  if (typeof seatingLayout === 'string') {
    try {
      seatingLayout = JSON.parse(seatingLayout);
    } catch (e) {
      console.warn("Failed to parse seating layout JSON", e);
      seatingLayout = null;
    }
  }

  // Fallback to mock data if missing
  if (!seatingLayout || !seatingLayout.business) {
    seatingLayout = mockVehicleTypes[modelKey]?.seatingLayout || mockVehicleTypes["A320"].seatingLayout;
  }

  return {
    flightNumber: data.flight_number,
    date: data.departure_time,
    duration: data.duration ? parseDuration(data.duration) : 0,
    distance: data.distance,
    source: {
      country: source.country || "Unknown",
      city: source.city || "Unknown",
      airportName: source.name || "Unknown Airport",
      airportCode: source.code || "XXX",
    },
    destination: {
      country: destination.country || "Unknown",
      city: destination.city || "Unknown",
      airportName: destination.name || "Unknown Airport",
      airportCode: destination.code || "XXX",
    },
    vehicleType: {
      name: plane.name || mockVehicleTypes[modelKey].name,
      type: (modelKey as any),
      totalSeats: plane.seat_capacity || mockVehicleTypes[modelKey].totalSeats,
      businessSeats: plane.crew_limit ? 0 : mockVehicleTypes[modelKey].businessSeats, // fallback
      economySeats: plane.crew_limit ? 0 : mockVehicleTypes[modelKey].economySeats, // fallback
      seatingLayout: seatingLayout,
      crewLimits: mockVehicleTypes[modelKey].crewLimits,
      standardMenu: plane.standard_menu ? [plane.standard_menu] : mockVehicleTypes[modelKey].standardMenu,
    },
    // Mock shared flight logic if needed, or map from data.is_shared
    sharedFlight: data.is_shared ? {
      flightNumber: data.partner_flight_number,
      airline: data.partner_company_name,
      connecting: !!data.connecting_flight_info
    } : undefined
  };
}

function parseDuration(duration: string): number {
  if (!duration) return 0;
  // TODO: Implement proper parsing if needed, for now return raw minutes if possible or mock
  return 180;
}

export async function fetchFlights(): Promise<Flight[]> {
  const data = await apiRequest<any[]>(API_ENDPOINTS.FLIGHTS);
  return data.map(adaptFlight);
}

export async function fetchFlightDetail(flightNumber: string): Promise<Flight> {
  return apiRequest<Flight>(API_ENDPOINTS.FLIGHT_DETAIL(flightNumber));
}

// Flight Crew API (Pilots)
function adaptPilot(data: any): Pilot {
  // Backend returns: allowed_vehicle (ID), known_languages (string), name (string), etc.
  return {
    id: String(data.id),
    name: data.name,
    age: data.age,
    gender: data.gender,
    nationality: data.nationality,
    languages: data.known_languages ? String(data.known_languages).split(',').map(s => s.trim()) : [],
    vehicleRestriction: String(data.allowed_vehicle), // ID as string
    allowedRange: data.allowed_range,
    seniority: data.seniority?.toLowerCase() as "senior" | "junior" | "trainee",
  };
}

export async function fetchPilots(): Promise<Pilot[]> {
  const data = await apiRequest<any[]>(API_ENDPOINTS.PILOTS);
  return data.map(adaptPilot);
}

export async function fetchAvailablePilots(
  vehicleType: string,
  distance: number
): Promise<Pilot[]> {
  const data = await apiRequest<any[]>(
    API_ENDPOINTS.AVAILABLE_PILOTS(vehicleType, distance)
  );
  return data.map(adaptPilot);
}

export async function fetchPilotDetail(id: string): Promise<Pilot> {
  const data = await apiRequest<any>(API_ENDPOINTS.PILOT_DETAIL(id));
  return adaptPilot(data);
}

// Cabin Crew API
function adaptCabinCrew(data: any): CabinCrew {
  // Backend: allowed_vehicles (ID[]), known_languages (string), attendant_type (UPPERCASE), recipes (obj[])
  return {
    id: String(data.id),
    name: data.name,
    age: data.age,
    gender: data.gender,
    nationality: data.nationality,
    languages: data.known_languages ? String(data.known_languages).split(',').map(s => s.trim()) : [],
    type: data.attendant_type?.toLowerCase() as "chief" | "regular" | "chef",
    vehicleRestrictions: Array.isArray(data.allowed_vehicles) ? data.allowed_vehicles.map(String) : [],
    recipes: Array.isArray(data.recipes) ? data.recipes.map((r: any) => r.dish_name) : [],
  };
}

export async function fetchCabinCrew(): Promise<CabinCrew[]> {
  const data = await apiRequest<any[]>(API_ENDPOINTS.CABIN_CREW);
  return data.map(adaptCabinCrew);
}

export async function fetchAvailableCabinCrew(vehicleType: string): Promise<CabinCrew[]> {
  const data = await apiRequest<any[]>(
    API_ENDPOINTS.AVAILABLE_CABIN_CREW(vehicleType)
  );
  return data.map(adaptCabinCrew);
}

export async function fetchCabinCrewDetail(id: string): Promise<CabinCrew> {
  const data = await apiRequest<any>(API_ENDPOINTS.CABIN_CREW_DETAIL(id));
  return adaptCabinCrew(data);
}

// Passenger API
function adaptPassenger(data: any): Passenger {
  // Backend: seat_type (UPPERCASE), seat_number, parent (ID), affiliated_passengers (ID[])
  return {
    id: String(data.id),
    flightId: String(data.flight), // ID
    name: data.name,
    age: data.age,
    gender: data.gender,
    nationality: data.nationality,
    seatType: data.seat_type?.toLowerCase() as "business" | "economy",
    seatNumber: data.seat_number || undefined,
    parentId: data.parent ? String(data.parent) : undefined,
    affiliatedPassengers: Array.isArray(data.affiliated_passengers) ? data.affiliated_passengers.map(String) : [],
  };
}

export async function fetchPassengers(): Promise<Passenger[]> {
  const data = await apiRequest<any[]>(API_ENDPOINTS.PASSENGERS);
  return data.map(adaptPassenger);
}

export async function fetchFlightPassengers(flightId: string): Promise<Passenger[]> {
  const data = await apiRequest<any[]>(API_ENDPOINTS.FLIGHT_PASSENGERS(flightId));
  return data.map(adaptPassenger);
}

export async function fetchPassengerDetail(id: string): Promise<Passenger> {
  const data = await apiRequest<any>(API_ENDPOINTS.PASSENGER_DETAIL(id));
  return adaptPassenger(data);
}

// Roster Management API
export interface GenerateRosterRequest {
  flightNumber: string;
  autoAssignCrew: boolean;
  autoAssignSeats: boolean;
}

export interface GenerateRosterResponse {
  flight: Flight;
  pilots: Pilot[];
  cabinCrew: CabinCrew[];
  passengers: Passenger[];
}

export async function generateRoster(
  request: GenerateRosterRequest
): Promise<GenerateRosterResponse> {
  // Use the backend's GET endpoint: /main/generate/<flight_id>/
  const endpoint = API_ENDPOINTS.ROSTER_GENERATE(request.flightNumber);

  // Backend returns snake_case keys: { flight_id, pilots: [], cabin_crew: [], passengers: [] }
  // Note: Backend does NOT return the full Flight object, only ID.
  // We must fetch the flight details separately or construct a partial flight if possible.
  // Ideally, frontend already has the flight.
  // But to satisfy the Interface, we'll try to fetch the flight or allow null if we change type.
  // For now, let's fetch the flight detail to be safe and complete the object.

  // 1. Fetch Roster Data
  const rosterData = await apiRequest<any>(endpoint, { method: 'GET' });

  // 2. Fetch Flight Detail (to fulfill the contract)
  // We can assume fetchFlightDetail uses adaptFlight already.
  // NOTE: This might be redundant if App.tsx doesn't use it, but safe.
  let flight: Flight;
  try {
    flight = await fetchFlightDetail(request.flightNumber);
  } catch (e) {
    console.warn("Could not fetch flight details for roster", e);
    // Fallback mock if fetch fails?
    flight = { flightNumber: request.flightNumber } as Flight;
  }

  return {
    flight: flight,
    pilots: Array.isArray(rosterData.pilots) ? rosterData.pilots.map(adaptPilot) : [],
    cabinCrew: Array.isArray(rosterData.cabin_crew) ? rosterData.cabin_crew.map(adaptCabinCrew) : [],
    passengers: Array.isArray(rosterData.passengers) ? rosterData.passengers.map(adaptPassenger) : [],
  };
}

export interface SaveRosterRequest {
  flightNumber: string;
  pilots: Pilot[];
  cabinCrew: CabinCrew[];
  passengers: Passenger[];
}

export async function saveRoster(request: SaveRosterRequest): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    API_ENDPOINTS.ROSTER_SAVE,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  );
}

export async function exportRoster(flightNumber: string): Promise<Blob> {
  // Prefix API_BASE_URL if it's not absolute or handle if endpoint is relative
  // API_BASE_URL doesn't have /api now. Endpoints have /api.
  const url = `${API_BASE_URL}${API_ENDPOINTS.ROSTER_EXPORT(flightNumber)}`;
  const headers = getAuthHeaders();

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error('Failed to export roster');
  }

  return await response.blob();
}

export async function fetchRosterDetail(flightNumber: string): Promise<GenerateRosterResponse> {
  // Similar adapter logic needed here if used.
  // Assuming ROSTER_DETAIL returns same structure as Generate.
  const endpoint = API_ENDPOINTS.ROSTER_DETAIL(flightNumber);
  const rosterData = await apiRequest<any>(endpoint);

  let flight: Flight;
  try {
    flight = await fetchFlightDetail(flightNumber);
  } catch (e) {
    flight = { flightNumber } as Flight;
  }

  return {
    flight: flight,
    pilots: Array.isArray(rosterData.pilots) ? rosterData.pilots.map(adaptPilot) : [],
    cabinCrew: Array.isArray(rosterData.cabin_crew) ? rosterData.cabin_crew.map(adaptCabinCrew) : [],
    passengers: Array.isArray(rosterData.passengers) ? rosterData.passengers.map(adaptPassenger) : [],
  };
}
