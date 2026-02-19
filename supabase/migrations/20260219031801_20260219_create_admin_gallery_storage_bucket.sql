/*
  # Create Admin Gallery Storage Bucket

  Creates a public storage bucket named 'admin-gallery' for admin-uploaded images.
  - Public read access for all users
  - Upload/delete restricted to authenticated users only
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'admin-gallery',
  'admin-gallery',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can read admin-gallery" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload to admin-gallery" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete from admin-gallery" ON storage.objects;

CREATE POLICY "Public can read admin-gallery"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'admin-gallery');

CREATE POLICY "Authenticated can upload to admin-gallery"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'admin-gallery');

CREATE POLICY "Authenticated can update admin-gallery"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'admin-gallery');

CREATE POLICY "Authenticated can delete from admin-gallery"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'admin-gallery');
