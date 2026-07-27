DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects'
      AND cmd IN ('SELECT','ALL')
      AND (qual ILIKE '%gallery%' OR policyname ILIKE '%gallery%')
  LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', p.policyname);
  END LOOP;
END $$;

CREATE POLICY "Authenticated can list gallery files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated can upload gallery files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Authenticated can update gallery files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated can delete gallery files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'gallery');