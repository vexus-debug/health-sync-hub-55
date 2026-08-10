
CREATE POLICY "Auth read scan-images" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'scan-images');
CREATE POLICY "Auth upload scan-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'scan-images');
CREATE POLICY "Auth update scan-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'scan-images');
CREATE POLICY "Auth delete scan-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'scan-images');
