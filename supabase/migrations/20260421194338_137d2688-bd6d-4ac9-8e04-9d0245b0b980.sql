-- Public RPC to fetch a completed test result by serial number only.
-- Returns minimal patient info + results JSON. Only completed tests are exposed.
CREATE OR REPLACE FUNCTION public.get_public_result(_serial text)
RETURNS TABLE (
  serial text,
  patient_name text,
  age integer,
  gender text,
  date_collected timestamptz,
  completed_at timestamptz,
  nature_of_specimen text,
  examination_required text,
  tests_requested text[],
  referred_by text,
  results jsonb,
  status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    t.serial,
    t.patient_name,
    t.age,
    t.gender,
    t.date_collected,
    t.completed_at,
    t.nature_of_specimen,
    t.examination_required,
    t.tests_requested,
    t.referred_by,
    t.results,
    t.status
  FROM public.test_forms t
  WHERE t.serial = _serial
    AND t.status = 'Completed'
  LIMIT 1;
$$;

-- Allow anonymous (public) callers to invoke this function
GRANT EXECUTE ON FUNCTION public.get_public_result(text) TO anon, authenticated;
