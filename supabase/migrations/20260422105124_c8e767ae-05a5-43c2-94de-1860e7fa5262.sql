
-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12,2),
  category TEXT NOT NULL,
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is a Senior Scientist
CREATE OR REPLACE FUNCTION public.is_senior_scientist(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = _user_id
      AND lower(coalesce(role,'')) LIKE '%senior%'
  );
$$;

-- Public can view active products
CREATE POLICY "Anyone can view active products"
ON public.products FOR SELECT
USING (active = true OR public.is_senior_scientist(auth.uid()));

CREATE POLICY "Senior scientists can insert products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (public.is_senior_scientist(auth.uid()));

CREATE POLICY "Senior scientists can update products"
ON public.products FOR UPDATE
TO authenticated
USING (public.is_senior_scientist(auth.uid()));

CREATE POLICY "Senior scientists can delete products"
ON public.products FOR DELETE
TO authenticated
USING (public.is_senior_scientist(auth.uid()));

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Senior scientists can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images' AND public.is_senior_scientist(auth.uid()));

CREATE POLICY "Senior scientists can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images' AND public.is_senior_scientist(auth.uid()));

CREATE POLICY "Senior scientists can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND public.is_senior_scientist(auth.uid()));
