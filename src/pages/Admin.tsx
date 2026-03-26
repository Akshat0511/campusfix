import { useMemo, useState } from "react";
import { getComplaints, getStats, updateComplaintStatus } from "@/lib/store";
import { CATEGORY_LABELS, CATEGORY_DEPARTMENTS, ComplaintStatus, STATUS_LABELS } from "@/lib/types";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle2, Clock, Loader2, TrendingUp, BarChart3, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const [refreshKey, setRefreshKey] = useState(0);
  const stats = useMemo(() => getStats(), [refreshKey]);
  const complaints = useMemo(() => getComplaints(), [refreshKey]);

  const handleStatusChange = (id: string, newStatus: ComplaintStatus, category: string) => {
    const dept = CATEGORY_DEPARTMENTS[category as keyof typeof CATEGORY_DEPARTMENTS];
    updateComplaintStatus(id, newStatus, dept);
    setRefreshKey((k) => k + 1);
    toast.success(`Ticket ${id} updated to ${STATUS_LABELS[newStatus]}`);
  };

  return (
    <div className="container py-10 md:py-16">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of campus grievances and resolution metrics.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Issues" value={stats.total} icon={AlertTriangle} color="text-foreground" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} color="text-warning" />
        <StatCard label="In Progress" value={stats.inProgress} icon={Loader2} color="text-info" />
        <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle2} color="text-success" />
      </div>

      {/* Avg resolution and category breakdown */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="glass-card rounded-2xl p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-accent" />
            <h3 className="font-semibold">Avg. Resolution Time</h3>
          </div>
          <p className="text-4xl font-bold text-accent">{stats.avgResolutionDays.toFixed(1)} days</p>
          <p className="text-sm text-muted-foreground mt-1">Based on {stats.resolved} resolved tickets</p>
        </div>
        <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-accent" />
            <h3 className="font-semibold">Issues by Category</h3>
          </div>
          <div className="space-y-3">
            {stats.byCategory.map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-sm">{CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full gradient-accent"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All tickets management */}
      <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
        <h3 className="text-xl font-bold mb-4">Manage Tickets</h3>
        <div className="space-y-3">
          {complaints.map((c) => (
            <div key={c.id} className="glass-card rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-accent">{c.id}</span>
                  <StatusBadge status={c.status} />
                </div>
                <h4 className="font-medium truncate">{c.title}</h4>
                <p className="text-xs text-muted-foreground">
                  {CATEGORY_LABELS[c.category]} · {c.location} · by {c.reporterName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {c.status !== "resolved" && (
                  <Select
                    value={c.status}
                    onValueChange={(val) => handleStatusChange(c.id, val as ComplaintStatus, c.category)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {c.status === "resolved" && (
                  <span className="text-xs text-success font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
