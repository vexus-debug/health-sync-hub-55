
-- Scan Dashboard schema
CREATE TABLE IF NOT EXISTS public.scan_patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mrn TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scan_patients TO authenticated;
GRANT ALL ON public.scan_patients TO service_role;
ALTER TABLE public.scan_patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read scan_patients" ON public.scan_patients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert scan_patients" ON public.scan_patients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update scan_patients" ON public.scan_patients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete scan_patients" ON public.scan_patients FOR DELETE TO authenticated USING (true);
CREATE TRIGGER scan_patients_updated_at BEFORE UPDATE ON public.scan_patients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  serial TEXT UNIQUE NOT NULL,
  patient_id UUID NOT NULL REFERENCES public.scan_patients(id) ON DELETE CASCADE,
  scan_type TEXT NOT NULL,
  modality TEXT,
  body_part TEXT,
  scan_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'Pending',
  urgent BOOLEAN NOT NULL DEFAULT false,
  referring_doctor TEXT,
  clinical_indication TEXT,
  findings TEXT,
  impression TEXT,
  recommendation TEXT,
  report_text TEXT,
  reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reported_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scans TO authenticated;
GRANT ALL ON public.scans TO service_role;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read scans" ON public.scans FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert scans" ON public.scans FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update scans" ON public.scans FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete scans" ON public.scans FOR DELETE TO authenticated USING (true);
CREATE TRIGGER scans_updated_at BEFORE UPDATE ON public.scans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX scans_patient_idx ON public.scans(patient_id);
CREATE INDEX scans_status_idx ON public.scans(status);
CREATE INDEX scans_date_idx ON public.scans(scan_date DESC);

CREATE TABLE IF NOT EXISTS public.scan_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_id UUID NOT NULL REFERENCES public.scans(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scan_images TO authenticated;
GRANT ALL ON public.scan_images TO service_role;
ALTER TABLE public.scan_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read scan_images" ON public.scan_images FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert scan_images" ON public.scan_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update scan_images" ON public.scan_images FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete scan_images" ON public.scan_images FOR DELETE TO authenticated USING (true);
CREATE INDEX scan_images_scan_idx ON public.scan_images(scan_id);

CREATE TABLE IF NOT EXISTS public.scan_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.scan_patients(id) ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT,
  scan_type TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'Scheduled',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scan_appointments TO authenticated;
GRANT ALL ON public.scan_appointments TO service_role;
ALTER TABLE public.scan_appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read scan_appts" ON public.scan_appointments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert scan_appts" ON public.scan_appointments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update scan_appts" ON public.scan_appointments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete scan_appts" ON public.scan_appointments FOR DELETE TO authenticated USING (true);
CREATE TRIGGER scan_appts_updated_at BEFORE UPDATE ON public.scan_appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.scan_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT,
  action TEXT NOT NULL,
  scan_id UUID REFERENCES public.scans(id) ON DELETE SET NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.scan_activity TO authenticated;
GRANT ALL ON public.scan_activity TO service_role;
ALTER TABLE public.scan_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read activity" ON public.scan_activity FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert activity" ON public.scan_activity FOR INSERT TO authenticated WITH CHECK (true);
CREATE INDEX scan_activity_created_idx ON public.scan_activity(created_at DESC);
