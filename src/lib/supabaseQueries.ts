import { supabase } from "@/integrations/supabase/client";
import { TestStatus } from "./labCatalog";

export interface DbTestForm {
  id: string;
  serial: string;
  patient_name: string;
  age: number;
  gender: "Male" | "Female";
  phone: string | null;
  email: string | null;
  referred_by: string;
  doctor_phone: string | null;
  institution: string | null;
  date_collected: string;
  nature_of_specimen: string;
  examination_required: string | null;
  tests_requested: string[];
  clinical_notes: string | null;
  bill: "Patient" | "Clinic" | "Company";
  status: TestStatus;
  approval_status?: string | null;
  results: Record<string, string>;
  scientist_id: string | null;
  completed_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export async function fetchTestForms(): Promise<DbTestForm[]> {
  const { data, error } = await supabase
    .from("test_forms")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as DbTestForm[];
}

export async function fetchTestForm(serial: string): Promise<DbTestForm | null> {
  const { data, error } = await supabase
    .from("test_forms")
    .select("*")
    .eq("serial", serial)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as DbTestForm | null;
}

export async function createTestForm(form: {
  serial: string;
  patient_name: string;
  age: number;
  gender: "Male" | "Female";
  phone?: string;
  email?: string;
  referred_by?: string;
  doctor_phone?: string;
  institution?: string;
  nature_of_specimen?: string;
  examination_required?: string;
  tests_requested: string[];
  clinical_notes?: string;
  bill?: "Patient" | "Clinic" | "Company";
  created_by?: string;
}): Promise<DbTestForm> {
  const { data, error } = await supabase
    .from("test_forms")
    .insert({
      serial: form.serial,
      patient_name: form.patient_name,
      age: form.age,
      gender: form.gender,
      phone: form.phone || null,
      email: form.email || null,
      referred_by: form.referred_by || "—",
      doctor_phone: form.doctor_phone || null,
      institution: form.institution || null,
      nature_of_specimen: form.nature_of_specimen || "—",
      examination_required: form.examination_required || form.tests_requested.join(", "),
      tests_requested: form.tests_requested,
      clinical_notes: form.clinical_notes || null,
      bill: form.bill || "Patient",
      created_by: form.created_by || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as unknown as DbTestForm;
}

export async function updateTestFormResults(
  serial: string,
  results: Record<string, string>,
  status?: TestStatus
): Promise<DbTestForm> {
  const updatePayload: {
    results: Record<string, string>;
    status?: string;
    completed_at?: string;
  } = { results };
  if (status) {
    updatePayload.status = status;
    if (status === "Completed") {
      updatePayload.completed_at = new Date().toISOString();
    }
  }
  const { data, error } = await supabase
    .from("test_forms")
    .update(updatePayload)
    .eq("serial", serial)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as DbTestForm;
}

export async function getNextSerial(): Promise<string> {
  const year = new Date().getFullYear();
  const { data } = await supabase
    .from("test_forms")
    .select("serial")
    .like("serial", `MV-${year}-%`)
    .order("serial", { ascending: false })
    .limit(1);
  
  let next = 1;
  if (data && data.length > 0) {
    const match = (data[0] as any).serial.match(/MV-\d{4}-(\d+)/);
    if (match) next = parseInt(match[1], 10) + 1;
  }
  return `MV-${year}-${String(next).padStart(5, "0")}`;
}

export async function fetchScientists() {
  const { data, error } = await supabase
    .from("scientists")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function createScientist(scientist: { name: string; role: string; email: string; active?: boolean }) {
  const { data, error } = await supabase
    .from("scientists")
    .insert(scientist)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateScientist(id: string, updates: Partial<{ name: string; role: string; email: string; active: boolean }>) {
  const { data, error } = await supabase
    .from("scientists")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
