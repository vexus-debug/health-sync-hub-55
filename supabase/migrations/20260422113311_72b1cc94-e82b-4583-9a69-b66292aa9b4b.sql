-- Pharmacy items table
CREATE TABLE public.pharmacy_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  uses TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pharmacy_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active pharmacy items"
ON public.pharmacy_items FOR SELECT
USING ((active = true) OR public.is_senior_scientist(auth.uid()));

CREATE POLICY "Senior scientists can insert pharmacy items"
ON public.pharmacy_items FOR INSERT TO authenticated
WITH CHECK (public.is_senior_scientist(auth.uid()));

CREATE POLICY "Senior scientists can update pharmacy items"
ON public.pharmacy_items FOR UPDATE TO authenticated
USING (public.is_senior_scientist(auth.uid()));

CREATE POLICY "Senior scientists can delete pharmacy items"
ON public.pharmacy_items FOR DELETE TO authenticated
USING (public.is_senior_scientist(auth.uid()));

CREATE TRIGGER update_pharmacy_items_updated_at
BEFORE UPDATE ON public.pharmacy_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add uses column to products for the dropdown explanation
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS uses TEXT;

-- Remove PMS Drug products
DELETE FROM public.products WHERE category = 'PMS Drug';
