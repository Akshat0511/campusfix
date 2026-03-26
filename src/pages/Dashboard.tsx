import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import StudentDashboard from "./StudentDashboard";
import StaffDashboard from "./StaffDashboard";
import Admin from "./Admin";

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "student":
      return <StudentDashboard />;
    case "staff":
      return <StaffDashboard />;
    case "admin":
      return <Admin />;
    default:
      return <Navigate to="/login" replace />;
  }
}
