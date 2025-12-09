// API Configuration
// Update this URL to match your Django backend
export const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication (Mocked in services/api.ts)
  LOGIN: '/api/auth/login/',
  LOGOUT: '/api/auth/logout/',

  // Flight Information API
  FLIGHTS: '/api/flight-info/flights/',
  FLIGHT_DETAIL: (flightNumber: string) => `/api/flight-info/flights/${flightNumber}/`,

  // Flight Crew API (Pilots)
  PILOTS: '/api/pilots/pilots/',
  PILOT_DETAIL: (id: string) => `/api/pilots/pilots/${id}/`,
  AVAILABLE_PILOTS: (vehicleType: string, distance: number) =>
    `/api/pilots/pilots/available/?vehicle_type=${vehicleType}&distance=${distance}`,

  // Cabin Crew API
  CABIN_CREW: '/api/cabin-crew/attendants/',
  CABIN_CREW_DETAIL: (id: string) => `/api/cabin-crew/attendants/${id}/`,
  AVAILABLE_CABIN_CREW: (vehicleType: string) =>
    `/api/cabin-crew/attendants/available/?vehicle_type=${vehicleType}`,

  // Passenger API
  PASSENGERS: '/api/passengers/passengers/',
  PASSENGER_DETAIL: (id: string) => `/api/passengers/passengers/${id}/`,
  FLIGHT_PASSENGERS: (flightId: string) => `/api/passengers/passengers/flight/${flightId}/`,

  // Roster Management (Note: Backend is at /main/generate/)
  // We will handle the full path in the service or assume /api prefix is stripped for this specific call?
  // Actually, API_BASE_URL includes /api. We need to handle this.
  ROSTER_GENERATE: (flightNumber: string) => `/main/generate/${flightNumber}/`,
  ROSTER_SAVE: '/api/roster/save/',
  ROSTER_EXPORT: (flightNumber: string) => `/api/roster/export/${flightNumber}/`,
  ROSTER_DETAIL: (flightNumber: string) => `/api/roster/${flightNumber}/`,
};

// Helper function to get auth token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token
export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Helper function to get auth headers
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};