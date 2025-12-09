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

interface TabularViewProps {
    pilots: Pilot[];
    cabinCrew: CabinCrew[];
    passengers: Passenger[];
}

export function TabularView({ pilots, cabinCrew, passengers }: TabularViewProps) {
    const allPersons = [
        ...pilots.map((p) => ({
            type: "Flight Crew",
            id: p.id,
            name: p.name,
            role: p.seniority,
        })),
        ...cabinCrew.map((c) => ({
            type: "Cabin Crew",
            id: c.id,
            name: c.name,
            role: c.type,
        })),
        ...passengers.map((p) => ({
            type: "Passenger",
            id: p.id,
            name: p.name,
            role: p.seatNumber ? `Seat ${p.seatNumber}` : p.parentId ? "Infant" : "Unassigned",
        })),
    ];

    const getTypeBadgeColor = (type: string) => {
        switch (type) {
            case "Flight Crew":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "Cabin Crew":
                return "bg-green-100 text-green-700 border-green-200";
            case "Passenger":
                return "bg-purple-100 text-purple-700 border-purple-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <Card className="p-6">
            <div className="mb-4">
                <h3 className="mb-1">Flight Roster - Tabular View</h3>
                <p className="text-sm text-neutral-600">
                    Complete list of all personnel and passengers ({allPersons.length} total)
                </p>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Role / Seat</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allPersons.map((person, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Badge variant="outline" className={getTypeBadgeColor(person.type)}>
                                        {person.type}
                                    </Badge>
                                </TableCell>
                                <TableCell>{person.id}</TableCell>
                                <TableCell>{person.name}</TableCell>
                                <TableCell className="capitalize">{person.role}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
