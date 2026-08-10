DROP FUNCTION IF EXISTS public.get_public_result(text);

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
  status text,
  scientist_name text
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
    t.status,
    COALESCE(sci.name, p.display_name) AS scientist_name
  FROM public.test_forms t
  LEFT JOIN public.scientists sci ON sci.id = t.scientist_id
  LEFT JOIN public.profiles p ON p.user_id = t.created_by
  WHERE t.serial = _serial
    AND t.status = 'Completed'
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_result(text) TO anon, authenticated;