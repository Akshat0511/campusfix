import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getComplaints, updateComplaintStatus } from "@/lib/store";
import { CATEGORY_LABELS, CATEGORY_DEPARTMENTS, ComplaintStatus, STATUS_LABELS } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { StatCard } from "@/components/StatCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle2, ClipboardCheck, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function StaffDashboard() {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const complaints = useMemo(() => getComplaints(), [refreshKey]);

  const pending = complaints.filter((c) => c.status === "pending");
  const inProgress = complaints.filter((c) => c.status === "in-progress");

  const handleStatusChange = (id: string, newStatus: ComplaintStatus, category: string) => {
    const dept = CATEGORY_DEPARTMENTS[category as keyof typeof CATEGORY_DEPARTMENTS];
    updateComplaintStatus(id, newStatus, dept);
    setRefreshKey((k) => k + 1);
    toast.success(`Ticket ${id} updated to ${STATUS_LABELS[newStatus]}`);
  };

  return (
    <div className="container py-10 md:py-16">
      <div className="mb-8 animate-fade-in">
        <p className="text-sm text-accent font-semibold">Staff Portal</p>
        <h1 className="text-3xl font-bold">{user?.name}</h1>
        <p className="text-muted-foreground mt-1">Validate complaints and update ticket statuses</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard label="Pending Review" value={pending.length} icon={Clock} color="text-warning" />
        <StatCard label="In Progress" value={inProgress.length} icon={Loader2} color="text-info" />
        <StatCard label="Total Tickets" value={complaints.length} icon={ClipboardCheck} color="text-foreground" />
      </div>

      {/* Pending tickets needing validation */}
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-warning" />
        Needs Validation ({pending.length})
      </h3>
      <div className="space-y-3 mb-10">
        {pending.length === 0 && (
          <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-success" />
            All caught up! No pending tickets.
          </div>
        )}
        {pending.map((c) => (
          <div key={c.id} className="glass-card rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-accent">{c.id}</span>
                <StatusBadge status={c.status} />
              </div>
              <h4 className="font-medium truncate">{c.title}</h4>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {CATEGORY_LABELS[c.category]} · {c.location} · by {c.reporterName}
              </p>
            </div>
            <Select onValueChange={(val) => handleStatusChange(c.id, val as ComplaintStatus, c.category)}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-progress">Mark In Progress</SelectItem>
                <SelectItem value="resolved">Mark Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {/* In progress */}
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Loader2 className="h-5 w-5 text-info" />
        In Progress ({inProgress.length})
      </h3>
      <div className="space-y-3">
        {inProgress.map((c) => (
          <div key={c.id} className="glass-card rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-accent">{c.id}</span>
                <StatusBadge status={c.status} />
              </div>
              <h4 className="font-medium truncate">{c.title}</h4>
              <p className="text-xs text-muted-foreground">
                {CATEGORY_LABELS[c.category]} · {c.location} · Assigned: {c.assignedTo}
              </p>
            </div>
            <Select onValueChange={(val) => handleStatusChange(c.id, val as ComplaintStatus, c.category)}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resolved">Mark Resolved</SelectItem>
                <SelectItem value="pending">Back to Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}
