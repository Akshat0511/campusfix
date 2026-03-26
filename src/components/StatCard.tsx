import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

export function StatCard({ label, value, icon: Icon, color = "text-primary" }: StatCardProps) {
  return (
    <div className="glass-card rounded-xl p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-muted ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
