import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, ListChecks, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createTestForm, getNextSerial } from "@/lib/supabaseQueries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLabTests, fetchTestCategories } from "@/lib/labTests";
import { toast } from "sonner";

// Source of truth: MEDVIC_LAB_TEST_FORM.pdf (Page 2). Order, wording, and
// punctuation are matched exactly to the printed form. Do not reword.
const TEST_GROUPS: Record<string, string[]> = {
  Hematology: [
    "Full Blood Count (FBC)",
    "Packed Cell Volume (PCV)",
    "Blood Group",
    "Genotype",
    "Platelet Count",
    "Prothrombin Time",
    "Bleeding Time",
    "Clotting Time",
    "Hepatitis Screening",
    "Retroviral Screening (HIV 1&2)",
    "Syphilis Screening (VDRL)",
    "Pregnancy Test",
  ],
  "Chemical Pathology": [
    "Fasting Blood Sugar",
    "Random Blood Sugar",
    "Liver Function Test",
    "Kidney Function Test",
    "Lipid Profile Test",
    "Calcium Test",
    "Uric Acid Test",
    "Bicarbonate Test",
    "Female Hormone Profile",
    "Male Hormone Profile",
    "Luteinizing Hormone (LH)",
    "Follicle Stimulating Hormone (FSH)",
    "Prolactin",
    "Progesterone",
    "Estradiol (E2)",
    "Testosterone",
    "Thyroid Function test",
    "HbA1c",
  ],
  "Medical Microbiology": [
    "Malaria Test",
    "Widal Test",
    "Urine Microscopy",
    "Urine Culture",
    "High Vaginal Swab (HVS)/Endocervical Swab (ECS)",
    "Urethral Swab",
    "Stool Analysis",
    "Stool Culture",
    "Sputum Culture",
    "Semen Analysis",
    "Helicobacter Pylori",
    "Fecal Occult Blood",
    "Microfilaria",
    "Semen Culture",
    "Urine Analysis",
    "Eye Swab",
    "Wound Swab",
    "Ear Swab",
  ],
};

const NewTestForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: dbCategories = [] } = useQuery({ queryKey: ["test_categories"], queryFn: fetchTestCategories });
  const { data: dbTests = [] } = useQuery({ queryKey: ["lab_tests"], queryFn: fetchLabTests });

  const testGroups: Record<string, string[]> = (() => {
    const active = dbTests.filter((t) => t.active);
    if (active.length === 0) return TEST_GROUPS;
    const groups: Record<string, string[]> = {};
    const catName = (id: string | null) => dbCategories.find((c) => c.id === id)?.name ?? "Other Tests";
    [...active]
      .sort((a, b) => a.sort_order - b.sort_order)
      .forEach((t) => {
        const g = catName(t.category_id);
        (groups[g] ||= []).push(t.name);
      });
    return groups;
  })();

  const [saving, setSaving] = useState(false);
  const [suggestedSerial, setSuggestedSerial] = useState("");

  useEffect(() => {
    getNextSerial().then(setSuggestedSerial);
  }, []);

  const [form, setForm] = useState({
    serial: "",
    patientName: "",
    age: "",
    gender: "Male" as "Male" | "Female",
    phone: "",
    email: "",
    hmoId: "",
    referredBy: "",
    doctorPhone: "",
    institution: "",
    dateCollected: new Date().toISOString().slice(0, 10),
    natureOfSpecimen: "",
    examinationRequired: "",
    clinicalNotes: "",
    bill: "Patient" as "Patient" | "Clinic" | "Company",
  });
  const [tests, setTests] = useState<string[]>([]);

  // Set serial once loaded
  useEffect(() => {
    if (suggestedSerial && !form.serial) {
      setForm((p) => ({ ...p, serial: suggestedSerial }));
    }
  }, [suggestedSerial]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const toggleTest = (t: string) =>
    setTests((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  const onSubmit = (openAfter: boolean) => async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientName.trim() || !form.age || tests.length === 0) {
      toast.error("Please fill patient name, age, and select at least one test.");
      return;
    }
    setSaving(true);
    try {
      const created = await createTestForm({
        serial: form.serial || suggestedSerial,
        patient_name: form.patientName.trim(),
        age: parseInt(form.age, 10),
        gender: form.gender,
        phone: form.phone,
        email: form.email || undefined,
        referred_by: form.referredBy || "—",
        doctor_phone: form.doctorPhone || undefined,
        institution: form.institution || undefined,
        nature_of_specimen: form.natureOfSpecimen || "—",
        examination_required: form.examinationRequired || tests.join(", "),
        tests_requested: tests,
        clinical_notes: [
          form.hmoId ? `HMO ID No: ${form.hmoId}` : "",
          form.dateCollected ? `Date: ${form.dateCollected}` : "",
          form.clinicalNotes,
        ].filter(Boolean).join("\n") || undefined,
        bill: form.bill,
        created_by: user?.id,
      });
      queryClient.invalidateQueries({ queryKey: ["test_forms"] });
      toast.success("Test form created", { description: `Serial: ${created.serial}` });
      navigate(openAfter ? `/dashboard/forms/${created.serial}` : "/dashboard/forms");
    } catch (err: any) {
      toast.error(err.message || "Failed to create form");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-5 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link to="/dashboard/forms"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">New Test Form</h1>
          <p className="text-xs text-muted-foreground">Register a new patient visit and request lab investigations</p>
        </div>
      </div>

      <form className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="border-border/60 shadow-soft">
            <CardHeader className="pb-3"><CardTitle className="text-sm">Patient Information</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Label>Serial Number</Label>
                <Input value={form.serial} onChange={(e) => set("serial", e.target.value)} className="font-mono" />
                <p className="text-[10px] text-muted-foreground mt-1">Auto-generated. Edit only if needed.</p>
              </div>
              <div className="sm:col-span-2">
                <Label>Patient Full Name *</Label>
                <Input value={form.patientName} onChange={(e) => set("patientName", e.target.value)} placeholder="Surname Other names" />
              </div>
              <div>
                <Label>Age *</Label>
                <Input type="number" value={form.age} onChange={(e) => set("age", e.target.value)} placeholder="e.g. 32" />
              </div>
              <div>
                <Label>Gender</Label>
                <Select value={form.gender} onValueChange={(v) => set("gender", v as "Male" | "Female")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+234…" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div>
                <Label>HMO ID No</Label>
                <Input
                  value={form.hmoId}
                  onChange={(e) => set("hmoId", e.target.value)}
                  placeholder="e.g. HMO-23456"
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={form.dateCollected}
                  onChange={(e) => set("dateCollected", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Health Institution & Address</Label>
                <Input value={form.institution} onChange={(e) => set("institution", e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-soft">
            <CardHeader className="pb-3"><CardTitle className="text-sm">Referral & Specimen</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Referred By (Doctor)</Label>
                <Input value={form.referredBy} onChange={(e) => set("referredBy", e.target.value)} placeholder="Dr. …" />
              </div>
              <div>
                <Label>Doctor's Phone</Label>
                <Input value={form.doctorPhone} onChange={(e) => set("doctorPhone", e.target.value)} />
              </div>
              <div>
                <Label>Nature of Specimen</Label>
                <Input value={form.natureOfSpecimen} onChange={(e) => set("natureOfSpecimen", e.target.value)} placeholder="Whole blood, urine…" />
              </div>
              <div>
                <Label>Bill</Label>
                <Select value={form.bill} onValueChange={(v) => set("bill", v as "Patient" | "Clinic" | "Company")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Clinic">Clinic</SelectItem>
                    <SelectItem value="Patient">Patient</SelectItem>
                    <SelectItem value="Company">Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label>Examination Required (summary)</Label>
                <Input value={form.examinationRequired} onChange={(e) => set("examinationRequired", e.target.value)} placeholder="Auto-filled from selected tests if blank" />
              </div>
              <div className="sm:col-span-2">
                <Label>Clinical Notes / Exam Requested</Label>
                <Textarea value={form.clinicalNotes} onChange={(e) => set("clinicalNotes", e.target.value)} rows={3} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="border-border/60 shadow-soft lg:sticky lg:top-20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" />
                Laboratory Investigations
              </CardTitle>
              <p className="text-xs text-muted-foreground">{tests.length} selected</p>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
              {Object.entries(testGroups).map(([group, items]) => (
                <div key={group}>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-primary mb-2">{group}</p>
                  <div className="space-y-1.5">
                    {items.map((t) => (
                      <label key={t} className="flex items-start gap-2 text-sm cursor-pointer hover:bg-muted/50 p-1.5 -m-1.5 rounded-md">
                        <Checkbox checked={tests.includes(t)} onCheckedChange={() => toggleTest(t)} className="mt-0.5" />
                        <span className="leading-snug">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 sticky bottom-0 -mx-4 lg:-mx-8 px-4 lg:px-8 py-3 bg-card/95 backdrop-blur-md border-t border-border flex flex-wrap items-center justify-between gap-3 z-20">
          <p className="text-xs text-muted-foreground">
            Serial: <span className="font-mono font-semibold text-primary">{form.serial}</span> · {tests.length} test(s)
          </p>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onSubmit(false)} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Form
            </Button>
            <Button type="button" variant="hero" onClick={onSubmit(true)} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save & Enter Results
            </Button>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default NewTestForm;
