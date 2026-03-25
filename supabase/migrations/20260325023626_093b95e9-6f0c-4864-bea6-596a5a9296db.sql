-- Create storage bucket for estimate photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('estimate-photos', 'estimate-photos', true);

-- Allow anonymous uploads to estimate-photos bucket
CREATE POLICY "Allow anonymous uploads"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'estimate-photos');

-- Allow public reads
CREATE POLICY "Allow public reads on estimate-photos"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'estimate-photos');