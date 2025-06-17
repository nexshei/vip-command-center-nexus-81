
-- Create a storage bucket for gallery photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-photos', 'gallery-photos', true);

-- Create storage policies for the gallery-photos bucket
CREATE POLICY "Allow public read access on gallery photos" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery-photos');

CREATE POLICY "Allow authenticated users to upload gallery photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'gallery-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update gallery photos" ON storage.objects
FOR UPDATE USING (bucket_id = 'gallery-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete gallery photos" ON storage.objects
FOR DELETE USING (bucket_id = 'gallery-photos' AND auth.role() = 'authenticated');
