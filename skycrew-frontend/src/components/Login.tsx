import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plane, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { loginUser } from "../services/api";

interface LoginProps {
  onLogin: (employeeId: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeId || !password) {
      toast.error("Login Failed", {
        description: "Please enter both Employee ID and Password",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call Django backend API
      const response = await loginUser(employeeId, password);

      toast.success("Login Successful", {
        description: `Welcome back, ${response.name || `Employee ${response.employeeId}`}`,
      });
      onLogin(response.employeeId);
    } catch (error) {
      toast.error("Login Failed", {
        description: error instanceof Error ? error.message : "Invalid credentials",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen from-white-0 via-white to-white-0 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
            <Plane className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-neutral-900 mb-2">Flight Roster Management System</h1>
          <p className="text-neutral-600">Sign in to access your roster dashboard</p>
        </div>

        {/* Login Card */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="employee-id">
                <User className="w-4 h-4 inline mr-2" />
                Employee ID
              </Label>
              <Input
                id="employee-id"
                type="text"
                placeholder="Enter your employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* API Connection Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>Django Backend:</strong> Make sure your Django backend is running and accessible. Update the API URL in <code>/config/api.ts</code> if needed.
            </p>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-neutral-600 mt-6">
          Secure access for authorized personnel only
        </p>
      </div>
    </div>
  );
}