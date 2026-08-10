import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Save, CheckCircle2, FileText, AlertTriangle, Loader2, Printer, ShieldCheck, Trash2, Unlock, Lock } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { LAB_SECTIONS, LabField, TestStatus } from "@/lib/labCatalog";
import { isOutOfRange } from "@/lib/labValidation";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ReportPreview } from "@/components/dashboard/ReportPreview";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTestForm, updateTestFormResults, DbTestForm } from "@/lib/supabaseQueries";
import { toast } from "sonner";
import { fetchLabTests, LabTest, testValueKey } from "@/lib/labTests";
import { templateFor, fieldKey, TemplateField } from "@/lib/testTemplates";
import { approveResult, deleteTestForm, reopenApprovedResult } from "@/lib/resultAdmin";

const ResultEntry = () => {
  const { serial } = useParams();
  const navigate = useNavigate();
  const { profile, user, isLabAdmin } = useAuth();
  const queryClient = useQueryClient();

  const { data: form, isLoading } = useQuery({
    queryKey: ["test_form", serial],
    queryFn: () => fetchTestForm(serial ?? ""),
    enabled: !!serial,
  });

  const { data: labTests = [] } = useQuery({ queryKey: ["lab_tests"], queryFn: fetchLabTests });

  const [values, setValues] = useState<Record<string, string>>({});
  const [adminReason, setAdminReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [autoSavedAt, setAutoSavedAt] = useState<Date | null>(null);
  const draftKey = `result-draft:${serial ?? ""}`;

  // Init values from form results, preferring newer localStorage draft
  useEffect(() => {
    if (form && !initialized) {
      const dbVals = (form.results as Record<string, string>) ?? {};
      try {
        const raw = localStorage.getItem(draftKey);
        if (raw) {
          const parsed = JSON.parse(raw) as { savedAt: string; values: Record<string, string> };
          const dbUpdated = new Date(form.updated_at).getTime();
          if (new Date(parsed.savedAt).getTime() > dbUpdated) {
            setValues({ ...dbVals, ...parsed.values });
            toast.info("Restored unsaved draft from this device");
            setInitialized(true);
            return;
          }
        }
      } catch {
        /* ignore */
      }
      setValues(dbVals);
      setInitialized(true);
    }
  }, [form, initialized, draftKey]);

  // Auto-save draft to localStorage (debounced)
  useEffect(() => {
    if (!initialized || !serial) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify({ savedAt: new Date().toISOString(), values }));
        setAutoSavedAt(new Date());
      } catch {
        /* quota — ignore */
      }
    }, 800);
    return () => clearTimeout(t);
  }, [values, initialized, serial, draftKey]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </DashboardLayout>
    );
  }

  if (!form) {
    return (
      <DashboardLayout>
        <Card className="max-w-md mx-auto mt-12">
          <CardContent className="text-center py-10">
            <p className="text-muted-foreground">Test form not found.</p>
            <Button asChild variant="soft" className="mt-4"><Link to="/dashboard/forms">Back to Forms</Link></Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const setVal = (k: string, v: string) => {
    setValues((prev) => ({ ...prev, [k]: v }));
  };

  const requestedNames = (form.tests_requested ?? []).map((t) => t.toLowerCase().trim());
  const requestedTests: LabTest[] = labTests.filter(
    (t) => t.active && requestedNames.some((n) => n === t.name.toLowerCase().trim() || n.includes(t.name.toLowerCase().trim())),
  );
  const testTemplates = requestedTests.map((t) => ({ test: t, fields: templateFor(t) }));
  const dynamicRows = testTemplates.flatMap(({ test, fields }) =>
    fields.map((f) => ({
      key: fieldKey(test, f),
      label: fields.length > 1 ? `${test.name} — ${f.label}` : test.name,
      unit: f.unit ?? null,
      range: f.range ?? null,
    })),
  );

  const isApproved = form.approval_status === "Approved";
  const locked = isApproved && !isLabAdmin;

  const filledCount = Object.values(values).filter((v) => v && v.trim() !== "").length;
  const outOfRangeCount = LAB_SECTIONS.flatMap((s) => s.fields).filter((f) => isOutOfRange(f, values[f.key] ?? "")).length;

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await updateTestFormResults(form.serial, values, form.status === "Pending" ? "Processing" : undefined);
      queryClient.invalidateQueries({ queryKey: ["test_forms"] });
      queryClient.invalidateQueries({ queryKey: ["test_form", serial] });
      try { localStorage.removeItem(draftKey); } catch { /* ignore */ }
      toast.success("Draft saved", { description: `${filledCount} field${filledCount === 1 ? "" : "s"} stored.` });
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await updateTestFormResults(form.serial, values, "Completed");
      queryClient.invalidateQueries({ queryKey: ["test_forms"] });
      try { localStorage.removeItem(draftKey); } catch { /* ignore */ }
      toast.success("Test marked as Completed", {
        description: `Patient can download using serial ${form.serial}.`,
      });
      setTimeout(() => navigate("/dashboard/completed"), 600);
    } catch (err: any) {
      toast.error(err.message || "Failed to complete");
    } finally {
      setSaving(false);
    }
  };

  const adminUser = { id: user?.id ?? "", name: profile?.display_name ?? null };

  const handleApprove = async () => {
    setSaving(true);
    try {
      await updateTestFormResults(form.serial, values);
      await approveResult({ id: form.id, serial: form.serial }, adminUser);
      queryClient.invalidateQueries({ queryKey: ["test_forms"] });
      queryClient.invalidateQueries({ queryKey: ["test_form", serial] });
      toast.success("Result approved");
    } catch (err: any) {
      toast.error(err.message || "Failed to approve");
    } finally { setSaving(false); }
  };

  const handleReopen = async () => {
    setSaving(true);
    try {
      await reopenApprovedResult({ id: form.id, serial: form.serial }, adminUser, adminReason);
      queryClient.invalidateQueries({ queryKey: ["test_form", serial] });
      queryClient.invalidateQueries({ queryKey: ["test_forms"] });
      setAdminReason("");
      toast.success("Result reopened for editing");
    } catch (err: any) {
      toast.error(err.message || "Failed to reopen");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteTestForm({ id: form.id, serial: form.serial }, adminUser, adminReason);
      queryClient.invalidateQueries({ queryKey: ["test_forms"] });
      toast.success("Result deleted");
      navigate("/dashboard/forms");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    } finally { setSaving(false); }
  };

  // Adapt DbTestForm to the shape ReportPreview expects
  const formForPreview = {
    serial: form.serial,
    patientName: form.patient_name,
    age: form.age,
    gender: form.gender as "Male" | "Female",
    phone: form.phone ?? "",
    referredBy: form.referred_by,
    dateCollected: form.date_collected,
    natureOfSpecimen: form.nature_of_specimen,
    examinationRequired: form.examination_required ?? "",
    testsRequested: form.tests_requested,
    clinicalNotes: form.clinical_notes ?? undefined,
    bill: form.bill as "Patient" | "Clinic" | "Company",
    status: form.status as TestStatus,
    results: form.results as Record<string, string>,
  };

  return (
    <DashboardLayout>
      <div className="mb-5 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <Button asChild variant="ghost" size="icon"><Link to="/dashboard/forms"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold truncate">Result Entry · {form.patient_name}</h1>
            <p className="text-xs text-muted-foreground font-mono">{form.serial}</p>
          </div>
        </div>
        <StatusBadge status={form.status as TestStatus} />
      </div>

      <div className="mb-3 flex justify-end no-print">
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Print Report
        </Button>
      </div>

      {/* Test Form Info */}
      <Card className="mb-5 border-border/60 shadow-soft bg-primary-soft/40">
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2 text-primary">
          <FileText className="h-4 w-4" /> Test Form Information
        </CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3 text-sm">
          <Info label="Serial Number" value={form.serial} mono />
          <Info label="Patient Name" value={form.patient_name} />
          <Info label="Age" value={`${form.age} yrs`} />
          <Info label="Gender" value={form.gender} />
          <Info label="Referring Doctor" value={form.referred_by} />
          <Info label="Phone" value={form.phone ?? "—"} />
          <Info label="Date Collected" value={new Date(form.date_collected).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })} />
          <Info label="Bill" value={form.bill} />
          <div className="col-span-2 md:col-span-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Tests Requested</p>
            <div className="flex flex-wrap gap-1.5">
              {form.tests_requested.map((t) => <Badge key={t} variant="secondary" className="font-normal">{t}</Badge>)}
            </div>
          </div>
          {form.clinical_notes && (
            <div className="col-span-2 md:col-span-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Clinical Notes</p>
              <p className="text-sm text-foreground/80">{form.clinical_notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid xl:grid-cols-2 gap-5">
        {/* Result Entry Form */}
        <Card className="border-border/60 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm">Result Entry</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {filledCount} fields filled
                {outOfRangeCount > 0 && (
                  <span className="ml-2 text-amber-700 font-medium inline-flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> {outOfRangeCount} out of range
                  </span>
                )}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {testTemplates.length > 0 && (
              <div className="mb-4 space-y-3">
                <p className="text-sm font-semibold">Requested Tests</p>
                {testTemplates.map(({ test, fields }) => (
                  <div key={test.id} className="rounded-xl border border-primary/30 bg-primary-soft/30 p-3">
                    <p className="text-xs font-semibold text-primary mb-3">
                      {test.name}
                      {fields.length > 1 && (
                        <span className="ml-2 font-normal text-muted-foreground">{fields.length} parameters</span>
                      )}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {fields.map((f) => (
                        <TemplateInput
                          key={f.key}
                          field={f}
                          value={values[fieldKey(test, f)] ?? ""}
                          disabled={locked}
                          onChange={(v) => setVal(fieldKey(test, f), v)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Accordion type="multiple" defaultValue={["haematology", "chemPath"]} className="space-y-2">
              {LAB_SECTIONS.map((section) => {
                const sectionFilled = section.fields.filter((f) => values[f.key] && values[f.key].trim() !== "").length;
                return (
                  <AccordionItem key={section.id} value={section.id} className="border border-border rounded-xl px-3 data-[state=open]:bg-muted/30">
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <span>{section.title}</span>
                        {sectionFilled > 0 && (
                          <Badge variant="secondary" className="rounded-full text-[10px] h-5">
                            {sectionFilled}/{section.fields.length}
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      {section.layout === "antigen-table" && section.antigenRows ? (
                        <div className="space-y-2">
                          <div className="overflow-x-auto rounded-lg border border-border">
                            <table className="w-full text-sm">
                              <thead className="bg-muted/40">
                                <tr>
                                  <th className="text-left font-semibold px-3 py-2 text-foreground/80">Antigen</th>
                                  <th className="text-left font-semibold px-3 py-2 text-foreground/80 w-[28%]">'O'</th>
                                  <th className="text-left font-semibold px-3 py-2 text-foreground/80 w-[28%]">'H'</th>
                                </tr>
                              </thead>
                              <tbody>
                                {section.antigenRows.map((row) => (
                                  <tr key={row.label} className="border-t border-border">
                                    <td className="px-3 py-2 text-foreground/90">{row.label}</td>
                                    <td className="px-2 py-1.5">
                                      <Input
                                        value={values[row.oKey] ?? ""}
                                        onChange={(e) => setVal(row.oKey, e.target.value)}
                                        placeholder="e.g. 1/80"
                                        className="h-8 text-sm"
                                      />
                                    </td>
                                    <td className="px-2 py-1.5">
                                      <Input
                                        value={values[row.hKey] ?? ""}
                                        onChange={(e) => setVal(row.hKey, e.target.value)}
                                        placeholder="e.g. 1/80"
                                        className="h-8 text-sm"
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {section.footnote && (
                            <p className="text-xs text-muted-foreground italic px-1">{section.footnote}</p>
                          )}
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-3">
                          {section.fields.map((f) => (
                            <FieldInput key={f.key} field={f} value={values[f.key] ?? ""} onChange={(v) => setVal(f.key, v)} />
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <div className="xl:sticky xl:top-20 xl:self-start">
          <Tabs defaultValue="preview">
            <div className="flex items-center justify-between mb-2">
              <TabsList>
                <TabsTrigger value="preview">Live Report Preview</TabsTrigger>
              </TabsList>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">As patient will see</p>
            </div>
            <TabsContent value="preview" className="mt-0">
              <ReportPreview form={formForPreview} values={values} scientistName={profile?.display_name ?? undefined} dynamicRows={dynamicRows} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 -mx-4 lg:-mx-8 mt-6 px-4 lg:px-8 py-3 bg-card/95 backdrop-blur-md border-t border-border flex flex-wrap items-center justify-between gap-3 z-20">
        <p className="text-xs text-muted-foreground">
          {filledCount === 0 ? "No values entered yet" : `${filledCount} values entered`}
          {autoSavedAt && (
            <span className="ml-2 text-emerald-600">
              · Draft auto-saved {autoSavedAt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {isApproved && (
            <Badge variant="secondary" className="gap-1">
              {locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />} Approved
            </Badge>
          )}
          {isLabAdmin && (
            <>
              {!isApproved ? (
                <Button variant="soft" onClick={handleApprove} disabled={saving || filledCount === 0}>
                  <ShieldCheck className="h-4 w-4" /> Approve Result
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="soft" disabled={saving}><Unlock className="h-4 w-4" /> Edit Approved Result</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reopen this approved result?</AlertDialogTitle>
                      <AlertDialogDescription>
                        It returns to pending review so the mistake can be corrected. Give a short reason for the audit log.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input value={adminReason} onChange={(e) => setAdminReason(e.target.value)} placeholder="Reason (e.g. wrong PCV value)" />
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleReopen}>Reopen</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={saving}><Trash2 className="h-4 w-4 text-destructive" /> Delete Result</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this result permanently?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This removes the record for {form.patient_name} ({form.serial}). The action is logged.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Input value={adminReason} onChange={(e) => setAdminReason(e.target.value)} placeholder="Reason for deletion" />
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          <Button variant="outline" onClick={handleSaveDraft} disabled={saving || locked}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Draft
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="hero" disabled={filledCount === 0 || saving || locked}>
                <CheckCircle2 className="h-4 w-4" /> Mark as Completed
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Mark this test as Completed?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will finalise the report for <span className="font-semibold">{form.patient_name}</span> ({form.serial}).
                  The patient will be able to download the result immediately.
                  {outOfRangeCount > 0 && (
                    <span className="block mt-2 text-amber-700 font-medium">
                      ⚠ {outOfRangeCount} value(s) are outside reference range. Please double-check.
                    </span>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Review again</AlertDialogCancel>
                <AlertDialogAction onClick={handleComplete}>Yes, mark Completed</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </DashboardLayout>
  );
};

const Info = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div>
    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    <p className={`text-sm font-medium text-foreground ${mono ? "font-mono text-primary" : ""}`}>{value}</p>
  </div>
);

const FieldInput = ({ field, value, onChange }: { field: LabField; value: string; onChange: (v: string) => void }) => {
  return <FieldInputBody field={field} value={value} onChange={onChange} />;
};

const TemplateInput = ({
  field, value, onChange, disabled,
}: { field: TemplateField; value: string; onChange: (v: string) => void; disabled?: boolean }) => (
  <div className={`space-y-1 ${field.type === "textarea" ? "sm:col-span-2" : ""}`}>
    <div className="flex items-baseline justify-between gap-2">
      <Label className="text-xs font-medium text-foreground/80">
        {field.label}{field.unit ? ` (${field.unit})` : ""}
      </Label>
      {field.range && <span className="text-[10px] text-muted-foreground">Ref: {field.range}</span>}
    </div>
    {field.type === "textarea" ? (
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="min-h-[60px] text-sm" />
    ) : field.type === "select" ? (
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
        <SelectContent>
          {(field.options ?? []).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    ) : (
      <Input
        type={field.type === "number" ? "number" : "text"}
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-9 text-sm"
      />
    )}
  </div>
);

const FieldInputBody = ({ field, value, onChange }: { field: LabField; value: string; onChange: (v: string) => void }) => {
  const oor = isOutOfRange(field, value);
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2">
        <Label className="text-xs font-medium text-foreground/80">{field.label}</Label>
        {field.range && <span className="text-[10px] text-muted-foreground">Ref: {field.range}</span>}
      </div>
      <div className="relative">
        {field.type === "textarea" ? (
          <Textarea value={value} onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? "Enter observation…"}
            className="min-h-[60px] text-sm" />
        ) : field.type === "select" ? (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
            <SelectContent>
              {field.options!.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        ) : (
          <div className="relative">
            <Input
              type={field.type === "number" ? "number" : "text"}
              step="any"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder ?? "—"}
              className={`h-9 text-sm ${field.unit ? "pr-14" : ""} ${oor ? "border-amber-500 bg-amber-50 text-amber-900" : ""}`}
            />
            {field.unit && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium">
                {field.unit}
              </span>
            )}
          </div>
        )}
        {oor && (
          <p className="text-[10px] text-amber-700 font-medium mt-0.5 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Outside reference range
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultEntry;
