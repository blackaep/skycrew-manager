// Mock data for all APIs

export interface Flight {
  flightNumber: string;
  date: string;
  duration: number; // minutes
  distance: number; // km
  source: {
    country: string;
    city: string;
    airportName: string;
    airportCode: string;
  };
  destination: {
    country: string;
    city: string;
    airportName: string;
    airportCode: string;
  };
  vehicleType: VehicleType;
  sharedFlight?: {
    flightNumber: string;
    airline: string;
    connecting?: boolean;
  };
}

export interface VehicleType {
  name: string;
  type: "A320" | "B737" | "B787";
  totalSeats: number;
  businessSeats: number;
  economySeats: number;
  seatingLayout: {
    business: { rows: number; cols: string[] };
    economy: { rows: number; cols: string[] };
  };
  crewLimits: {
    minPilots: number;
    maxPilots: number;
    minCabinCrew: number;
    maxCabinCrew: number;
  };
  standardMenu: string[];
}

export interface Pilot {
  id: string;
  name: string;
  age: number;
  gender: string;
  nationality: string;
  languages: string[];
  vehicleRestriction: string;
  allowedRange: number; // km
  seniority: "senior" | "junior" | "trainee";
}

export interface CabinCrew {
  id: string;
  name: string;
  age: number;
  gender: string;
  nationality: string;
  languages: string[];
  type: "chief" | "regular" | "chef";
  vehicleRestrictions: string[];
  recipes?: string[];
}

export interface Passenger {
  id: string;
  flightId: string;
  name: string;
  age: number;
  gender: string;
  nationality: string;
  seatType: "business" | "economy";
  seatNumber?: string;
  parentId?: string; // for infants
  affiliatedPassengers?: string[];
}

// Vehicle Types
export const vehicleTypes: Record<string, VehicleType> = {
  A320: {
    name: "Airbus A320",
    type: "A320",
    totalSeats: 180,
    businessSeats: 20,
    economySeats: 160,
    seatingLayout: {
      business: { rows: 5, cols: ["A", "B", "C", "D"] },
      economy: { rows: 27, cols: ["A", "B", "C", "D", "E", "F"] },
    },
    crewLimits: {
      minPilots: 2,
      maxPilots: 4,
      minCabinCrew: 5,
      maxCabinCrew: 8,
    },
    standardMenu: ["Chicken Pasta", "Vegetarian Salad", "Beef Sandwich"],
  },
  B737: {
    name: "Boeing 737",
    type: "B737",
    totalSeats: 162,
    businessSeats: 16,
    economySeats: 146,
    seatingLayout: {
      business: { rows: 4, cols: ["A", "B", "C", "D"] },
      economy: { rows: 25, cols: ["A", "B", "C", "D", "E", "F"] },
    },
    crewLimits: {
      minPilots: 2,
      maxPilots: 4,
      minCabinCrew: 4,
      maxCabinCrew: 7,
    },
    standardMenu: ["Grilled Salmon", "Caesar Salad", "Turkey Wrap"],
  },
  B787: {
    name: "Boeing 787 Dreamliner",
    type: "B787",
    totalSeats: 242,
    businessSeats: 42,
    economySeats: 200,
    seatingLayout: {
      business: { rows: 7, cols: ["A", "B", "C", "D", "E", "F"] },
      economy: { rows: 25, cols: ["A", "B", "C", "D", "E", "F", "G", "H"] },
    },
    crewLimits: {
      minPilots: 2,
      maxPilots: 4,
      minCabinCrew: 8,
      maxCabinCrew: 16,
    },
    standardMenu: [
      "Filet Mignon",
      "Lobster Risotto",
      "Vegetable Curry",
      "Greek Salad",
    ],
  },
};

// Mock Flights
export const flights: Flight[] = [
  {
    flightNumber: "TK1234",
    date: "2025-11-15T14:30:00",
    duration: 180,
    distance: 1500,
    source: {
      country: "Turkey",
      city: "Istanbul",
      airportName: "Istanbul Airport",
      airportCode: "IST",
    },
    destination: {
      country: "Germany",
      city: "Berlin",
      airportName: "Berlin Brandenburg Airport",
      airportCode: "BER",
    },
    vehicleType: vehicleTypes.A320,
  },
  {
    flightNumber: "TK5678",
    date: "2025-11-16T09:15:00",
    duration: 240,
    distance: 2200,
    source: {
      country: "Turkey",
      city: "Istanbul",
      airportName: "Istanbul Airport",
      airportCode: "IST",
    },
    destination: {
      country: "France",
      city: "Paris",
      airportName: "Charles de Gaulle Airport",
      airportCode: "CDG",
    },
    vehicleType: vehicleTypes.B737,
    sharedFlight: {
      flightNumber: "AF9876",
      airline: "Air France",
      connecting: false,
    },
  },
  {
    flightNumber: "TK9012",
    date: "2025-11-17T18:45:00",
    duration: 720,
    distance: 8500,
    source: {
      country: "Turkey",
      city: "Istanbul",
      airportName: "Istanbul Airport",
      airportCode: "IST",
    },
    destination: {
      country: "USA",
      city: "New York",
      airportName: "John F. Kennedy International Airport",
      airportCode: "JFK",
    },
    vehicleType: vehicleTypes.B787,
  },
];

