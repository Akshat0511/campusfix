import { Link, useLocation } from "react-router-dom";
import { AlertTriangle, BarChart3, FileText, Home, Menu, Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/report", label: "Report Issue", icon: Plus },
  { to: "/track", label: "Track Tickets", icon: FileText },
  { to: "/admin", label: "Admin Dashboard", icon: BarChart3 },
];

export function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/90 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <AlertTriangle className="h-6 w-6 text-accent" />
          <span>CampusFix</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
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
        </div>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-card pb-4 animate-fade-in">
          {NAV_ITEMS.map((item) => {
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
        </div>
      )}
    </nav>
  );
}
