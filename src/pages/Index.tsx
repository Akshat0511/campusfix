import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, Eye, Send, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Send,
    title: "Report in 60 Seconds",
    description: "Quick form with categories, location, and optional photo upload to report any campus issue.",
  },
  {
    icon: Eye,
    title: "Real-time Tracking",
    description: "Follow your ticket from Pending → In Progress → Resolved with live status updates.",
  },
  {
    icon: Shield,
    title: "Admin Analytics",
    description: "Dashboard for authorities to identify hotspots, track resolution times, and allocate resources.",
  },
];

const steps = [
  { num: "01", icon: AlertTriangle, title: "Spot an Issue", desc: "Notice a broken bench, leaking pipe, or network outage on campus." },
  { num: "02", icon: Send, title: "Submit Report", desc: "Fill a quick form with details, category, and an optional photo." },
  { num: "03", icon: Clock, title: "Auto-Routing", desc: "The system routes your complaint to the right department automatically." },
  { num: "04", icon: CheckCircle2, title: "Get Resolved", desc: "Track progress and confirm resolution. Your campus improves!" },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero text-primary-foreground">
        <div className="container py-20 md:py-32">
          <div className="max-w-2xl space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent">
              <AlertTriangle className="h-4 w-4" />
              Campus Grievance Portal
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Fix Your Campus,<br />
              <span className="text-accent">One Report at a Time.</span>
            </h1>
            <p className="text-lg text-primary-foreground/70 max-w-lg">
              A unified platform for students and staff to report infrastructure issues, track resolutions, and hold administration accountable.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="gradient-accent text-accent-foreground font-semibold rounded-xl shadow-lg hover:opacity-90 transition-opacity">
                <Link to="/login">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold">Why CampusFix?</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Replacing fragmented, paper-based reporting with a transparent digital workflow.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass-card rounded-2xl p-8 hover:shadow-lg transition-shadow animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-12 w-12 rounded-xl gradient-accent flex items-center justify-center mb-5">
                <f.icon className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/50 py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-14">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="text-center animate-fade-in" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="text-5xl font-extrabold text-accent/20 mb-3">{s.num}</div>
                <div className="mx-auto h-14 w-14 rounded-full bg-card border flex items-center justify-center mb-4 shadow-sm">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Your report helps improve campus life for everyone. It takes less than a minute.
        </p>
        <Button asChild size="lg" className="gradient-accent text-accent-foreground rounded-xl shadow-lg font-semibold hover:opacity-90">
          <Link to="/login">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <AlertTriangle className="h-4 w-4 text-accent" />
            CampusFix
          </div>
          <p>© {new Date().getFullYear()} Campus Grievance Redressal System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
