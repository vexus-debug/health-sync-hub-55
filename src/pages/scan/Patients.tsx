import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ScanLayout } from "@/components/scan/ScanLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchPatients } from "@/lib/scanQueries";
import { Plus, UserRound, Download } from "lucide-react";
import { downloadCsv } from "@/lib/csvExport";
import { useRealtime } from "@/lib/useRealtime";

const Patients = () => {
  const [params, setParams] = useSearchParams();
  const q = (params.get("q") ?? "").toLowerCase();
  const { data: patients = [] } = useQuery({ queryKey: ["scan_patients"], queryFn: fetchPatients });
  useRealtime("scan_patients", [["scan_patients"]]);
  const filtered = patients.filter((p) =>
    !q || p.full_name.toLowerCase().includes(q) || p.mrn.toLowerCase().includes(q) || (p.phone ?? "").toLowerCase().includes(q)
  );

  return (
    <ScanLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Patients</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} of {patients.length}</p>
          </div>
          <div className="flex gap-2">
            <Input placeholder="Search…" value={params.get("q") ?? ""} onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {})} className="w-full sm:w-64" />
            <Button variant="outline" onClick={() => downloadCsv(`patients-${new Date().toISOString().slice(0,10)}.csv`, filtered.map((p) => ({ mrn: p.mrn, full_name: p.full_name, gender: p.gender ?? "", age: p.age ?? "", phone: p.phone ?? "", email: p.email ?? "", address: p.address ?? "", created_at: p.created_at })))} className="gap-1">
              <Download className="h-3.5 w-3.5" /> CSV
            </Button>
            <Button asChild>
              <Link to="/scan-dashboard/register"><Plus className="h-4 w-4 mr-1" /> Register</Link>
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className="p-0 divide-y">
            {filtered.length === 0 && <p className="p-6 text-sm text-muted-foreground text-center">No patients.</p>}
            {filtered.map((p) => (
              <Link key={p.id} to={`/scan-dashboard/patients/${p.id}`} className="flex items-center gap-4 p-4 hover:bg-muted">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center"><UserRound className="h-5 w-5" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{p.full_name}</p>
                  <p className="text-xs text-muted-foreground">{p.mrn} · {p.gender ?? "—"} · {p.age ?? "—"}y · {p.phone ?? "—"}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </ScanLayout>
  );
};
export default Patients;
