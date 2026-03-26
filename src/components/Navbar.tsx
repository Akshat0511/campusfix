import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle, BarChart3, FileText, Home, LogOut, Menu, Plus, X, Wrench, GraduationCap, Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useAuth, UserRole } from "@/lib/auth";

const ROLE_NAV: Record<UserRole, { to: string; label: string; icon: typeof Home }[]> = {
  student: [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/report", label: "Report Issue", icon: Plus },
    { to: "/track", label: "My Tickets", icon: FileText },
  ],
  staff: [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/track", label: "All Tickets", icon: FileText },
  ],
  admin: [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/report", label: "Report Issue", icon: Plus },
    { to: "/track", label: "All Tickets", icon: FileText },
  ],
};

const ROLE_ICONS: Record<UserRole, typeof GraduationCap> = {
  student: GraduationCap,
  staff: Wrench,
  admin: Shield,
};

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);

  // Public navbar for non-authenticated users
  if (!isAuthenticated) {
    return (
      <nav className="sticky top-0 z-50 border-b bg-card/90 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <AlertTriangle className="h-6 w-6 text-accent" />
            <span>CampusFix</span>
          </Link>
          <Button asChild variant="outline" size="sm" className="rounded-lg">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </nav>
    );
  }

  const navItems = ROLE_NAV[user!.role];
  const RoleIcon = ROLE_ICONS[user!.role];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/90 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <AlertTriangle className="h-6 w-6 text-accent" />
          <span>CampusFix</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          <div className="ml-3 pl-3 border-l flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <RoleIcon className="h-4 w-4 text-accent" />
              <span className="font-medium">{user!.name}</span>
              <span className="text-xs text-muted-foreground capitalize">({user!.role})</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-card pb-4 animate-fade-in">
          <div className="px-6 py-3 border-b flex items-center gap-2 text-sm">
            <RoleIcon className="h-4 w-4 text-accent" />
            <span className="font-medium">{user!.name}</span>
            <span className="text-xs text-muted-foreground capitalize">({user!.role})</span>
          </div>
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary border-l-2 border-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 w-full"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
