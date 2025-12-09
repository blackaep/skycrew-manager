import { ArrowLeft } from 'lucide-react';
import { Button } from "../components/ui/button";

// This page is currently superseded by the main App logic which handles the workspace view directly.
// Keeping this file as a placeholder to avoid breaking router imports if any.

export function WorkspacePage() {
    return (
        <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Workspace View</h1>
            <p className="mb-4">Please return to the main dashboard.</p>
            <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Button>
        </div>
    );
}
