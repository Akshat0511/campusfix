import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { ArrowRight, FileText, Plus, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { getComplaints } from "@/lib/store";
import { StatusBadge } from "@/components/StatusBadge";

export default function StudentDashboard() {
  const { user } = useAuth();
  const complaints = useMemo(() => getComplaints(), []);
  const myTickets = complaints.filter(
    (c) => c.reporterEmail.toLowerCase() === user?.email.toLowerCase()
  );
  const pending = myTickets.filter((c) => c.status === "pending").length;
  const inProgress = myTickets.filter((c) => c.status === "in-progress").length;
  const resolved = myTickets.filter((c) => c.status === "resolved").length;

  return (
    <div className="container py-10 md:py-16">
      <div className="mb-8 animate-fade-in">
        <p className="text-sm text-accent font-semibold">Welcome back,</p>
        <h1 className="text-3xl font-bold">{user?.name}</h1>
        <p className="text-muted-foreground mt-1">Student Portal — Report issues and track your tickets</p>
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <Link
          to="/report"
          className="glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow group animate-fade-in"
        >
          <div className="h-12 w-12 rounded-xl gradient-accent flex items-center justify-center mb-4">
            <Plus className="h-6 w-6 text-accent-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-1">Report New Issue</h3>
          <p className="text-sm text-muted-foreground">Submit a complaint in under 60 seconds</p>
          <ArrowRight className="mt-3 h-5 w-5 text-accent group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          to="/track"
          className="glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow group animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-info" />
          </div>
          <h3 className="font-semibold text-lg mb-1">Track My Tickets</h3>
          <p className="text-sm text-muted-foreground">View status of all your reported issues</p>
          <ArrowRight className="mt-3 h-5 w-5 text-info group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="glass-card rounded-xl p-4 text-center animate-fade-in">
          <Clock className="h-5 w-5 mx-auto text-warning mb-1" />
          <p className="text-2xl font-bold">{pending}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center animate-fade-in" style={{ animationDelay: "50ms" }}>
          <AlertTriangle className="h-5 w-5 mx-auto text-info mb-1" />
          <p className="text-2xl font-bold">{inProgress}</p>
          <p className="text-xs text-muted-foreground">In Progress</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CheckCircle2 className="h-5 w-5 mx-auto text-success mb-1" />
          <p className="text-2xl font-bold">{resolved}</p>
          <p className="text-xs text-muted-foreground">Resolved</p>
        </div>
      </div>

      {/* Recent tickets */}
      <h3 className="text-xl font-bold mb-4">My Recent Tickets</h3>
      {myTickets.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center">
          <FileText className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No tickets yet. Report your first issue!</p>
          <Button asChild className="mt-4 gradient-accent text-accent-foreground rounded-xl">
            <Link to="/report">Report Issue</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {myTickets.slice(0, 5).map((c) => (
            <div key={c.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-accent">{c.id}</span>
                  <StatusBadge status={c.status} />
                </div>
                <p className="font-medium truncate">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
