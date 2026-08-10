import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScanLayout } from "@/components/scan/ScanLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchScan, fetchPatient, updateScan, fetchScanImages, uploadScanImage, deleteScanImage, getSignedImageUrl, logActivity, type ScanImage } from "@/lib/scanQueries";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ArrowLeft, Upload, Trash2, CheckCircle2, Printer, Download, AlertTriangle, Heart, FlaskConical, ScanLine, Activity, Globe, Phone, MapPin, Clock, Leaf, FileText } from "lucide-react";
import { getScanTemplate, hasScanTemplate } from "@/lib/scanTemplates";
import logo from "@/assets/logo.png";
import { SITE } from "@/lib/site";

const ImageThumb = ({ img, onDelete }: { img: ScanImage; onDelete: () => void }) => {
  const [url, setUrl] = useState<string>("");
  useEffect(() => { getSignedImageUrl(img.storage_path).then(setUrl).catch(() => {}); }, [img.storage_path]);
  return (
    <div className="relative group rounded-lg overflow-hidden border bg-muted aspect-square">
      {url && <img src={url} alt={img.caption ?? ""} className="w-full h-full object-cover" />}
      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <a href={url} download target="_blank" rel="noreferrer" className="text-white text-xs"><Download className="h-4 w-4" /></a>
        <button onClick={onDelete} className="text-white"><Trash2 className="h-4 w-4" /></button>
      </div>
    </div>
  );
};

