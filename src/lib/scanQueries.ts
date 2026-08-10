import { supabase } from "@/integrations/supabase/client";

export interface ScanPatient {
  id: string;
  mrn: string;
  full_name: string;
  age: number | null;
  gender: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface Scan {
  id: string;
  serial: string;
  patient_id: string;
  scan_type: string;
  modality: string | null;
  body_part: string | null;
  scan_date: string;
  status: string;
  urgent: boolean;
  clinical_indication: string | null;
  referring_doctor: string | null;
  findings: string | null;
  impression: string | null;
  recommendation: string | null;
  report_text: string | null;
  reported_by: string | null;
  reported_at: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScanImage {
  id: string;
  scan_id: string;
  storage_path: string;
  caption: string | null;
  sort_order: number;
  uploaded_by: string | null;
  created_at: string;
}

export interface ScanAppointment {
  id: string;
  patient_id: string | null;
  patient_name: string;
  patient_phone: string | null;
  scan_type: string;
  scheduled_at: string;
  status: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScanActivity {
  id: string;
  scan_id: string | null;
  user_id: string | null;
  user_name: string | null;
  action: string;
  details: string | null;
  created_at: string;
}

export async function fetchScans(): Promise<Scan[]> {
  const { data, error } = await supabase.from("scans").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Scan[];
}
export async function fetchScan(id: string): Promise<Scan | null> {
  const { data, error } = await supabase.from("scans").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Scan | null;
}
export async function fetchScanBySerial(serial: string): Promise<Scan | null> {
  const { data, error } = await supabase.from("scans").select("*").eq("serial", serial).maybeSingle();
  if (error) throw error;
  return data as Scan | null;
}
export async function fetchPatients(): Promise<ScanPatient[]> {
  const { data, error } = await supabase.from("scan_patients").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ScanPatient[];
}
export async function searchPatients(q: string): Promise<ScanPatient[]> {
  const term = q.trim();
  if (!term) return [];
  const like = `%${term}%`;
  const { data, error } = await supabase
    .from("scan_patients")
    .select("*")
    .or(`full_name.ilike.${like},phone.ilike.${like},mrn.ilike.${like}`)
    .order("created_at", { ascending: false })
    .limit(8);
  if (error) throw error;
  return (data ?? []) as ScanPatient[];
}

export const SCAN_TYPES_BY_MODALITY: Record<string, string[]> = {
  CT: ["Head", "Chest", "Abdomen", "Pelvis", "Spine", "Neck", "Angiography"],
  MRI: ["Brain", "Spine", "Knee", "Shoulder", "Abdomen", "Pelvis"],
  "X-Ray": ["Chest", "Abdomen", "Extremity", "Spine", "Skull"],
  Ultrasound: ["Abdomen", "Pelvis", "Obstetric", "Thyroid", "Doppler"],
  Mammography: ["Screening", "Diagnostic"],
  PET: ["Whole Body", "Brain", "Cardiac"],
  Fluoroscopy: ["Barium Swallow", "Barium Meal", "IVU"],
};
export async function fetchPatient(id: string): Promise<ScanPatient | null> {
  const { data, error } = await supabase.from("scan_patients").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as ScanPatient | null;
}
export async function fetchPatientScans(patient_id: string): Promise<Scan[]> {
  const { data, error } = await supabase.from("scans").select("*").eq("patient_id", patient_id).order("scan_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Scan[];
}
export async function createPatient(p: Partial<ScanPatient> & { full_name: string; mrn: string }) {
  const { data, error } = await supabase.from("scan_patients").insert(p as any).select().single();
  if (error) throw error;
  return data as ScanPatient;
}
export async function updatePatient(id: string, p: Partial<ScanPatient>) {
  const { data, error } = await supabase.from("scan_patients").update(p as any).eq("id", id).select().single();
  if (error) throw error;
  return data as ScanPatient;
}
export async function createScan(s: Partial<Scan> & { serial: string; patient_id: string; scan_type: string; scan_date: string }) {
  const { data, error } = await supabase.from("scans").insert(s as any).select().single();
  if (error) throw error;
  return data as Scan;
}
export async function updateScan(id: string, s: Partial<Scan>) {
  const { data, error } = await supabase.from("scans").update(s as any).eq("id", id).select().single();
  if (error) throw error;
  return data as Scan;
}
export async function fetchScanImages(scan_id: string): Promise<ScanImage[]> {
  const { data, error } = await supabase.from("scan_images").select("*").eq("scan_id", scan_id).order("sort_order");
  if (error) throw error;
  return (data ?? []) as ScanImage[];
}
export async function uploadScanImage(scan_id: string, file: File, caption: string | null = null, user_id: string | null = null) {
  const path = `${scan_id}/${Date.now()}-${file.name}`;
  const { error: upErr } = await supabase.storage.from("scan-images").upload(path, file, { upsert: false });
  if (upErr) throw upErr;
  const { data, error } = await supabase.from("scan_images").insert({ scan_id, storage_path: path, caption, uploaded_by: user_id } as any).select().single();
  if (error) throw error;
  return data as ScanImage;
}
export async function deleteScanImage(img: ScanImage) {
  await supabase.storage.from("scan-images").remove([img.storage_path]);
  const { error } = await supabase.from("scan_images").delete().eq("id", img.id);
  if (error) throw error;
}
export async function getSignedImageUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage.from("scan-images").createSignedUrl(path, 3600);
  if (error) throw error;
  return data.signedUrl;
}
export async function fetchAppointments(): Promise<ScanAppointment[]> {
  const { data, error } = await supabase.from("scan_appointments").select("*").order("scheduled_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ScanAppointment[];
}
export async function createAppointment(a: Partial<ScanAppointment> & { patient_name: string; scan_type: string; scheduled_at: string }) {
  const { data, error } = await supabase.from("scan_appointments").insert(a as any).select().single();
  if (error) throw error;
  return data as ScanAppointment;
}
export async function updateAppointment(id: string, a: Partial<ScanAppointment>) {
  const { data, error } = await supabase.from("scan_appointments").update(a as any).eq("id", id).select().single();
  if (error) throw error;
  return data as ScanAppointment;
}
export async function fetchActivity(limit = 100): Promise<ScanActivity[]> {
  const { data, error } = await supabase.from("scan_activity").select("*").order("created_at", { ascending: false }).limit(limit);
  if (error) throw error;
  return (data ?? []) as ScanActivity[];
}
export async function logActivity(scan_id: string | null, action: string, user_id: string | null, user_name: string | null, details: string | null = null) {
  await supabase.from("scan_activity").insert({ scan_id, action, user_id, user_name, details } as any);
}
export async function getNextScanSerial(): Promise<string> {
  const year = new Date().getFullYear();
  const { data } = await supabase.from("scans").select("serial").like("serial", `SC-${year}-%`).order("serial", { ascending: false }).limit(1);
  let next = 1;
  if (data && data.length > 0) {
    const m = (data[0] as any).serial.match(/SC-\d{4}-(\d+)/);
    if (m) next = parseInt(m[1], 10) + 1;
  }
  return `SC-${year}-${String(next).padStart(5, "0")}`;
}
export async function getNextMRN(): Promise<string> {
  const { data } = await supabase.from("scan_patients").select("mrn").like("mrn", "MRN-%").order("mrn", { ascending: false }).limit(1);
  let next = 1;
  if (data && data.length > 0) {
    const m = (data[0] as any).mrn.match(/MRN-(\d+)/);
    if (m) next = parseInt(m[1], 10) + 1;
  }
  return `MRN-${String(next).padStart(6, "0")}`;
}
