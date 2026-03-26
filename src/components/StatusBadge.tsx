import { ComplaintStatus, STATUS_LABELS } from "@/lib/types";
import { Clock, Loader2, CheckCircle2 } from "lucide-react";

const config: Record<ComplaintStatus, { class: string; icon: typeof Clock }> = {
  pending: { class: "status-pending", icon: Clock },
  "in-progress": { class: "status-progress", icon: Loader2 },
  resolved: { class: "status-resolved", icon: CheckCircle2 },
};

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  const { class: cls, icon: Icon } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
      <Icon className={`h-3.5 w-3.5 ${status === "in-progress" ? "animate-spin" : ""}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}
