import axios from 'axios';
import type { Flight, RosterResponse, User } from './types';

// Detect if we are in dev mode to use mock data
// const USE_MOCK = false;

export const API_BASE_URL = 'http://127.0.0.1:8000/api';

const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add token
client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Or Token ${token} depending on backend
    }
    return config;
});

export const api = {
    auth: {
        login: async (employeeId: string, _password: string): Promise<User> => {
            // Mock implementation because backend auth is missing
            await new Promise(resolve => setTimeout(resolve, 500));
            const mockUser: User = {
                employee_id: employeeId,
                name: "Demo User",
                role: "Captain",
                token: "mock-jwt-token"
            };
            localStorage.setItem('token', mockUser.token!);
            return mockUser;
        },
        logout: () => {
            localStorage.removeItem('token');
        }
    },
    flights: {
        list: async (): Promise<Flight[]> => {
            const res = await client.get('/flights/');
            // Assume backend returns list of flights
            // We might need to enrich with airports/planes if backend returns IDs
            return res.data;
        },
        get: async (id: string): Promise<Flight> => {
            const res = await client.get(`/flights/${id}/`);
            return res.data;
        }
    },
    roster: {
        generate: async (flightNumber: string, options: { autoAssignCrew: boolean, autoAssignSeats: boolean }): Promise<RosterResponse> => {
            // This calls the complex Roster generation backend
            const res = await client.post('/roster/generate/', {
                flight_number: flightNumber,
                auto_assign_crew: options.autoAssignCrew,
                auto_assign_seats: options.autoAssignSeats
            });
            return res.data;
        },
        save: async (flightNumber: string, data: RosterResponse) => {
            // Implement save logic if backend supports it
            return client.post('/roster/save/', { flight_number: flightNumber, ...data });
        }
    },
    resources: {
        airports: async () => (await client.get('/airports/')).data,
        planes: async () => (await client.get('/planes/')).data,
    }
};
