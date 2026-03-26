import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, GraduationCap, Shield, Wrench, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const ROLES: { role: UserRole; label: string; icon: typeof GraduationCap; desc: string; credentials: string }[] = [
  {
    role: "student",
    label: "Student",
    icon: GraduationCap,
    desc: "Report issues & track your tickets",
    credentials: "student@campus.edu / student123",
  },
  {
    role: "staff",
    label: "Staff",
    icon: Wrench,
    desc: "Validate & verify reported complaints",
    credentials: "staff@campus.edu / staff123",
  },
  {
    role: "admin",
    label: "Admin",
    icon: Shield,
    desc: "Full dashboard, analytics & management",
    credentials: "admin@campus.edu / admin123",
  },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      toast.error("Please select a role first");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const success = login(email, password, selectedRole);
      setLoading(false);
      if (success) {
        toast.success("Welcome to CampusFix!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid credentials. Check the demo credentials below.");
      }
    }, 500);
  };

  const fillCredentials = (role: UserRole) => {
    const r = ROLES.find((r) => r.role === role)!;
    const [e, p] = r.credentials.split(" / ");
    setEmail(e);
    setPassword(p);
    setSelectedRole(role);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="gradient-hero py-8">
        <div className="container flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-accent" />
          <span className="text-2xl font-bold text-primary-foreground tracking-tight">CampusFix</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-lg space-y-8 animate-fade-in">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Sign In</h1>
            <p className="text-muted-foreground mt-2">Select your role and enter your credentials</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-3">
            {ROLES.map((r) => {
              const active = selectedRole === r.role;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => fillCredentials(r.role)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                    active
                      ? "border-accent bg-accent/10 shadow-md"
                      : "border-border hover:border-accent/40 hover:bg-muted/50"
                  }`}
                >
                  <div className={`p-2.5 rounded-lg ${active ? "gradient-accent" : "bg-muted"}`}>
                    <r.icon className={`h-5 w-5 ${active ? "text-accent-foreground" : "text-muted-foreground"}`} />
                  </div>
                  <span className="text-sm font-semibold">{r.label}</span>
                  <span className="text-[11px] text-muted-foreground leading-tight">{r.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={loading || !selectedRole}
              className="w-full gradient-accent text-accent-foreground rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity"
            >
              {loading ? "Signing in..." : (
                <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </form>

          {/* Demo hint */}
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Demo Credentials</p>
            <div className="space-y-2">
              {ROLES.map((r) => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => fillCredentials(r.role)}
                  className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors group"
                >
                  <div>
                    <span className="text-xs font-semibold capitalize">{r.label}</span>
                    <p className="text-[11px] text-muted-foreground font-mono">{r.credentials}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
