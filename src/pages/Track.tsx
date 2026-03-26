import { useState, useMemo } from "react";
import { getComplaints } from "@/lib/store";
import { CATEGORY_LABELS, ComplaintStatus, STATUS_LABELS } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Search, Tag } from "lucide-react";

export default function Track() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const complaints = useMemo(() => getComplaints(), []);

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch =
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.reporterName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, statusFilter]);

  return (
    <div className="container py-10 md:py-16">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold">Track Tickets</h1>
        <p className="text-muted-foreground mt-1">Search and monitor the status of all reported issues.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, title, or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No tickets found</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
          </div>
        )}

        {filtered.map((c, i) => (
          <div
            key={c.id}
            className="glass-card rounded-2xl p-6 hover:shadow-md transition-shadow animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono font-bold text-accent">{c.id}</span>
                  <StatusBadge status={c.status} />
                </div>
                <h3 className="font-semibold text-lg truncate">{c.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    {CATEGORY_LABELS[c.category]}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {c.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Status timeline */}
              <div className="flex md:flex-col items-center gap-2 md:gap-1">
                {(["pending", "in-progress", "resolved"] as ComplaintStatus[]).map((s, idx) => {
                  const reached =
                    s === "pending" ||
                    (s === "in-progress" && (c.status === "in-progress" || c.status === "resolved")) ||
                    (s === "resolved" && c.status === "resolved");
                  return (
                    <div key={s} className="flex items-center gap-2 md:flex-row">
                      <div
                        className={`h-3 w-3 rounded-full border-2 transition-colors ${
                          reached
                            ? s === "resolved"
                              ? "bg-success border-success"
                              : s === "in-progress"
                              ? "bg-info border-info"
                              : "bg-warning border-warning"
                            : "border-border bg-transparent"
                        }`}
                      />
                      {idx < 2 && (
                        <div className={`hidden md:block h-4 w-0.5 mx-auto ${reached ? "bg-border" : "bg-border/30"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
