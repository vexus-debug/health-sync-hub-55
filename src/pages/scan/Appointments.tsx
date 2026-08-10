import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScanLayout } from "@/components/scan/ScanLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchAppointments, updateAppointment } from "@/lib/scanQueries";
import { format, isToday, isThisWeek, isPast } from "date-fns";
import { Plus, Download } from "lucide-react";
import { downloadCsv } from "@/lib/csvExport";
import { useRealtime } from "@/lib/useRealtime";

const Appointments = () => {
  const qc = useQueryClient();
  const { data: appts = [] } = useQuery({ queryKey: ["scan_appointments"], queryFn: fetchAppointments });
  useRealtime("scan_appointments", [["scan_appointments"]]);
  const [tab, setTab] = useState<"today" | "week" | "upcoming" | "all">("today");
  const setStatus = useMutation({
    mutationFn: (p: { id: string; status: string }) => updateAppointment(p.id, { status: p.status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scan_appointments"] }),
  });

  const filtered = useMemo(() => {
    return appts.filter((a) => {
      const d = new Date(a.scheduled_at);
      if (tab === "today") return isToday(d);
      if (tab === "week") return isThisWeek(d, { weekStartsOn: 1 });
      if (tab === "upcoming") return d >= new Date();
      return true;
    });
  }, [appts, tab]);

  const countBy = (fn: (d: Date) => boolean) =>
    appts.filter((a) => fn(new Date(a.scheduled_at))).length;

  const exportCsv = () =>
    downloadCsv(
      `appointments-${new Date().toISOString().slice(0, 10)}.csv`,
      filtered.map((a) => ({
        patient_name: a.patient_name,
        patient_phone: a.patient_phone ?? "",
        scan_type: a.scan_type,
        scheduled_at: a.scheduled_at,
        status: a.status,
        notes: a.notes ?? "",
      })),
    );

  return (
    <ScanLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div><h1 className="text-2xl font-bold">Appointments</h1><p className="text-sm text-muted-foreground">{appts.length} total</p></div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv} className="gap-1">
              <Download className="h-3.5 w-3.5" /> CSV
            </Button>
            <Button asChild>
              <Link to="/scan-dashboard/register"><Plus className="h-4 w-4 mr-1" /> Schedule</Link>
            </Button>
          </div>
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="today">Today ({countBy(isToday)})</TabsTrigger>
            <TabsTrigger value="week">This Week ({countBy((d) => isThisWeek(d, { weekStartsOn: 1 }))})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({countBy((d) => d >= new Date())})</TabsTrigger>
            <TabsTrigger value="all">All ({appts.length})</TabsTrigger>
          </TabsList>
        </Tabs>
        <Card><CardContent className="p-0 divide-y">
          {filtered.length === 0 && <p className="p-6 text-sm text-muted-foreground text-center">No appointments.</p>}
          {filtered.map((a) => {
            const overdue = isPast(new Date(a.scheduled_at)) && a.status === "Scheduled";
            return (
            <div key={a.id} className="p-4 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="font-medium text-sm flex items-center gap-2">
                  {a.patient_name} · {a.scan_type}
                  {overdue && <Badge variant="destructive" className="text-[10px]">Overdue</Badge>}
                </p>
                <p className="text-xs text-muted-foreground">{format(new Date(a.scheduled_at), "PP p")} · {a.patient_phone ?? "—"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={a.status === "Completed" ? "default" : "secondary"}>{a.status}</Badge>
                <Select value={a.status} onValueChange={(v) => setStatus.mutate({ id: a.id, status: v })}>
                  <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{["Scheduled","In Progress","Completed","Cancelled","No Show"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            );
          })}
        </CardContent></Card>
      </div>
    </ScanLayout>
  );
};
export default Appointments;
