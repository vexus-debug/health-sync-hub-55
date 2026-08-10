import { ReactNode, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import { LayoutDashboard, FileText, Clock, CheckCircle2, Users, Settings, Search, Bell, LogOut, Menu, Inbox, ShoppingBag, Pill, ListChecks } from "lucide-react";
import logo from "@/assets/logo.png";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchTestForms } from "@/lib/supabaseQueries";
import { formatDistanceToNow } from "date-fns";
import { useRealtime } from "@/lib/useRealtime";

const baseNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/forms", label: "Test Forms", icon: FileText },
  { to: "/dashboard/pending", label: "Pending Tests", icon: Clock },
  { to: "/dashboard/results", label: "Results Search", icon: Search },
  { to: "/dashboard/completed", label: "Completed Results", icon: CheckCircle2 },
  { to: "/dashboard/scientists", label: "Scientists", icon: Users },
  { to: "/scan-dashboard", label: "Scan Dashboard", icon: LayoutDashboard },
];

const SidebarBody = ({
  onNavigate,
  isSenior,
  isLabAdmin,
  counts,
}: {
  onNavigate?: () => void;
  isSenior: boolean;
  isLabAdmin: boolean;
  counts: Record<string, number>;
}) => {
  const nav: { to: string; label: string; icon: typeof LayoutDashboard; end?: boolean }[] = isSenior
    ? [...baseNav,
        { to: "/dashboard/shop", label: "Shop", icon: ShoppingBag },
        { to: "/dashboard/pharmacy", label: "Pharmacy", icon: Pill },
        { to: "/dashboard/settings", label: "Settings", icon: Settings },
      ]
    : baseNav;
  if (isLabAdmin && !nav.some((n) => n.to === "/dashboard/manage-tests")) {
    nav.splice(nav.length, 0, { to: "/dashboard/manage-tests", label: "Manage Tests", icon: ListChecks });
  }
  return (
  <>
    <div className="h-24 flex items-center gap-2 px-4 border-b border-border">
      <img src={logo} alt="Medvic Goodhealth" className="h-16 w-auto" />
      <div className="leading-tight">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Scientist Dashboard</p>
      </div>
    </div>
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {nav.map((item) => {
        const count = counts[item.to];
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth",
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground",
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span className="flex-1">{item.label}</span>
            {count ? (
              <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-[10px] rounded-full">
                {count > 99 ? "99+" : count}
              </Badge>
            ) : null}
          </NavLink>
        );
      })}
    </nav>
    <div className="p-4 border-t border-border">
      <div className="rounded-xl bg-primary-soft p-3 text-xs text-primary">
        <p className="font-semibold mb-1">Quality Reminder</p>
        <p className="text-primary/80 leading-relaxed">Verify every value against reference ranges before marking Completed.</p>
      </div>
    </div>
  </>
  );
};

const NotificationsBell = () => {
  const { data: forms = [] } = useQuery({
    queryKey: ["test_forms"],
    queryFn: fetchTestForms,
  });

  const items = forms
    .filter((f) => f.status === "Pending" || f.status === "Processing")
    .slice(0, 8);
  const count = items.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative p-2 rounded-full hover:bg-muted transition-smooth"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-foreground/70" />
          {count > 0 && (
            <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px]">
              {count > 9 ? "9+" : count}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <p className="text-sm font-semibold">Notifications</p>
          <span className="text-[11px] text-muted-foreground">
            {count} pending
          </span>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {items.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
              <Inbox className="h-6 w-6 opacity-60" />
              You're all caught up
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((f) => (
                <li key={f.serial}>
                  <Link
                    to={`/dashboard/forms/${f.serial}`}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-muted transition-smooth"
                  >
                    <div
                      className={cn(
                        "mt-1 h-2 w-2 rounded-full shrink-0",
                        f.status === "Pending" ? "bg-amber-500" : "bg-sky-500",
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {f.patient_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {f.serial} · {f.status}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {formatDistanceToNow(new Date(f.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="px-4 py-2 border-t border-border">
          <Link
            to="/dashboard/pending"
            className="text-xs font-medium text-primary hover:underline"
          >
            View all pending tests →
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const isSenior = (profile?.role ?? "").toLowerCase().includes("senior");
  const { isLabAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: forms = [] } = useQuery({ queryKey: ["test_forms"], queryFn: fetchTestForms });
  useRealtime("test_forms", [["test_forms"]]);
  const counts: Record<string, number> = {
    "/dashboard/pending": forms.filter((f) => f.status === "Pending").length,
  };

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const q = String(data.get("q") ?? "").trim();
    if (q) navigate(`/dashboard/forms?q=${encodeURIComponent(q)}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const initials = profile?.display_name
    ? profile.display_name.split(" ").slice(0, 2).map((n) => n[0]?.toUpperCase()).join("")
    : "U";

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
        <SidebarBody isSenior={isSenior} isLabAdmin={isLabAdmin} counts={counts} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center gap-2 px-3 sm:px-4 lg:px-6 bg-card border-b border-border sticky top-0 z-30">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-muted transition-smooth" aria-label="Open menu">
                <Menu className="h-5 w-5 text-foreground/70" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-card flex flex-col">
              <SidebarBody onNavigate={() => setMobileOpen(false)} isSenior={isSenior} isLabAdmin={isLabAdmin} counts={counts} />
            </SheetContent>
          </Sheet>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" placeholder="Search serial or patient…"
              className="pl-9 rounded-full bg-muted/50 border-transparent focus-visible:bg-background" />
          </form>
          <NotificationsBell />
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 pl-1.5 sm:pl-2 sm:pr-3 py-1.5 rounded-full hover:bg-muted transition-smooth">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-xs font-semibold">{profile?.display_name ?? "User"}</p>
                <p className="text-[10px] text-muted-foreground">{profile?.role ?? "Scientist"}</p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Activity Log</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
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

export default DashboardLayout;
