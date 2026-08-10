import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, FileCheck2, FlaskConical, TrendingUp, Plus, Timer, Users } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchTestForms, fetchScientists } from "@/lib/supabaseQueries";
import { TestStatus } from "@/lib/labCatalog";
import { Loader2 } from "lucide-react";
import { medianTatHours, slaBreachCount, formatHours } from "@/lib/stats";
import { useRealtime } from "@/lib/useRealtime";

const Stat = ({
  icon: Icon,
  label,
  value,
  hint,
  tone = "primary",
}: {
  icon: any;
  label: string;
  value: number | string;
  hint?: string;
  tone?: "primary" | "amber" | "sky" | "emerald";
}) => {
  const tones: Record<string, { ring: string; chip: string }> = {
    primary: {
      ring: "before:bg-gradient-primary",
      chip: "bg-primary-soft text-primary",
    },
    amber: {
      ring: "before:bg-[linear-gradient(135deg,hsl(38_92%_50%),hsl(20_90%_55%))]",
      chip: "bg-amber-50 text-amber-700",
    },
    sky: {
      ring: "before:bg-[linear-gradient(135deg,hsl(205_90%_50%),hsl(225_85%_55%))]",
      chip: "bg-sky-50 text-sky-700",
    },
    emerald: {
      ring: "before:bg-[linear-gradient(135deg,hsl(152_65%_42%),hsl(180_70%_42%))]",
      chip: "bg-emerald-50 text-emerald-700",
    },
  };
  const t = tones[tone];
  return (
    <Card
      className={`relative overflow-hidden border-border/60 shadow-soft hover:shadow-elegant transition-smooth group before:absolute before:inset-x-0 before:top-0 before:h-[3px] ${t.ring}`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-primary opacity-[0.06] blur-2xl group-hover:opacity-[0.12] transition-smooth" />
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
              {value}
            </p>
            {hint && <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p>}
          </div>
          <div
            className={`relative h-12 w-12 shrink-0 rounded-2xl ${t.chip} flex items-center justify-center shadow-soft ring-1 ring-border/40`}
          >
            <Icon className="h-5 w-5" strokeWidth={2.25} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { profile } = useAuth();
  const { data: forms = [], isLoading } = useQuery({
    queryKey: ["test_forms"],
    queryFn: fetchTestForms,
  });
  const { data: scientists = [] } = useQuery({ queryKey: ["scientists"], queryFn: fetchScientists });
  useRealtime("test_forms", [["test_forms"]]);

  const displayName = profile?.display_name?.split("@")[0] ?? "Scientist";
  const today = new Date().toDateString();
  const todays = forms.filter((f) => new Date(f.date_collected).toDateString() === today);
  const pending = forms.filter((f) => f.status === "Pending");
  const processing = forms.filter((f) => f.status === "Processing");
  const completed = forms.filter((f) => f.status === "Completed");

  const recent = [...forms].slice(0, 6);

  const tat = medianTatHours(
    forms.map((f) => ({ start: f.date_collected, end: f.completed_at })),
  );
  const breaches = slaBreachCount(
    forms
      .filter((f) => f.status !== "Completed" || f.completed_at)
      .map((f) => ({ start: f.date_collected, end: f.completed_at })),
    24,
  );

  const scientistMap = Object.fromEntries(
    (scientists as { id: string; name: string }[]).map((s) => [s.id, s.name]),
  );
  const workload = Object.entries(
    forms.reduce<Record<string, { total: number; open: number; done: number }>>(
      (acc, f) => {
        const key = f.scientist_id ?? "unassigned";
        acc[key] ??= { total: 0, open: 0, done: 0 };
        acc[key].total++;
        if (f.status === "Completed") acc[key].done++;
        else acc[key].open++;
        return acc;
      },
      {},
    ),
  )
    .map(([id, v]) => ({ id, name: id === "unassigned" ? "Unassigned" : scientistMap[id] ?? "Unknown", ...v }))
    .sort((a, b) => b.open - a.open || b.total - a.total)
    .slice(0, 6);

  const testCounts = forms
    .flatMap((f) => f.tests_requested)
    .reduce<Record<string, number>>((acc, t) => {
      acc[t] = (acc[t] ?? 0) + 1;
      return acc;
    }, {});
  const topTests = Object.entries(testCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxTest = topTests[0]?.[1] ?? 1;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-border/60 bg-gradient-primary p-6 text-primary-foreground shadow-elegant">
        <div className="absolute inset-0 bg-mesh opacity-60 mix-blend-overlay" />
        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
              Medvic Goodhealth · Lab Operations
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold">
              Welcome back, {displayName}
            </h1>
            <p className="text-sm text-primary-foreground/80 mt-1">
              Here's a snapshot of what's happening in the lab today.
            </p>
          </div>
          <Button asChild variant="secondary" className="bg-background text-primary hover:bg-background/90">
            <Link to="/dashboard/forms/new"><Plus className="h-4 w-4" /> New Test Form</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Stat icon={FlaskConical} label="Tests Today" value={todays.length} hint="across all categories" tone="primary" />
        <Stat icon={Clock} label="Pending" value={pending.length} hint="awaiting scientist" tone="amber" />
        <Stat icon={Activity} label="In Progress" value={processing.length} hint="being processed" tone="sky" />
        <Stat icon={FileCheck2} label="Completed" value={completed.length} hint="ready for download" tone="emerald" />
        <Stat icon={Timer} label="Median TAT" value={formatHours(tat)} hint={`${breaches} over 24h SLA`} tone="sky" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-border/60 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Latest test forms received</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard/forms">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="divide-y divide-border">
              {recent.map((f) => (
                <li key={f.serial}>
                  <Link to={`/dashboard/forms/${f.serial}`}
                    className="flex items-center justify-between py-3 -mx-2 px-2 rounded-lg hover:bg-muted transition-smooth">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{f.patient_name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {f.serial} · {f.tests_requested.slice(0, 2).join(", ")}
                        {f.tests_requested.length > 2 && ` +${f.tests_requested.length - 2}`}
                      </p>
                    </div>
                    <StatusBadge status={f.status as TestStatus} />
                  </Link>
                </li>
              ))}
              {recent.length === 0 && (
                <li className="py-8 text-center text-muted-foreground text-sm">No test forms yet.</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Throughput</CardTitle>
            <p className="text-xs text-muted-foreground">Received vs Completed · last 7 days</p>
          </CardHeader>
          <CardContent>
            {(() => {
              const days: { label: string; received: number; completed: number }[] = [];
              const now = new Date();
              for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(now.getDate() - i);
                const key = d.toDateString();
                const completedCount = forms.filter(
                  (f) =>
                    f.completed_at &&
                    new Date(f.completed_at).toDateString() === key,
                ).length;
                const receivedCount = forms.filter(
                  (f) => new Date(f.date_collected).toDateString() === key,
                ).length;
                days.push({
                  label: d.toLocaleDateString(undefined, { weekday: "short" }),
                  received: receivedCount,
                  completed: completedCount,
                });
              }
              const max = Math.max(1, ...days.flatMap((d) => [d.received, d.completed]));
              const total = days.reduce((s, d) => s + d.completed, 0);
              const prev7Total = forms.filter((f) => {
                if (!f.completed_at) return false;
                const t = new Date(f.completed_at).getTime();
                const start = now.getTime() - 14 * 86400000;
                const end = now.getTime() - 7 * 86400000;
                return t >= start && t < end;
              }).length;
              const delta =
                prev7Total === 0
                  ? total > 0 ? 100 : 0
                  : Math.round(((total - prev7Total) / prev7Total) * 100);
              const positive = delta >= 0;
              return (
                <>
                  <div className="flex items-end gap-1.5 h-32">
                    {days.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex-1 flex items-end gap-0.5">
                          <div
                            className="flex-1 rounded-t-md bg-primary/40"
                            style={{ height: `${(d.received / max) * 100 || 4}%` }}
                            title={`${d.received} received`}
                          />
                          <div
                            className="flex-1 rounded-t-md bg-gradient-primary"
                            style={{ height: `${(d.completed / max) * 100 || 4}%` }}
                            title={`${d.completed} completed`}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{d.label[0]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-sm bg-primary/40" /> Received
                      <span className="inline-block h-2 w-2 rounded-sm bg-gradient-primary ml-1" /> Completed
                    </span>
                    <span
                      className={`flex items-center gap-1 font-medium ${
                        positive ? "text-success" : "text-destructive"
                      }`}
                    >
                      <TrendingUp
                        className={`h-3.5 w-3.5 ${positive ? "" : "rotate-180"}`}
                      />
                      {positive ? "+" : ""}
                      {delta}% vs prev 7d
                    </span>
                  </div>
                </>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <Card className="border-border/60 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> Scientist Workload</CardTitle>
            <p className="text-xs text-muted-foreground">Open vs completed per scientist</p>
          </CardHeader>
          <CardContent>
            {workload.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No assignments yet.</p>
            ) : (
              <ul className="space-y-2.5">
                {workload.map((w) => {
                  const total = Math.max(1, w.total);
                  return (
                    <li key={w.id}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium truncate">{w.name}</span>
                        <span className="text-muted-foreground tabular-nums">
                          {w.open} open · {w.done} done
                        </span>
                      </div>
                      <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                        <div className="bg-amber-500" style={{ width: `${(w.open / total) * 100}%` }} />
                        <div className="bg-emerald-500" style={{ width: `${(w.done / total) * 100}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Top Requested Tests</CardTitle>
            <p className="text-xs text-muted-foreground">Most ordered across all forms</p>
          </CardHeader>
          <CardContent>
            {topTests.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No data yet.</p>
            ) : (
              <ul className="space-y-2">
                {topTests.map(([name, count]) => (
                  <li key={name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium truncate">{name}</span>
                      <span className="text-muted-foreground tabular-nums">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-gradient-primary" style={{ width: `${(count / maxTest) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