// Mock Pilots
export const pilots: Pilot[] = [
  {
    id: "P001",
    name: "Captain James Wilson",
    age: 45,
    gender: "Male",
    nationality: "American",
    languages: ["English", "Spanish"],
    vehicleRestriction: "B787",
    allowedRange: 10000,
    seniority: "senior",
  },
  {
    id: "P002",
    name: "Captain Sarah Chen",
    age: 38,
    gender: "Female",
    nationality: "Canadian",
    languages: ["English", "Mandarin", "French"],
    vehicleRestriction: "A320",
    allowedRange: 3000,
    seniority: "senior",
  },
  {
    id: "P003",
    name: "First Officer Michael Brown",
    age: 32,
    gender: "Male",
    nationality: "British",
    languages: ["English", "German"],
    vehicleRestriction: "B737",
    allowedRange: 5000,
    seniority: "junior",
  },
  {
    id: "P004",
    name: "First Officer Emma Rodriguez",
    age: 29,
    gender: "Female",
    nationality: "Spanish",
    languages: ["Spanish", "English", "French"],
    vehicleRestriction: "A320",
    allowedRange: 3000,
    seniority: "junior",
  },
  {
    id: "P005",
    name: "Trainee Pilot Alex Kumar",
    age: 26,
    gender: "Male",
    nationality: "Indian",
    languages: ["English", "Hindi"],
    vehicleRestriction: "B737",
    allowedRange: 2000,
    seniority: "trainee",
  },
  {
    id: "P006",
    name: "Captain Maria Garcia",
    age: 42,
    gender: "Female",
    nationality: "Mexican",
    languages: ["Spanish", "English"],
    vehicleRestriction: "B787",
    allowedRange: 12000,
    seniority: "senior",
  },
];

// Mock Cabin Crew
export const cabinCrew: CabinCrew[] = [
  {
    id: "C001",
    name: "Isabella Thompson",
    age: 35,
    gender: "Female",
    nationality: "British",
    languages: ["English", "French", "Spanish"],
    type: "chief",
    vehicleRestrictions: ["A320", "B737", "B787"],
  },
  {
    id: "C002",
    name: "Lucas Martinez",
    age: 28,
    gender: "Male",
    nationality: "Spanish",
    languages: ["Spanish", "English", "Italian"],
    type: "regular",
    vehicleRestrictions: ["A320", "B737"],
  },
  {
    id: "C003",
    name: "Sophie Anderson",
    age: 26,
    gender: "Female",
    nationality: "Swedish",
    languages: ["Swedish", "English", "German"],
    type: "regular",
    vehicleRestrictions: ["A320", "B737", "B787"],
  },
  {
    id: "C004",
    name: "Chef Pierre Dubois",
    age: 40,
    gender: "Male",
    nationality: "French",
    languages: ["French", "English"],
    type: "chef",
    vehicleRestrictions: ["B787"],
    recipes: ["Coq au Vin", "Bouillabaisse", "Ratatouille", "Crème Brûlée"],
  },
  {
    id: "C005",
    name: "Olivia Johnson",
    age: 30,
    gender: "Female",
    nationality: "American",
    languages: ["English", "Spanish"],
    type: "regular",
    vehicleRestrictions: ["A320", "B737", "B787"],
  },
  {
    id: "C006",
    name: "Chen Wei",
    age: 27,
    gender: "Male",
    nationality: "Chinese",
    languages: ["Mandarin", "English"],
    type: "regular",
    vehicleRestrictions: ["A320", "B737"],
  },
  {
    id: "C007",
    name: "Amira Hassan",
    age: 29,
    gender: "Female",
    nationality: "Egyptian",
    languages: ["Arabic", "English", "French"],
    type: "chief",
    vehicleRestrictions: ["A320", "B737", "B787"],
  },
  {
    id: "C008",
    name: "Chef Giovanni Rossi",
    age: 38,
    gender: "Male",
    nationality: "Italian",
    languages: ["Italian", "English"],
    type: "chef",
    vehicleRestrictions: ["B787"],
    recipes: ["Osso Buco", "Risotto Milanese", "Tiramisu"],
  },
  {
    id: "C009",
    name: "Yuki Tanaka",
    age: 25,
    gender: "Female",
    nationality: "Japanese",
    languages: ["Japanese", "English"],
    type: "regular",
    vehicleRestrictions: ["A320", "B737", "B787"],
  },
  {
    id: "C010",
    name: "Daniel O'Connor",
    age: 31,
    gender: "Male",
    nationality: "Irish",
    languages: ["English", "Irish"],
    type: "regular",
    vehicleRestrictions: ["A320", "B737"],
  },
];

