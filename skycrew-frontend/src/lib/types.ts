export interface Flight {
    id: string; // Internal ID
    flight_number: string;
    source: Airport;
    destination: Airport;
    departure_time: string;
    arrival_time: string;
    duration: string;
    distance: number;
    plane_type: PlaneType;
    is_shared: boolean;
    partner_company_name?: string;
    airline?: string; // e.g. "Turkish Airlines"
}

export interface Airport {
    code: string; // "IST"
    city: string; // "Istanbul"
    name: string; // "Istanbul Airport"
    country: string;
}

export interface PlaneType {
    name: string; // "Airbus A320"
    model: string;
    capacity: number;
    total_seats: number;
}

export interface CrewMember {
    id: string;
    name: string;
    role: 'Pilot' | 'CabinCrew';
    rank: string; // "Captain", "Senior", "Chief"
    gender?: string;
    nationality?: string;
    assigned_flight_number?: string | null;
}

export interface Passenger {
    id: string;
    name: string;
    seat_number: string | null;
    class_type?: 'Business' | 'Economy';
    is_infant?: boolean;
}

export interface RosterResponse {
    pilots: CrewMember[];
    cabinCrew: CrewMember[];
    passengers: Passenger[];
}

export interface User {
    employee_id: string;
    name: string;
    role: string;
    token?: string;
}