const ScanDetail = () => {
  const { id = "" } = useParams();
  const qc = useQueryClient();
  const { user, profile } = useAuth();
  const { data: scan } = useQuery({ queryKey: ["scan", id], queryFn: () => fetchScan(id) });
  const { data: images = [] } = useQuery({ queryKey: ["scan_images", id], queryFn: () => fetchScanImages(id) });
  const { data: patient } = useQuery({ queryKey: ["scan_patient", scan?.patient_id], queryFn: () => fetchPatient(scan!.patient_id), enabled: !!scan?.patient_id });

  const radiologistId = scan?.approved_by ?? scan?.reported_by ?? null;
  const { data: radiologist } = useQuery({
    queryKey: ["profile_name", radiologistId],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("display_name,role").eq("user_id", radiologistId!).maybeSingle();
      return data as { display_name: string | null; role: string | null } | null;
    },
    enabled: !!radiologistId,
  });

  const [report, setReport] = useState({ findings: "", impression: "", recommendation: "", report_text: "", urgent: false });
  useEffect(() => {
    if (scan) setReport({ findings: scan.findings ?? "", impression: scan.impression ?? "", recommendation: scan.recommendation ?? "", report_text: scan.report_text ?? "", urgent: scan.urgent });
  }, [scan?.id]);

  const saveMut = useMutation({
    mutationFn: async (status?: string) => {
      const patch: any = { ...report };
      if (status === "Reported") { patch.status = "Reported"; patch.reported_at = new Date().toISOString(); patch.reported_by = user?.id ?? null; }
      if (status === "Approved") { patch.status = "Approved"; patch.approved_at = new Date().toISOString(); patch.approved_by = user?.id ?? null; }
      const updated = await updateScan(id, patch);
      await logActivity(id, status ? `Report ${status.toLowerCase()}` : "Report saved", user?.id ?? null, profile?.display_name ?? null);
      return updated;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["scan", id] }); qc.invalidateQueries({ queryKey: ["scans"] }); toast({ title: "Saved" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const upMut = useMutation({
    mutationFn: async (files: FileList) => {
      for (const f of Array.from(files)) await uploadScanImage(id, f, null, user?.id ?? null);
      await logActivity(id, `Uploaded ${files.length} image(s)`, user?.id ?? null, profile?.display_name ?? null);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["scan_images", id] }); toast({ title: "Uploaded" }); },
    onError: (e: any) => toast({ title: "Upload failed", description: e.message, variant: "destructive" }),
  });
  const delMut = useMutation({
    mutationFn: async (img: ScanImage) => deleteScanImage(img),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scan_images", id] }),
  });

  if (!scan) return <ScanLayout><p className="text-sm text-muted-foreground">Loading…</p></ScanLayout>;

  const reportTypeLabel = scan?.scan_type ? `${scan.scan_type} Report` : "Ultrasound Report";

  return (
    <ScanLayout>
      <div className="space-y-5 print:space-y-3 print-document">
        <div className="print:hidden">
          <Link to="/scan-dashboard/scans" className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back</Link>
        </div>

        {/* Print header — letterhead */}
        <div className="hidden print:block mb-4">
          <div className="text-right text-[10px] text-slate-600 mb-1">
            RC {SITE.rcNumber} | TIN {SITE.tin}
          </div>
          <div className="flex items-start gap-4">
            <div className="shrink-0 flex flex-col items-center">
              <img src={logo} alt="Medvic Goodhealth" className="h-16 w-auto" crossOrigin="anonymous" />
              <p className="text-[9px] text-primary mt-1 font-medium italic text-center">{SITE.tagline}</p>
            </div>
            <div className="w-px bg-primary self-stretch mx-1" />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-primary uppercase tracking-wide">Medvic Goodhealth Services</h2>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5 text-[10px] text-slate-700">
                <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-primary" /> Healthcare</span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1"><FlaskConical className="h-3 w-3 text-primary" /> Laboratory</span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1"><ScanLine className="h-3 w-3 text-primary" /> Ultrasound Scan</span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1"><Activity className="h-3 w-3 text-primary" /> ECG</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-[10px] text-slate-600">
                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3 text-primary shrink-0" /> <span>Website: medvic.com.ng</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-primary shrink-0" /> <span>Phone: {SITE.phones[0].replace(/\s/g, "")}</span>
                </div>
                <div className="flex items-start gap-1">
                  <MapPin className="h-3 w-3 text-primary shrink-0 mt-0.5" /> <span>Address: Plot 1, Road 4, Udo Layout, Rumuokwachi</span>
                </div>
                <div className="flex items-start gap-1">
                  <Clock className="h-3 w-3 text-primary shrink-0 mt-0.5" /> <span>Time of Service: Mon – Sat: 8:00 AM – 9:00 PM</span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-0.5 bg-primary mt-3 mb-3" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px bg-primary w-16" />
              <h1 className="text-base font-bold text-primary uppercase tracking-wider">{reportTypeLabel}</h1>
              <div className="h-px bg-primary w-16" />
            </div>
            <Leaf className="h-4 w-4 mx-auto mt-1 text-primary" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-semibold print:text-sm">{scan.serial}</h1>
              {scan.urgent && <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> Urgent</Badge>}
              <Badge variant={scan.status === "Approved" ? "default" : "secondary"}>{scan.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{scan.scan_type} · {scan.modality ?? "—"} · {scan.body_part ?? "—"} · {format(new Date(scan.scan_date), "PP p")}</p>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4 mr-1" /> Print / PDF</Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 print:grid-cols-1">
          <Card className="lg:col-span-2"><CardContent className="p-4 text-sm space-y-1">
            <p className="font-semibold text-base"><span className="text-muted-foreground text-xs font-normal">Patient Name: </span>{patient?.full_name ?? "—"}</p>
            <p className="text-muted-foreground">{patient?.mrn} · {patient?.gender ?? "—"} · {patient?.age ?? "—"}y · {patient?.phone ?? "—"}</p>
            <p className="mt-2"><span className="text-muted-foreground">Clinical Indication: </span>{scan.clinical_indication ?? "—"}</p>
            <p><span className="text-muted-foreground">Referring Doctor: </span>{scan.referring_doctor ?? "—"}</p>
          </CardContent></Card>
          <Card className="print:hidden"><CardContent className="p-4 text-xs text-muted-foreground space-y-1">
            <p>Created: {format(new Date(scan.created_at), "PP p")}</p>
            <p>Reported: {scan.reported_at ? format(new Date(scan.reported_at), "PP p") : "—"}</p>
            <p>Approved: {scan.approved_at ? format(new Date(scan.approved_at), "PP p") : "—"}</p>
          </CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between print:hidden"><CardTitle className="text-base">Images ({images.length})</CardTitle>
            <label className="cursor-pointer">
              <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && upMut.mutate(e.target.files)} />
              <span className="inline-flex items-center gap-1 text-sm px-3 py-1.5 border rounded-md hover:bg-muted"><Upload className="h-4 w-4" /> Upload</span>
            </label>
          </CardHeader>
          <CardContent>
            {images.length === 0 ? <p className="text-sm text-muted-foreground">No images uploaded.</p> :
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {images.map((img) => <ImageThumb key={img.id} img={img} onDelete={() => delMut.mutate(img)} />)}
              </div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 flex-wrap">
            <CardTitle className="text-base">Report</CardTitle>
            {hasScanTemplate(scan.modality, scan.scan_type) && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="print:hidden"
                onClick={() => {
                  const tpl = getScanTemplate(scan.modality, scan.scan_type);
                  if (!tpl) return;
                  const hasContent = report.findings.trim() || report.impression.trim() || report.recommendation.trim();
                  if (hasContent && !window.confirm("Replace current report text with the template?")) return;
                  setReport((r) => ({ ...r, findings: tpl.findings, impression: tpl.impression, recommendation: tpl.recommendation }));
                  toast({ title: "Template loaded", description: `${scan.scan_type} template — edit as needed.` });
                }}
              >
                <FileText className="h-4 w-4 mr-1" /> Load {scan.scan_type} template
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Findings</label>
              <Textarea className="print:hidden" rows={4} value={report.findings} onChange={(e) => setReport({ ...report, findings: e.target.value })} />
              <div className="hidden print:block whitespace-pre-wrap text-sm leading-relaxed">{report.findings || "—"}</div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Impression</label>
              <Textarea className="print:hidden" rows={3} value={report.impression} onChange={(e) => setReport({ ...report, impression: e.target.value })} />
              <div className="hidden print:block whitespace-pre-wrap text-sm leading-relaxed">{report.impression || "—"}</div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Recommendation</label>
              <Textarea className="print:hidden" rows={2} value={report.recommendation} onChange={(e) => setReport({ ...report, recommendation: e.target.value })} />
              <div className="hidden print:block whitespace-pre-wrap text-sm leading-relaxed">{report.recommendation || "—"}</div>
            </div>
            <div className="print:hidden"><label className="text-xs font-medium text-muted-foreground">Additional Notes</label><Textarea rows={2} value={report.report_text} onChange={(e) => setReport({ ...report, report_text: e.target.value })} /></div>
            <label className="flex items-center gap-2 text-sm print:hidden"><Checkbox checked={report.urgent} onCheckedChange={(c) => setReport({ ...report, urgent: !!c })} /> Urgent case</label>
            <div className="flex flex-wrap gap-2 pt-2 print:hidden">
              <Button variant="outline" onClick={() => saveMut.mutate(undefined)}>Save Draft</Button>
              <Button onClick={() => saveMut.mutate("Reported")}>Mark Reported</Button>
              <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => saveMut.mutate("Approved")}><CheckCircle2 className="h-4 w-4 mr-1" /> Approve</Button>
            </div>
          </CardContent>
        </Card>

        {/* Radiologist signature — visible on screen and print */}
        <div className="pt-6 mt-4 print:mt-8">
          <div className="flex justify-end">
            <div className="text-sm">
              <div className="border-b border-foreground/60 w-64 mb-1 h-8" />
              <p className="font-semibold">Radiologist</p>
              {scan.approved_at && <p className="text-xs text-muted-foreground mt-1">Approved: {format(new Date(scan.approved_at), "PP p")}</p>}
            </div>
          </div>
        </div>
      </div>
    </ScanLayout>
  );
};
export default ScanDetail;