// Mock Passengers
export const passengers: Passenger[] = [
  // TK1234 Passengers
  {
    id: "PS001",
    flightId: "TK1234",
    name: "John Doe",
    age: 35,
    gender: "Male",
    nationality: "American",
    seatType: "business",
    seatNumber: "1A",
  },
  {
    id: "PS002",
    flightId: "TK1234",
    name: "Jane Smith",
    age: 28,
    gender: "Female",
    nationality: "British",
    seatType: "business",
    seatNumber: "1B",
  },
  {
    id: "PS003",
    flightId: "TK1234",
    name: "Carlos Rodriguez",
    age: 42,
    gender: "Male",
    nationality: "Spanish",
    seatType: "economy",
    seatNumber: "10A",
  },
  {
    id: "PS004",
    flightId: "TK1234",
    name: "Maria Garcia",
    age: 38,
    gender: "Female",
    nationality: "Mexican",
    seatType: "economy",
    seatNumber: "10B",
  },
  {
    id: "PS005",
    flightId: "TK1234",
    name: "Baby Garcia",
    age: 1,
    gender: "Female",
    nationality: "Mexican",
    seatType: "economy",
    parentId: "PS004",
  },
  {
    id: "PS006",
    flightId: "TK1234",
    name: "Michael Brown",
    age: 50,
    gender: "Male",
    nationality: "Canadian",
    seatType: "business",
    seatNumber: "2A",
  },
  {
    id: "PS007",
    flightId: "TK1234",
    name: "Emma Wilson",
    age: 31,
    gender: "Female",
    nationality: "Australian",
    seatType: "economy",
    seatNumber: "15C",
  },
  {
    id: "PS008",
    flightId: "TK1234",
    name: "David Lee",
    age: 45,
    gender: "Male",
    nationality: "Korean",
    seatType: "economy",
    affiliatedPassengers: ["PS009"],
  },
  {
    id: "PS009",
    flightId: "TK1234",
    name: "Sarah Lee",
    age: 43,
    gender: "Female",
    nationality: "Korean",
    seatType: "economy",
    affiliatedPassengers: ["PS008"],
  },
];

// Generate seat assignments for passengers without seats
export function assignSeats(
  passengers: Passenger[],
  vehicleType: VehicleType
): Passenger[] {
  const result = [...passengers];
  const businessSeats: string[] = [];
  const economySeats: string[] = [];

  // Generate available seats
  const businessLayout = vehicleType.seatingLayout.business;
  for (let row = 1; row <= businessLayout.rows; row++) {
    for (const col of businessLayout.cols) {
      businessSeats.push(`${row}${col}`);
    }
  }

  const economyLayout = vehicleType.seatingLayout.economy;
  const economyStartRow = businessLayout.rows + 1;
  for (let row = 0; row < economyLayout.rows; row++) {
    for (const col of economyLayout.cols) {
      economySeats.push(`${economyStartRow + row}${col}`);
    }
  }

  // Track used seats
  const usedSeats = new Set(
    result.filter((p) => p.seatNumber).map((p) => p.seatNumber!)
  );

  // Assign seats to passengers without seat numbers
  let businessIndex = 0;
  let economyIndex = 0;

  for (const passenger of result) {
    if (passenger.parentId || passenger.seatNumber) continue;

    if (passenger.seatType === "business") {
      while (
        businessIndex < businessSeats.length &&
        usedSeats.has(businessSeats[businessIndex])
      ) {
        businessIndex++;
      }
      if (businessIndex < businessSeats.length) {
        passenger.seatNumber = businessSeats[businessIndex];
        usedSeats.add(businessSeats[businessIndex]);
        businessIndex++;

        // Handle affiliated passengers
        if (passenger.affiliatedPassengers) {
          for (const affId of passenger.affiliatedPassengers) {
            const affPassenger = result.find((p) => p.id === affId);
            if (affPassenger && !affPassenger.seatNumber) {
              while (
                businessIndex < businessSeats.length &&
                usedSeats.has(businessSeats[businessIndex])
              ) {
                businessIndex++;
              }
              if (businessIndex < businessSeats.length) {
                affPassenger.seatNumber = businessSeats[businessIndex];
                usedSeats.add(businessSeats[businessIndex]);
                businessIndex++;
              }
            }
          }
        }
      }
    } else {
      while (
        economyIndex < economySeats.length &&
        usedSeats.has(economySeats[economyIndex])
      ) {
        economyIndex++;
      }
      if (economyIndex < economySeats.length) {
        passenger.seatNumber = economySeats[economyIndex];
        usedSeats.add(economySeats[economyIndex]);
        economyIndex++;

        // Handle affiliated passengers
        if (passenger.affiliatedPassengers) {
          for (const affId of passenger.affiliatedPassengers) {
            const affPassenger = result.find((p) => p.id === affId);
            if (affPassenger && !affPassenger.seatNumber) {
              while (
                economyIndex < economySeats.length &&
                usedSeats.has(economySeats[economyIndex])
              ) {
                economyIndex++;
              }
              if (economyIndex < economySeats.length) {
                affPassenger.seatNumber = economySeats[economyIndex];
                usedSeats.add(economySeats[economyIndex]);
                economyIndex++;
              }
            }
          }
        }
      }
    }
  }

  return result;
}
