
-- Replace the overly permissive insert policy with one that validates required fields
DROP POLICY "Anyone can submit a lead" ON public.leads;

CREATE POLICY "Anyone can submit a lead with valid data" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND name <> '' AND
    phone IS NOT NULL AND phone <> '' AND
    email IS NOT NULL AND email <> ''
  );
