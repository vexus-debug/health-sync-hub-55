import { ReactNode, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, ScanLine, CalendarClock, Activity, LogOut, Menu, Search, UserPlus } from "lucide-react";
import logo from "@/assets/logo.png";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchScans, fetchAppointments } from "@/lib/scanQueries";
import { useRealtime } from "@/lib/useRealtime";
import { isToday } from "date-fns";
import { Badge } from "@/components/ui/badge";

const nav = [
  { to: "/scan-dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/scan-dashboard/register", label: "Register", icon: UserPlus },
  { to: "/scan-dashboard/patients", label: "Patients", icon: Users },
  { to: "/scan-dashboard/scans", label: "Scans", icon: ScanLine },
  { to: "/scan-dashboard/appointments", label: "Appointments", icon: CalendarClock },
  { to: "/scan-dashboard/activity", label: "Activity", icon: Activity },
];

const SidebarBody = ({
  onNavigate,
  counts,
}: {
  onNavigate?: () => void;
  counts: Record<string, { count: number; urgent?: boolean }>;
}) => (
  <>
    <div className="h-24 flex items-center gap-2 px-4 border-b border-border">
      <img src={logo} alt="Medvic" className="h-16 w-auto" />
      <div className="leading-tight">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Scan Dashboard</p>
      </div>
    </div>
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {nav.map((it) => {
        const c = counts[it.to];
        return (
          <NavLink key={it.to} to={it.to} end={it.end} onClick={onNavigate}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth",
              isActive ? "bg-primary text-primary-foreground shadow-soft" : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}>
            <it.icon className="h-4 w-4" />
            <span className="flex-1">{it.label}</span>
            {c && c.count > 0 ? (
              <Badge
                variant={c.urgent ? "destructive" : "secondary"}
                className="h-5 min-w-5 px-1.5 text-[10px] rounded-full"
              >
                {c.count > 99 ? "99+" : c.count}
              </Badge>
            ) : null}
          </NavLink>
        );
      })}
      <NavLink to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 mt-6 rounded-lg text-sm font-medium text-foreground/60 hover:bg-muted">
        ← Lab Dashboard
      </NavLink>
    </nav>
  </>
);

export const ScanLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const { data: scans = [] } = useQuery({ queryKey: ["scans"], queryFn: fetchScans });
  const { data: appts = [] } = useQuery({ queryKey: ["scan_appointments"], queryFn: fetchAppointments });
  useRealtime("scans", [["scans"]]);
  useRealtime("scan_appointments", [["scan_appointments"]]);

  const urgentOpen = scans.filter(
    (s) => s.urgent && s.status !== "Approved" && s.status !== "Completed",
  ).length;
  const todaysAppts = appts.filter((a) => isToday(new Date(a.scheduled_at))).length;
  const counts = {
    "/scan-dashboard/scans": { count: urgentOpen, urgent: true },
    "/scan-dashboard/appointments": { count: todaysAppts },
  };

  const initials = profile?.display_name
    ? profile.display_name.split(" ").slice(0, 2).map((n) => n[0]?.toUpperCase()).join("")
    : "U";

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    if (q) navigate(`/scan-dashboard/patients?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card print:hidden">
        <SidebarBody counts={counts} />
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center gap-2 px-3 sm:px-4 lg:px-6 bg-card border-b border-border sticky top-0 z-30 print:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-muted" aria-label="Menu">
                <Menu className="h-5 w-5 text-foreground/70" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-card flex flex-col">
              <SidebarBody onNavigate={() => setMobileOpen(false)} counts={counts} />
            </SheetContent>
          </Sheet>
          <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" placeholder="Search patients (name, MRN, phone)…" className="pl-9 rounded-full bg-muted/50 border-transparent focus-visible:bg-background" />
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 pl-1.5 sm:pl-2 sm:pr-3 py-1.5 rounded-full hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-xs font-semibold">{profile?.display_name ?? "User"}</p>
                <p className="text-[10px] text-muted-foreground">{profile?.role ?? "Staff"}</p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/dashboard")}>Lab Dashboard</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={async () => { await signOut(); navigate("/login"); }}>
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default ScanLayout;
