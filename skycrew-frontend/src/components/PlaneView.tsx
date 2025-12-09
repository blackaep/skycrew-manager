import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import type { VehicleType, Pilot, CabinCrew, Passenger } from "../data/mockData";
import { User, Users, Plane } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
// import { cn } from "../lib/utils"; // If needed

interface PlaneViewProps {
    vehicleType: VehicleType;
    pilots: Pilot[];
    cabinCrew: CabinCrew[];
    passengers: Passenger[];
}

interface SeatInfo {
    seatNumber: string;
    person?: Passenger | Pilot | CabinCrew;
    type: "passenger" | "pilot" | "cabin" | "empty";
    position?: { x: number; y: number };
}

export function PlaneView({
    vehicleType,
    pilots,
    cabinCrew,
    passengers,
}: PlaneViewProps) {
    const [hoveredSeat, setHoveredSeat] = useState<SeatInfo | null>(null);

    // Create seat map
    const seatMap = new Map<string, SeatInfo>();

    // Add passenger seats
    passengers.forEach((passenger) => {
        if (passenger.seatNumber) {
            seatMap.set(passenger.seatNumber, {
                seatNumber: passenger.seatNumber,
                person: passenger,
                type: "passenger",
            });
        }
    });

    // Add pilot seats (front rows)
    pilots.forEach((pilot, index) => {
        const seatNumber = `P${index + 1}`;
        seatMap.set(seatNumber, {
            seatNumber,
            person: pilot,
            type: "pilot",
        });
    });

    // Add cabin crew seats (back rows)
    cabinCrew.forEach((crew, index) => {
        const seatNumber = `C${index + 1}`;
        seatMap.set(seatNumber, {
            seatNumber,
            person: crew,
            type: "cabin",
        });
    });

    const handleSeatHover = (
        seatInfo: SeatInfo | null,
        event?: React.MouseEvent
    ) => {
        if (seatInfo && event) {
            const rect = event.currentTarget.getBoundingClientRect();
            setHoveredSeat({
                ...seatInfo,
                position: {
                    x: rect.left + rect.width / 2,
                    y: rect.top
                },
            });
        } else {
            setHoveredSeat(null);
        }
    };

    const renderBusinessSeats = () => {
        const { rows, cols } = vehicleType.seatingLayout.business;
        const seats = [];

        for (let row = 1; row <= rows; row++) {
            const rowSeats = [];
            for (let i = 0; i < cols.length; i++) {
                const col = cols[i];
                const seatNumber = `${row}${col}`;
                const seatInfo = seatMap.get(seatNumber);

                rowSeats.push(
                    <div
                        key={seatNumber}
                        className={`relative w-11 h-12 rounded-lg cursor-pointer transition-all transform hover:scale-110 ${seatInfo
                            ? "bg-gradient-to-b from-orange-400 to-orange-600 shadow-md"
                            : "bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400"
                            }`}
                        onMouseEnter={(e) =>
                            handleSeatHover(
                                seatInfo || { seatNumber, type: "empty" },
                                e
                            )
                        }
                        onMouseLeave={() => handleSeatHover(null)}
                    >
                        <div className="absolute inset-0 flex items-center justify-center text-xs">
                            {seatInfo ? (
                                <User className="w-4 h-4 text-white" />
                            ) : (
                                <span className="text-gray-600 text-[10px]">{seatNumber}</span>
                            )}
                        </div>
                        {/* Seat headrest effect */}
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 rounded-t-lg ${seatInfo ? "bg-orange-700" : "bg-gray-400"
                            }`} />
                    </div>
                );

                // Add aisle after B
                if (col === "B") {
                    rowSeats.push(
                        <div key={`aisle-${row}`} className="w-8" />
                    );
                }
            }

            seats.push(
                <div key={row} className="flex items-center gap-2 mb-3">
                    <span className="w-8 text-xs text-neutral-500 text-right">{row}</span>
                    {rowSeats}
                </div>
            );
        }

        return seats;
    };

    const renderEconomySeats = () => {
        const { rows, cols } = vehicleType.seatingLayout.economy;
        const businessRows = vehicleType.seatingLayout.business.rows;
        const seats = [];

        for (let row = 0; row < rows; row++) {
            const actualRow = businessRows + 1 + row;
            const rowSeats = [];

            for (let i = 0; i < cols.length; i++) {
                const col = cols[i];
                const seatNumber = `${actualRow}${col}`;
                const seatInfo = seatMap.get(seatNumber);

                rowSeats.push(
                    <div
                        key={seatNumber}
                        className={`relative w-10 h-11 rounded-lg cursor-pointer transition-all transform hover:scale-110 ${seatInfo
                            ? "bg-gradient-to-b from-purple-400 to-purple-600 shadow-md"
                            : "bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400"
                            }`}
                        onMouseEnter={(e) =>
                            handleSeatHover(
                                seatInfo || { seatNumber, type: "empty" },
                                e
                            )
                        }
                        onMouseLeave={() => handleSeatHover(null)}
                    >
                        <div className="absolute inset-0 flex items-center justify-center text-xs">
                            {seatInfo ? (
                                <User className="w-3 h-3 text-white" />
                            ) : (
                                <span className="text-gray-600 text-[9px]">{seatNumber}</span>
                            )}
                        </div>
                        {/* Seat headrest effect */}
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-7 h-2 rounded-t-lg ${seatInfo ? "bg-purple-700" : "bg-gray-400"
                            }`} />
                    </div>
                );

                // Add aisle after C for 6-seat config, or D for 8-seat config
                if ((cols.length === 6 && col === "C") || (cols.length === 8 && col === "D")) {
                    rowSeats.push(
                        <div key={`aisle-${actualRow}`} className="w-6" />
                    );
                }
            }

            seats.push(
                <div key={actualRow} className="flex items-center gap-2 mb-2.5">
                    <span className="w-8 text-xs text-neutral-500 text-right">{actualRow}</span>
                    {rowSeats}
                </div>
            );
        }

        return seats;
    };

    const renderCrewSeats = () => {
        return (
            <div className="flex justify-center gap-8 mb-6">
                {/* Pilots */}
                <div>
                    <div className="text-xs text-neutral-500 mb-3 text-center">Cockpit Crew</div>
                    <div className="flex gap-3">
                        {pilots.map((_, index) => {
                            const seatNumber = `P${index + 1}`;
                            const seatInfo = seatMap.get(seatNumber);
                            return (
                                <div
                                    key={seatNumber}
                                    className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 cursor-pointer hover:scale-110 transition-transform shadow-lg border-4 border-blue-800"
                                    onMouseEnter={(e) =>
                                        handleSeatHover(seatInfo || { seatNumber, type: "pilot" }, e)
                                    }
                                    onMouseLeave={() => handleSeatHover(null)}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Plane className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Cabin Crew */}
                <div>
                    <div className="text-xs text-neutral-500 mb-3 text-center">Cabin Crew</div>
                    <div className="flex gap-3 flex-wrap justify-center max-w-xs">
                        {cabinCrew.map((_, index) => {
                            const seatNumber = `C${index + 1}`;
                            const seatInfo = seatMap.get(seatNumber);
                            return (
                                <div
                                    key={seatNumber}
                                    className="relative w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-700 cursor-pointer hover:scale-110 transition-transform shadow-lg border-4 border-green-800"
                                    onMouseEnter={(e) =>
                                        handleSeatHover(seatInfo || { seatNumber, type: "cabin" }, e)
                                    }
                                    onMouseLeave={() => handleSeatHover(null)}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderPersonInfo = (seatInfo: SeatInfo) => {
        if (seatInfo.type === "empty") {
            return (
                <div className="text-center">
                    <div className="mb-1">Seat {seatInfo.seatNumber}</div>
                    <div className="text-sm text-neutral-400">Available</div>
                </div>
            );
        }

        const person = seatInfo.person!;

        if (seatInfo.type === "pilot") {
            const pilot = person as Pilot;
            return (
                <div className="min-w-[280px]">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge className="bg-blue-500">Flight Crew</Badge>
                        <Badge variant="outline" className="capitalize bg-white">
                            {pilot.seniority}
                        </Badge>
                    </div>
                    <div className="space-y-1">
                        <div>{pilot.name}</div>
                        <div className="text-sm text-neutral-400">ID: {pilot.id}</div>
                        <div className="text-sm text-neutral-400">
                            {pilot.age} years • {pilot.gender}
                        </div>
                        <div className="text-sm text-neutral-400">{pilot.nationality}</div>
                        <div className="text-sm text-neutral-400">
                            {pilot.languages.join(", ")}
                        </div>
                        <div className="text-sm text-neutral-400">
                            Aircraft: {pilot.vehicleRestriction}
                        </div>
                    </div>
                </div>
            );
        }

        if (seatInfo.type === "cabin") {
            const crew = person as CabinCrew;
            return (
                <div className="min-w-[280px]">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge className="bg-green-500">Cabin Crew</Badge>
                        <Badge variant="outline" className="capitalize bg-white">
                            {crew.type}
                        </Badge>
                    </div>
                    <div className="space-y-1">
                        <div>{crew.name}</div>
                        <div className="text-sm text-neutral-400">ID: {crew.id}</div>
                        <div className="text-sm text-neutral-400">
                            {crew.age} years • {crew.gender}
                        </div>
                        <div className="text-sm text-neutral-400">{crew.nationality}</div>
                        <div className="text-sm text-neutral-400">
                            {crew.languages.join(", ")}
                        </div>
                        {crew.recipes && (
                            <div className="text-sm text-neutral-400">
                                Recipes: {crew.recipes.slice(0, 2).join(", ")}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        const passenger = person as Passenger;
        return (
            <div className="min-w-[280px]">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge className="bg-purple-500">Passenger</Badge>
                    <Badge variant="outline" className="capitalize bg-white">
                        {passenger.seatType}
                    </Badge>
                </div>
                <div className="space-y-1">
                    <div>{passenger.name}</div>
                    <div className="text-sm text-neutral-400">ID: {passenger.id}</div>
                    <div className="text-sm text-neutral-400">
                        Seat: {passenger.seatNumber || "Unassigned"}
                    </div>
                    <div className="text-sm text-neutral-400">
                        {passenger.age} years • {passenger.gender}
                    </div>
                    <div className="text-sm text-neutral-400">{passenger.nationality}</div>
                    {passenger.parentId && (
                        <div className="text-sm text-neutral-400">Infant (with parent)</div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Card className="p-6 overflow-visible">
            <div className="mb-6">
                <h3 className="mb-1">Flight Roster - Plane View</h3>
                <p className="text-sm text-neutral-600">
                    {vehicleType.name} • Hover over seats to view passenger details
                </p>
            </div>

            <div className="relative flex justify-center">
                {/* Plane Shape Container */}
                <div className="relative inline-block">
                    {/* Plane Nose/Cockpit - Closed oval shape */}
                    <div className="relative mx-auto">
                        <div className="mx-auto bg-gradient-to-b from-gray-400 via-gray-300 to-gray-200 border-4 border-b-0 border-gray-500 relative overflow-hidden" style={{ width: "550px", height: "260px", borderRadius: "348px 348px 0 0" }}>
                            {/* Cockpit windows */}
                            <div className="absolute top-32 left-1/2 -translate-x-1/2 flex gap-2">

                            </div>
                            {/* Nose tip highlight */}
                        </div>
                    </div>

                    {/* Main Fuselage */}
                    <div className="relative bg-gradient-to-b from-gray-200 via-gray-100 to-gray-200 border-x-4 border-gray-500 px-12 py-8 shadow-2xl">
                        {/* Wings */}
                        <div className="absolute left-0 top-1/3 -translate-x-full w-40 h-2 bg-gradient-to-l from-gray-400 to-gray-300 rounded-l-full border-2 border-gray-500 shadow-lg" style={{ transformOrigin: "right" }} />
                        <div className="absolute right-0 top-1/3 translate-x-full w-40 h-2 bg-gradient-to-r from-gray-400 to-gray-300 rounded-r-full border-2 border-gray-500 shadow-lg" style={{ transformOrigin: "left" }} />

                        {/* Crew Section */}
                        <div className="mb-8 pb-6 border-b-2 border-dashed border-gray-400">
                            {renderCrewSeats()}
                        </div>

                        {/* Business Class */}
                        <div className="mb-8">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Badge className="bg-orange-500">Business Class</Badge>
                                <span className="text-xs text-neutral-600">
                                    Rows 1-{vehicleType.seatingLayout.business.rows}
                                </span>
                            </div>
                            <div className="flex flex-col items-center">
                                {renderBusinessSeats()}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="my-8 border-t-4 border-dashed border-gray-400 relative">
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-100 px-3 py-1 text-xs text-neutral-500">
                                Galley
                            </div>
                        </div>

                        {/* Economy Class */}
                        <div>
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Badge className="bg-purple-500">Economy Class</Badge>
                                <span className="text-xs text-neutral-600">
                                    Rows {vehicleType.seatingLayout.business.rows + 1}-
                                    {vehicleType.seatingLayout.business.rows +
                                        vehicleType.seatingLayout.economy.rows}
                                </span>
                            </div>
                            <div className="flex flex-col items-center">
                                {renderEconomySeats()}
                            </div>
                        </div>
                    </div>

                    {/* Tail - Closed oval shape */}
                    <div className="relative mx-auto">
                        <div className="relative mx-auto bg-gradient-to-b from-gray-200 via-gray-400 to-gray-600 border-4 border-t-0 border-gray-500 overflow-hidden" style={{ width: "550px", height: "260px", borderRadius: "0 0 348px 348px" }}>
                            {/* Tail shadow/detail */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-black opacity-10 rounded-full blur-lg" />

                            {/* Vertical stabilizer (fin) */}
                            <div className="absolute left-1/2 -translate-x-1/2 -top-12 w-24 h-48 bg-gradient-to-t from-gray-500 via-gray-400 to-gray-500 rounded-t-lg border-2 border-gray-600 shadow-xl z-10">
                                {/* Rudder detail */}
                                <div className="absolute right-1 top-4 bottom-4 w-1.5 bg-gray-600 opacity-50" />
                            </div>

                            {/* Horizontal stabilizers */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-20 flex items-center z-10">
                                <div className="w-32 h-2.5 bg-gradient-to-l from-gray-500 to-gray-400 rounded-l-full border border-gray-600 shadow-md" />
                                <div className="w-32 h-2.5 bg-gradient-to-r from-gray-500 to-gray-400 rounded-r-full border border-gray-600 shadow-md" />
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-8 pt-6 border-t-2 border-gray-300">
                        <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 border-2 border-blue-800" />
                                <span>Flight Crew</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-700 border-2 border-green-800" />
                                <span>Cabin Crew</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-purple-400 to-purple-600" />
                                <span>Passenger</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400" />
                                <span>Empty</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Animated Tooltip */}
                <AnimatePresence>
                    {hoveredSeat && hoveredSeat.position && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.15 }}
                            className="fixed z-50 pointer-events-none bg-white rounded-lg shadow-2xl border-2 border-gray-300 p-4"
                            style={{
                                left: hoveredSeat.position.x,
                                top: hoveredSeat.position.y - 10,
                                transform: "translate(-50%, -100%)",
                            }}
                        >
                            {renderPersonInfo(hoveredSeat)}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Card>
    );
}