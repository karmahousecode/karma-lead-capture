DROP POLICY IF EXISTS "Allow anonymous uploads" ON storage.objects;
CREATE POLICY "Allow anonymous uploads"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'estimate-photos');

DROP POLICY IF EXISTS "Allow public reads on estimate-photos" ON storage.objects;
CREATE POLICY "Allow public reads on estimate-photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'estimate-photos');