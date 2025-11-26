import requests
import random

# Helper to talk to your local APIs
BASE_URL = "http://127.0.0.1:8000/api"

def fetch_api_data(endpoint):
    try:
        response = requests.get(f"{BASE_URL}/{endpoint}/")
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        print(f"Error fetching {endpoint}: {e}")
    return []

class RosterGenerator:
    def __init__(self, flight_id):
        self.flight_id = flight_id
        self.roster = {
            "flight_id": flight_id,
            "pilots": [],
            "cabin_crew": [],
            "passengers": [],
            "menu": []
        }
        # We will build a map of taken seats here (e.g., {'12A': 'Bob'})
        self.seat_map = {} 

    def generate(self):
        # 1. Find the Flight
        flights = fetch_api_data("flight-info/flights")
        flight_info = next((f for f in flights if f['flight_number'] == self.flight_id), None)
        
        if not flight_info:
            return {"error": "Flight not found"}

        # 2. Run the Algorithms
        self.assign_pilots(flight_info)
        self.assign_cabin_crew(flight_info)
        self.assign_passengers(flight_info)
        
        return self.roster

    def assign_pilots(self, flight_info):
        # Greedy Algorithm: Pick 1 Senior, 1 Junior who match the plane
        all_pilots = fetch_api_data("pilots/pilots")
        plane_name = flight_info['plane_type'] # e.g. "Boeing 737"
        dist = flight_info['distance']
        
        candidates = [p for p in all_pilots if str(p['allowed_vehicle']) == str(plane_name) and p['allowed_range'] >= dist]
        
        seniors = [p for p in candidates if p['seniority'] == 'SENIOR']
        juniors = [p for p in candidates if p['seniority'] == 'JUNIOR']

        # We need at least 1 Senior and 1 Junior
        if seniors and juniors:
            self.roster['pilots'].append(seniors[0])
            self.roster['pilots'].append(juniors[0])

    def assign_cabin_crew(self, flight_info):
        # Logic: 1 Chief, Regulars, 1 Chef
        all_crew = fetch_api_data("cabin-crew/attendants")
        plane_name = flight_info['plane_type']

        # Filter by vehicle type
        # Note: allowed_vehicles is a list, so we check if plane_name is IN that list
        candidates = [c for c in all_crew if str(plane_name) in str(c['allowed_vehicles'])]

        chiefs = [c for c in candidates if c['attendant_type'] == 'CHIEF']
        regulars = [c for c in candidates if c['attendant_type'] == 'REGULAR']
        chefs = [c for c in candidates if c['attendant_type'] == 'CHEF']

        # Add 1 Chief
        if chiefs:
            self.roster['cabin_crew'].append(chiefs[0])
        
        # Add Regulars (Let's say 4 for MVP)
        self.roster['cabin_crew'].extend(regulars[:4])

        # Add 1 Chef and their random recipe
        if chefs:
            chef = chefs[0]
            self.roster['cabin_crew'].append(chef)
            # Add a random recipe from this chef to the menu
            if chef.get('recipes'):
                self.roster['menu'].append(random.choice(chef['recipes']))

    def assign_passengers(self, flight_info):
        # ... (keep the first part where you get passengers and helper vars) ...
        # (This part stays the same)
        all_passengers = fetch_api_data("passengers/passengers")
        flight_db_id = flight_info['id'] 
        my_passengers = [p for p in all_passengers if p['flight'] == flight_db_id]

        rows = 20
        cols = "ABCDEF"
        all_seats = [f"{r+1}{c}" for r in range(rows) for c in cols]
        
        assigned_seats = []
        for p in my_passengers:
            if p.get('seat_number'):
                assigned_seats.append(p['seat_number'])
                self.seat_map[p['seat_number']] = p['name']
        
        available_seats = [s for s in all_seats if s not in assigned_seats]

        # --- THE FIX STARTS HERE ---
        for p in my_passengers:
            if not p.get('seat_number'):
                # STRICTER CHECK: Must have a parent AND be a baby (age <= 2)
                if p.get('parent') and p.get('age', 99) <= 2:
                    p['seat_number'] = "LAP"
                else:
                    # It's an adult (or older child) who needs a seat
                    if available_seats:
                        new_seat = available_seats.pop(0)
                        p['seat_number'] = new_seat
                        self.seat_map[new_seat] = p['name']
            
            self.roster['passengers'].append(p)