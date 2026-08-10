import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ScanLayout } from "@/components/scan/ScanLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchScans, fetchAppointments } from "@/lib/scanQueries";
import { ScanLine, Clock, CheckCircle2, AlertTriangle, CalendarClock, Timer } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { useState } from "react";
import { DateRangeFilter, DateRange, dateRangeCutoff, inRange } from "@/components/common/DateRangeFilter";
import { medianTatHours, slaBreachCount, formatHours } from "@/lib/stats";
import { useRealtime } from "@/lib/useRealtime";

const Overview = () => {
  const { data: allScans = [] } = useQuery({ queryKey: ["scans"], queryFn: fetchScans });
  const { data: appts = [] } = useQuery({ queryKey: ["scan_appointments"], queryFn: fetchAppointments });
  const [range, setRange] = useState<DateRange>("30d");
  useRealtime("scans", [["scans"]]);
  useRealtime("scan_appointments", [["scan_appointments"]]);

  const cutoff = dateRangeCutoff(range);
  const scans = allScans.filter((s) => inRange(s.scan_date, cutoff));

  const total = scans.length;
  const doneStatuses = new Set(["Approved", "Completed"]);
  const urgentOpen = scans.filter((s) => s.urgent && !doneStatuses.has(s.status));
  const pending = scans.filter(
    (s) => (s.status === "Pending" || s.status === "Reported") && !s.urgent,
  ).length;
  const completed = scans.filter((s) => doneStatuses.has(s.status)).length;
  const urgent = urgentOpen.length;

  const tat = medianTatHours(
    scans.map((s) => ({ start: s.scan_date, end: s.approved_at })),
  );
  const breaches = slaBreachCount(
    scans
      .filter((s) => !doneStatuses.has(s.status) || s.approved_at)
      .map((s) => ({ start: s.scan_date, end: s.approved_at })),
    24,
  );

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = startOfDay(subDays(new Date(), 6 - i));
    const dayScans = allScans.filter(
      (s) => startOfDay(new Date(s.scan_date)).getTime() === d.getTime(),
    );
    return {
      day: format(d, "EEE"),
      scans: dayScans.length,
      completed: dayScans.filter((s) => doneStatuses.has(s.status)).length,
    };
  });

  const statusData = [
    { name: "Pending", value: scans.filter((s) => s.status === "Pending").length },
    { name: "Reported", value: scans.filter((s) => s.status === "Reported").length },
    { name: "Approved", value: scans.filter((s) => s.status === "Approved").length },
  ];
  const colors = ["hsl(var(--primary))", "#f59e0b", "#10b981"];

  const upcoming = appts.filter((a) => new Date(a.scheduled_at) >= new Date()).slice(0, 5);
  const urgentList = urgentOpen.slice(0, 5);

  const Stat = ({ icon: Icon, label, value, tone }: any) => (
    <Card>
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${tone}`}><Icon className="h-6 w-6" /></div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ScanLayout>
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Scan Overview</h1>
            <p className="text-sm text-muted-foreground">Daily operations at a glance</p>
          </div>
          <DateRangeFilter value={range} onChange={setRange} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Stat icon={ScanLine} label="Total Scans" value={total} tone="bg-primary/10 text-primary" />
          <Stat icon={Clock} label="Pending (non-urgent)" value={pending} tone="bg-amber-100 text-amber-700" />
          <Stat icon={AlertTriangle} label="Urgent Open" value={urgent} tone="bg-red-100 text-red-700" />
          <Stat icon={CheckCircle2} label="Completed" value={completed} tone="bg-emerald-100 text-emerald-700" />
          <Stat icon={Timer} label={`TAT · ${breaches} > 24h`} value={formatHours(tat)} tone="bg-sky-100 text-sky-700" />
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Received vs Completed (Last 7 Days)</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={days}>
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="scans" name="Received" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Report Progress</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={70} label>
                    {statusData.map((_, i) => <Cell key={i} fill={colors[i]} />)}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-red-600" /> Urgent Alerts</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {urgentList.length === 0 && <p className="text-sm text-muted-foreground">No urgent cases.</p>}
              {urgentList.map((s) => (
                <Link key={s.id} to={`/scan-dashboard/scans/${s.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                  <div>
                    <p className="text-sm font-medium">{s.serial} · {s.scan_type}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(s.scan_date), "PP")}</p>
                  </div>
                  <Badge variant="destructive">{s.status}</Badge>
                </Link>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><CalendarClock className="h-4 w-4 text-primary" /> Upcoming Appointments</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {upcoming.length === 0 && <p className="text-sm text-muted-foreground">No upcoming appointments.</p>}
              {upcoming.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                  <div>
                    <p className="text-sm font-medium">{a.patient_name}</p>
                    <p className="text-xs text-muted-foreground">{a.scan_type} · {format(new Date(a.scheduled_at), "PP p")}</p>
                  </div>
                  <Badge variant="secondary">{a.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </ScanLayout>
  );
};
export default Overview;
