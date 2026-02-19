/*
  # Create 'images' storage bucket and fix gallery_images RLS policies

  ## Summary
  Two issues addressed in this migration:

  1. Missing 'images' storage bucket
     - AdminGalleryManager.tsx uploads to a bucket named 'images' but only 'service-images'
       existed in the database. This caused all gallery image uploads to silently fail.
     - Creates the 'images' bucket with the same settings as 'service-images': public,
       5MB limit, JPEG/PNG/WebP allowed.
     - Adds full storage RLS policies: public SELECT, authenticated INSERT/UPDATE/DELETE.

  2. gallery_images table missing write policies
     - The table had only a public SELECT policy. No INSERT/UPDATE/DELETE policies existed,
       making it impossible to manage gallery images through the frontend admin tools.
     - Adds authenticated INSERT, UPDATE, and DELETE policies with auth.uid() IS NOT NULL checks.

  ## New Storage Bucket
  - `images` (public, 5MB limit, jpeg/png/webp)

  ## New RLS Policies
  - storage.objects: Public SELECT, authenticated INSERT/UPDATE/DELETE for bucket_id = 'images'
  - gallery_images: Authenticated INSERT/UPDATE/DELETE
*/

-- Create the 'images' bucket used by AdminGalleryManager
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS for 'images' bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
    AND policyname = 'Public can view gallery images'
  ) THEN
    CREATE POLICY "Public can view gallery images"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
    AND policyname = 'Authenticated users can upload gallery images'
  ) THEN
    CREATE POLICY "Authenticated users can upload gallery images"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
    AND policyname = 'Authenticated users can update gallery images'
  ) THEN
    CREATE POLICY "Authenticated users can update gallery images"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (bucket_id = 'images')
      WITH CHECK (bucket_id = 'images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
    AND policyname = 'Authenticated users can delete gallery images'
  ) THEN
    CREATE POLICY "Authenticated users can delete gallery images"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (bucket_id = 'images');
  END IF;
END $$;

-- gallery_images table: add missing write policies
CREATE POLICY "Authenticated users can insert gallery images"
  ON gallery_images
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update gallery images"
  ON gallery_images
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete gallery images"
  ON gallery_images
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);
