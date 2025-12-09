import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Save, Download, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { saveRoster, exportRoster } from "../services/api";
import type { Pilot, CabinCrew, Passenger } from "../data/mockData";

interface RosterActionsProps {
  flightNumber: string;
  pilots: Pilot[];
  cabinCrew: CabinCrew[];
  passengers: Passenger[];
  onRegenerateRoster: () => void;
  onAssignmentSettingsChange: (crew: boolean, seats: boolean) => void;
  autoAssignCrew: boolean;
  autoAssignSeats: boolean;
}

export function RosterActions({
  flightNumber,
  pilots,
  cabinCrew,
  passengers,
  onRegenerateRoster,
  onAssignmentSettingsChange,
  autoAssignCrew,
  autoAssignSeats,
}: RosterActionsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleSaveRoster = async () => {
    setIsSaving(true);
    try {
      const result = await saveRoster({
        flightNumber,
        pilots,
        cabinCrew,
        passengers,
      });

      toast.success(
        `Roster saved to MySQL database for flight ${flightNumber}`,
        {
          description: result.message || "Roster information has been successfully stored.",
        }
      );
    } catch (error) {
      toast.error("Failed to save roster", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      const blob = await exportRoster(flightNumber);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${flightNumber}_roster.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Roster exported as JSON", {
        description: `${flightNumber}_roster.json downloaded`,
      });
    } catch (error) {
      toast.error("Failed to export roster", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCrewChange = (checked: boolean) => {
    onAssignmentSettingsChange(checked, autoAssignSeats);
  };

  const handleSeatsChange = (checked: boolean) => {
    onAssignmentSettingsChange(autoAssignCrew, checked);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="mb-1">Roster Management</h3>
          <p className="text-sm text-neutral-600">
            Configure and save roster settings
          </p>
        </div>

        {/* Auto Assignment Settings */}
        <div className="space-y-4 p-4 bg-neutral-50 rounded-lg">
          <h4 className="text-sm">Assignment Settings</h4>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-crew">Auto-assign Crew</Label>
              <p className="text-sm text-neutral-600">
                Automatically select qualified crew members
              </p>
            </div>
            <Switch
              id="auto-crew"
              checked={autoAssignCrew}
              onCheckedChange={handleCrewChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-seats">Auto-assign Seats</Label>
              <p className="text-sm text-neutral-600">
                Automatically assign seats to passengers without seat numbers
              </p>
            </div>
            <Switch
              id="auto-seats"
              checked={autoAssignSeats}
              onCheckedChange={handleSeatsChange}
            />
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={onRegenerateRoster}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate Roster
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Button
            className="w-full"
            onClick={handleSaveRoster}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Roster"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleExportJSON}
            disabled={isExporting}
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? "Exporting..." : "Export JSON"}
          </Button>
        </div>

        {/* Info */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Rosters can be retrieved later using the flight
            number. All crew assignments follow the constraints defined in the
            crew information APIs.
          </p>
        </div>
      </div>
    </Card>
  );
}