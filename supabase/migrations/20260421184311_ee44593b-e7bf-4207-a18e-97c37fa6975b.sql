
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  role TEXT DEFAULT 'Lab Scientist',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Test forms table
CREATE TABLE public.test_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial TEXT NOT NULL UNIQUE,
  patient_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
  phone TEXT,
  email TEXT,
  referred_by TEXT DEFAULT '—',
  doctor_phone TEXT,
  institution TEXT,
  date_collected TIMESTAMPTZ NOT NULL DEFAULT now(),
  nature_of_specimen TEXT DEFAULT '—',
  examination_required TEXT,
  tests_requested TEXT[] NOT NULL DEFAULT '{}',
  clinical_notes TEXT,
  bill TEXT DEFAULT 'Patient' CHECK (bill IN ('Patient', 'Clinic', 'Company')),
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Completed')),
  results JSONB DEFAULT '{}',
  scientist_id UUID REFERENCES public.profiles(id),
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.test_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all test forms"
  ON public.test_forms FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create test forms"
  ON public.test_forms FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update test forms"
  ON public.test_forms FOR UPDATE TO authenticated USING (true);

-- Scientists directory table
CREATE TABLE public.scientists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Lab Scientist',
  email TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.scientists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view scientists"
  ON public.scientists FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage scientists"
  ON public.scientists FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update scientists"
  ON public.scientists FOR UPDATE TO authenticated USING (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_test_forms_updated_at
  BEFORE UPDATE ON public.test_forms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_test_forms_status ON public.test_forms(status);
CREATE INDEX idx_test_forms_serial ON public.test_forms(serial);
CREATE INDEX idx_test_forms_created_by ON public.test_forms(created_by);
