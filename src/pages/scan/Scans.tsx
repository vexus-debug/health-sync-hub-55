import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ScanLayout } from "@/components/scan/ScanLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchScans, fetchPatients } from "@/lib/scanQueries";
import { format } from "date-fns";
import { Download, AlertTriangle } from "lucide-react";
import { DateRangeFilter, DateRange, dateRangeCutoff, inRange } from "@/components/common/DateRangeFilter";
import { downloadCsv } from "@/lib/csvExport";
import { useRealtime } from "@/lib/useRealtime";

const Scans = () => {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [range, setRange] = useState<DateRange>("30d");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const { data: scans = [] } = useQuery({ queryKey: ["scans"], queryFn: fetchScans });
  const { data: patients = [] } = useQuery({ queryKey: ["scan_patients"], queryFn: fetchPatients });
  useRealtime("scans", [["scans"]]);
  const pMap = Object.fromEntries(patients.map((p) => [p.id, p]));

  const filtered = useMemo(() => {
    const cutoff = dateRangeCutoff(range);
    const out = scans.filter((s) => {
      if (status !== "All" && s.status !== status) return false;
      if (urgentOnly && !s.urgent) return false;
      if (!inRange(s.scan_date, cutoff)) return false;
      if (!q) return true;
      const p = pMap[s.patient_id];
      const hay = `${s.serial} ${s.scan_type} ${s.body_part ?? ""} ${p?.full_name ?? ""} ${p?.mrn ?? ""}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
    out.sort((a, b) => {
      const da = new Date(a.scan_date).getTime();
      const db = new Date(b.scan_date).getTime();
      return sort === "newest" ? db - da : da - db;
    });
    return out;
  }, [scans, status, urgentOnly, range, q, pMap, sort]);

  const exportCsv = () => {
    downloadCsv(
      `scans-${new Date().toISOString().slice(0, 10)}.csv`,
      filtered.map((s) => {
        const p = pMap[s.patient_id];
        return {
          serial: s.serial,
          patient: p?.full_name ?? "",
          mrn: p?.mrn ?? "",
          scan_type: s.scan_type,
          modality: s.modality ?? "",
          body_part: s.body_part ?? "",
          scan_date: s.scan_date,
          status: s.status,
          urgent: s.urgent ? "yes" : "",
          referring_doctor: s.referring_doctor ?? "",
          approved_at: s.approved_at ?? "",
        };
      }),
    );
  };

  return (
    <ScanLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Scans</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} of {scans.length}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="w-full sm:w-64" />
            <DateRangeFilter value={range} onChange={setRange} />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>{["All","Pending","Reported","Approved","Completed"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={sort} onValueChange={(v) => setSort(v as "newest" | "oldest")}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={urgentOnly ? "destructive" : "outline"}
              size="sm"
              onClick={() => setUrgentOnly((v) => !v)}
              className="gap-1"
            >
              <AlertTriangle className="h-3.5 w-3.5" /> Urgent
            </Button>
            <Button variant="outline" size="sm" onClick={exportCsv} className="gap-1">
              <Download className="h-3.5 w-3.5" /> CSV
            </Button>
          </div>
        </div>
        <Card><CardContent className="p-0 divide-y">
          {filtered.length === 0 && <p className="p-6 text-sm text-muted-foreground text-center">No scans.</p>}
          {filtered.map((s) => {
            const p = pMap[s.patient_id];
            return (
              <Link key={s.id} to={`/scan-dashboard/scans/${s.id}`} className="block p-4 hover:bg-muted">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{s.serial} · {s.scan_type}</p>
                    <p className="text-xs text-muted-foreground truncate">{p?.full_name ?? "—"} ({p?.mrn ?? "—"}) · {format(new Date(s.scan_date), "PP p")}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {s.urgent && <Badge variant="destructive">Urgent</Badge>}
                    <Badge variant={s.status === "Approved" ? "default" : "secondary"}>{s.status}</Badge>
                  </div>
                </div>
              </Link>
            );
          })}
        </CardContent></Card>
      </div>
    </ScanLayout>
  );
};
export default Scans;
