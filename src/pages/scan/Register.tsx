import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ScanLayout } from "@/components/scan/ScanLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  createAppointment,
  createPatient,
  createScan,
  fetchPatient,
  getNextMRN,
  getNextScanSerial,
  logActivity,
  SCAN_TYPES_BY_MODALITY,
  searchPatients,
  type ScanPatient,
} from "@/lib/scanQueries";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, Search, UserCheck, UserPlus } from "lucide-react";

const MODALITIES = Object.keys(SCAN_TYPES_BY_MODALITY);

const Register = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, profile } = useAuth();
  const [sp] = useSearchParams();
  const prefillId = sp.get("patient");

  // Patient state
  const [existing, setExisting] = useState<ScanPatient | null>(null);
  const [query, setQuery] = useState("");
  const [showMorePatient, setShowMorePatient] = useState(false);
  const [p, setP] = useState({ full_name: "", phone: "", age: "", gender: "Male", email: "", address: "", notes: "" });

  // Scan state
  const [showMoreScan, setShowMoreScan] = useState(false);
  const [s, setS] = useState({
    modality: "CT",
    scan_type: "Head",
    scan_type_other: "",
    body_part: "",
    urgent: false,
    clinical_indication: "",
    referring_doctor: "",
  });

  // Timing
  const [timing, setTiming] = useState<"now" | "later">("now");
  const [scheduled, setScheduled] = useState(new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16));

  // Prefill from ?patient=<id>
  useEffect(() => {
    if (!prefillId) return;
    fetchPatient(prefillId).then((pt) => { if (pt) setExisting(pt); });
  }, [prefillId]);

  const { data: matches = [] } = useQuery({
    queryKey: ["patient_search", query],
    queryFn: () => searchPatients(query),
    enabled: !existing && query.trim().length >= 2,
  });

  const scanTypeOptions = useMemo(() => SCAN_TYPES_BY_MODALITY[s.modality] ?? [], [s.modality]);
  useEffect(() => {
    if (scanTypeOptions.length && !scanTypeOptions.includes(s.scan_type) && s.scan_type !== "Other") {
      setS((v) => ({ ...v, scan_type: scanTypeOptions[0] }));
    }
  }, [scanTypeOptions]); // eslint-disable-line

  const finalScanType = s.scan_type === "Other" ? s.scan_type_other.trim() : s.scan_type;

  const mut = useMutation({
    mutationFn: async () => {
      // 1. Resolve patient
      let patientId = existing?.id ?? "";
      let patientName = existing?.full_name ?? "";
      let patientPhone = existing?.phone ?? "";
      if (!patientId) {
        const mrn = await getNextMRN();
        const created = await createPatient({
          mrn,
          full_name: p.full_name.trim(),
          age: p.age ? Number(p.age) : null,
          gender: p.gender,
          phone: p.phone.trim() || null,
          email: p.email.trim() || null,
          address: p.address.trim() || null,
          notes: p.notes.trim() || null,
          created_by: user?.id ?? null,
        });
        patientId = created.id;
        patientName = created.full_name;
        patientPhone = created.phone ?? "";
      }

      // 2. Create scan
      const scanDate = timing === "now" ? new Date().toISOString() : new Date(scheduled).toISOString();
      const serial = await getNextScanSerial();
      const scan = await createScan({
        serial,
        patient_id: patientId,
        scan_type: finalScanType,
        modality: s.modality,
        body_part: s.body_part.trim() || null,
        clinical_indication: s.clinical_indication.trim() || null,
        referring_doctor: s.referring_doctor.trim() || null,
        urgent: s.urgent,
        scan_date: scanDate,
        status: "Pending",
        created_by: user?.id ?? null,
      });
      await logActivity(scan.id, existing ? "Scan created (existing patient)" : "Patient registered & scan created", user?.id ?? null, profile?.display_name ?? null);

      // 3. Optional appointment
      if (timing === "later") {
        await createAppointment({
          patient_id: patientId,
          patient_name: patientName,
          patient_phone: patientPhone || null,
          scan_type: finalScanType,
          scheduled_at: scanDate,
          notes: s.clinical_indication.trim() || null,
          created_by: user?.id ?? null,
        });
      }
      return scan;
    },
    onSuccess: (scan) => {
      qc.invalidateQueries({ queryKey: ["scans"] });
      qc.invalidateQueries({ queryKey: ["scan_patients"] });
      qc.invalidateQueries({ queryKey: ["scan_appointments"] });
      toast({ title: "Registered", description: `${scan.serial} created.` });
      navigate(`/scan-dashboard/scans/${scan.id}`);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const patientReady = !!existing || (p.full_name.trim().length > 1);
  const scanReady = !!s.modality && !!finalScanType;
  const canSubmit = patientReady && scanReady && !mut.isPending;

  return (
    <ScanLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Register</h1>
          <p className="text-sm text-muted-foreground">Add a patient and scan in one step.</p>
        </div>

        {/* 1. Patient */}
        <Card>
          <CardContent className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">1. Patient</h2>
              {existing && (
                <Button variant="ghost" size="sm" onClick={() => { setExisting(null); setQuery(""); }}>Change</Button>
              )}
            </div>

            {existing ? (
              <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
                <UserCheck className="h-5 w-5 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{existing.full_name}</p>
                  <p className="text-xs text-muted-foreground">{existing.mrn} · {existing.gender ?? "—"} · {existing.age ?? "—"}y · {existing.phone ?? "—"}</p>
                </div>
                <Badge variant="secondary">Existing</Badge>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, phone, or MRN…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9"
                  />
                  {matches.length > 0 && (
                    <div className="absolute z-10 left-0 right-0 mt-1 rounded-lg border bg-popover shadow-lg divide-y max-h-64 overflow-auto">
                      {matches.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => { setExisting(m); setQuery(""); }}
                          className="w-full text-left p-3 hover:bg-muted"
                        >
                          <p className="text-sm font-medium truncate">{m.full_name}</p>
                          <p className="text-xs text-muted-foreground">{m.mrn} · {m.phone ?? "—"} · {m.age ?? "—"}y</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <UserPlus className="h-3.5 w-3.5" /> Or enter new patient
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <Label>Full name *</Label>
                    <Input value={p.full_name} onChange={(e) => setP({ ...p, full_name: e.target.value })} maxLength={120} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={p.phone} onChange={(e) => setP({ ...p, phone: e.target.value })} maxLength={40} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Age</Label>
                      <Input type="number" min={0} max={150} value={p.age} onChange={(e) => setP({ ...p, age: e.target.value })} />
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <Select value={p.gender} onValueChange={(v) => setP({ ...p, gender: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <button type="button" onClick={() => setShowMorePatient((v) => !v)} className="text-xs text-primary inline-flex items-center gap-1">
                  {showMorePatient ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  {showMorePatient ? "Less" : "More"} details
                </button>
                {showMorePatient && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div><Label>Email</Label><Input value={p.email} onChange={(e) => setP({ ...p, email: e.target.value })} maxLength={255} /></div>
                    <div><Label>Address</Label><Input value={p.address} onChange={(e) => setP({ ...p, address: e.target.value })} maxLength={255} /></div>
                    <div className="sm:col-span-2"><Label>Notes</Label><Input value={p.notes} onChange={(e) => setP({ ...p, notes: e.target.value })} maxLength={500} /></div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* 2. Scan */}
        <Card>
          <CardContent className="p-4 sm:p-5 space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">2. Scan</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Modality *</Label>
                <Select value={s.modality} onValueChange={(v) => setS({ ...s, modality: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MODALITIES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Scan type *</Label>
                <Select value={s.scan_type} onValueChange={(v) => setS({ ...s, scan_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {scanTypeOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    <SelectItem value="Other">Other…</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {s.scan_type === "Other" && (
                <div className="sm:col-span-2">
                  <Label>Custom scan type *</Label>
                  <Input value={s.scan_type_other} onChange={(e) => setS({ ...s, scan_type_other: e.target.value })} maxLength={80} />
                </div>
              )}
              <div>
                <Label>Body part</Label>
                <Input value={s.body_part} onChange={(e) => setS({ ...s, body_part: e.target.value })} maxLength={80} />
              </div>
              <label className="flex items-end gap-2 text-sm pb-2">
                <Checkbox checked={s.urgent} onCheckedChange={(c) => setS({ ...s, urgent: !!c })} />
                Mark as urgent
              </label>
            </div>

            <button type="button" onClick={() => setShowMoreScan((v) => !v)} className="text-xs text-primary inline-flex items-center gap-1">
              {showMoreScan ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {showMoreScan ? "Less" : "More"} clinical info
            </button>
            {showMoreScan && (
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2"><Label>Clinical indication</Label><Input value={s.clinical_indication} onChange={(e) => setS({ ...s, clinical_indication: e.target.value })} maxLength={500} /></div>
                <div className="sm:col-span-2"><Label>Referring doctor</Label><Input value={s.referring_doctor} onChange={(e) => setS({ ...s, referring_doctor: e.target.value })} maxLength={120} /></div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 3. Timing */}
        <Card>
          <CardContent className="p-4 sm:p-5 space-y-3">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">3. Timing</h2>
            <RadioGroup value={timing} onValueChange={(v) => setTiming(v as "now" | "later")} className="flex gap-6">
              <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="now" /> Walk-in now</label>
              <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="later" /> Schedule for later</label>
            </RadioGroup>
            {timing === "later" && (
              <div>
                <Label>Date & time</Label>
                <Input type="datetime-local" value={scheduled} onChange={(e) => setScheduled(e.target.value)} />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 pb-4">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={() => mut.mutate()} disabled={!canSubmit} size="lg">
            {mut.isPending ? "Saving…" : timing === "later" ? "Schedule & open" : "Register & open scan"}
          </Button>
        </div>
      </div>
    </ScanLayout>
  );
};

export default Register;
