/*
  # Create storage bucket for service images

  1. Storage
    - Create `service-images` bucket
    - Enable public access for images
    - Set appropriate file size limits

  2. Security
    - Allow public read access
    - Restrict uploads to authenticated users
    - Restrict deletes to authenticated users
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'service-images',
  'service-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Public can view service images'
  ) THEN
    CREATE POLICY "Public can view service images"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'service-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Authenticated users can upload service images'
  ) THEN
    CREATE POLICY "Authenticated users can upload service images"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'service-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Authenticated users can update service images'
  ) THEN
    CREATE POLICY "Authenticated users can update service images"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (bucket_id = 'service-images')
      WITH CHECK (bucket_id = 'service-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Authenticated users can delete service images'
  ) THEN
    CREATE POLICY "Authenticated users can delete service images"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (bucket_id = 'service-images');
  END IF;
END $$;