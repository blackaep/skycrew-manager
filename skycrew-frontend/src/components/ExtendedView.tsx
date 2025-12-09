import { Card } from "./ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import type { Pilot, CabinCrew, Passenger } from "../data/mockData";
import { Plane, Users, UserRound } from "lucide-react";

interface ExtendedViewProps {
    pilots: Pilot[];
    cabinCrew: CabinCrew[];
    passengers: Passenger[];
}

export function ExtendedView({
    pilots,
    cabinCrew,
    passengers,
}: ExtendedViewProps) {
    return (
        <div className="space-y-6">
            {/* Flight Crew Table */}
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Plane className="w-5 h-5 text-blue-600" />
                    <div>
                        <h3 className="mb-0">Flight Crew</h3>
                        <p className="text-sm text-neutral-600">
                            {pilots.length} crew members
                        </p>
                    </div>
                </div>

                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Nationality</TableHead>
                                <TableHead>Languages</TableHead>
                                <TableHead>Seniority</TableHead>
                                <TableHead>Vehicle</TableHead>
                                <TableHead>Max Range (km)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pilots.map((pilot) => (
                                <TableRow key={pilot.id}>
                                    <TableCell>{pilot.id}</TableCell>
                                    <TableCell>{pilot.name}</TableCell>
                                    <TableCell>{pilot.age}</TableCell>
                                    <TableCell>{pilot.gender}</TableCell>
                                    <TableCell>{pilot.nationality}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {pilot.languages.map((lang) => (
                                                <Badge key={lang} variant="outline" className="text-xs">
                                                    {lang}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`capitalize ${pilot.seniority === "senior"
                                                    ? "bg-blue-100 text-blue-700 border-blue-200"
                                                    : pilot.seniority === "junior"
                                                        ? "bg-green-100 text-green-700 border-green-200"
                                                        : "bg-yellow-100 text-yellow-700 border-yellow-200"
                                                }`}
                                        >
                                            {pilot.seniority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{pilot.vehicleRestriction}</TableCell>
                                    <TableCell>{pilot.allowedRange.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Cabin Crew Table */}
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Users className="w-5 h-5 text-green-600" />
                    <div>
                        <h3 className="mb-0">Cabin Crew</h3>
                        <p className="text-sm text-neutral-600">
                            {cabinCrew.length} crew members
                        </p>
                    </div>
                </div>

                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Nationality</TableHead>
                                <TableHead>Languages</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Vehicles</TableHead>
                                <TableHead>Special</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cabinCrew.map((crew) => (
                                <TableRow key={crew.id}>
                                    <TableCell>{crew.id}</TableCell>
                                    <TableCell>{crew.name}</TableCell>
                                    <TableCell>{crew.age}</TableCell>
                                    <TableCell>{crew.gender}</TableCell>
                                    <TableCell>{crew.nationality}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {crew.languages.map((lang) => (
                                                <Badge key={lang} variant="outline" className="text-xs">
                                                    {lang}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`capitalize ${crew.type === "chief"
                                                    ? "bg-purple-100 text-purple-700 border-purple-200"
                                                    : crew.type === "chef"
                                                        ? "bg-orange-100 text-orange-700 border-orange-200"
                                                        : "bg-green-100 text-green-700 border-green-200"
                                                }`}
                                        >
                                            {crew.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {crew.vehicleRestrictions.map((vehicle) => (
                                                <Badge
                                                    key={vehicle}
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {vehicle}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {crew.recipes && (
                                            <div className="text-xs text-neutral-600">
                                                {crew.recipes.length} recipes
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Passengers Table */}
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <UserRound className="w-5 h-5 text-purple-600" />
                    <div>
                        <h3 className="mb-0">Passengers</h3>
                        <p className="text-sm text-neutral-600">
                            {passengers.length} passengers
                        </p>
                    </div>
                </div>

                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Nationality</TableHead>
                                <TableHead>Seat Type</TableHead>
                                <TableHead>Seat Number</TableHead>
                                <TableHead>Special Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {passengers.map((passenger) => (
                                <TableRow key={passenger.id}>
                                    <TableCell>{passenger.id}</TableCell>
                                    <TableCell>{passenger.name}</TableCell>
                                    <TableCell>{passenger.age}</TableCell>
                                    <TableCell>{passenger.gender}</TableCell>
                                    <TableCell>{passenger.nationality}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`capitalize ${passenger.seatType === "business"
                                                    ? "bg-blue-100 text-blue-700 border-blue-200"
                                                    : "bg-purple-100 text-purple-700 border-purple-200"
                                                }`}
                                        >
                                            {passenger.seatType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {passenger.seatNumber || (
                                            <span className="text-neutral-600">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {passenger.parentId && (
                                            <Badge variant="outline" className="text-xs">
                                                Infant
                                            </Badge>
                                        )}
                                        {passenger.affiliatedPassengers &&
                                            passenger.affiliatedPassengers.length > 0 && (
                                                <Badge variant="outline" className="text-xs">
                                                    Group ({passenger.affiliatedPassengers.length + 1})
                                                </Badge>
                                            )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}
