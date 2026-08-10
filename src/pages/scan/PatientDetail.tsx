import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ScanLayout } from "@/components/scan/ScanLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchPatient, fetchPatientScans } from "@/lib/scanQueries";
import { format } from "date-fns";
import { Plus, ArrowLeft } from "lucide-react";

const PatientDetail = () => {
  const { id = "" } = useParams();
  const { data: patient } = useQuery({ queryKey: ["scan_patient", id], queryFn: () => fetchPatient(id) });
  const { data: scans = [] } = useQuery({ queryKey: ["scan_patient_scans", id], queryFn: () => fetchPatientScans(id) });

  if (!patient) return <ScanLayout><p className="text-sm text-muted-foreground">Loading…</p></ScanLayout>;

  return (
    <ScanLayout>
      <div className="space-y-5">
        <Link to="/scan-dashboard/patients" className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to patients</Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{patient.full_name}</h1>
            <p className="text-sm text-muted-foreground">{patient.mrn} · {patient.gender ?? "—"} · {patient.age ?? "—"}y</p>
          </div>
          <Button asChild>
            <Link to={`/scan-dashboard/register?patient=${patient.id}`}><Plus className="h-4 w-4 mr-1" /> New Scan</Link>
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Card><CardContent className="p-4 text-sm space-y-1">
            <p><span className="text-muted-foreground">Phone: </span>{patient.phone ?? "—"}</p>
            <p><span className="text-muted-foreground">Email: </span>{patient.email ?? "—"}</p>
            <p><span className="text-muted-foreground">Address: </span>{patient.address ?? "—"}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-sm">
            <p className="text-muted-foreground mb-1">Notes</p>
            <p>{patient.notes ?? "—"}</p>
          </CardContent></Card>
        </div>
        <Card>
          <CardHeader><CardTitle className="text-base">Scan History ({scans.length})</CardTitle></CardHeader>
          <CardContent className="p-0 divide-y">
            {scans.length === 0 && <p className="p-6 text-sm text-muted-foreground text-center">No scans yet.</p>}
            {scans.map((s) => (
              <Link key={s.id} to={`/scan-dashboard/scans/${s.id}`} className="flex items-center justify-between p-4 hover:bg-muted">
                <div>
                  <p className="font-medium text-sm">{s.serial} · {s.scan_type}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(s.scan_date), "PP p")} {s.body_part ? `· ${s.body_part}` : ""}</p>
                </div>
                <div className="flex items-center gap-2">
                  {s.urgent && <Badge variant="destructive">Urgent</Badge>}
                  <Badge variant={s.status === "Approved" ? "default" : "secondary"}>{s.status}</Badge>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </ScanLayout>
  );
};
export default PatientDetail;
