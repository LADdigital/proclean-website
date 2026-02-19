/*
  # Fix Gallery Images Admin Policies

  The gallery_images table already exists. This migration:
  - Drops any conflicting policies
  - Adds proper public SELECT and authenticated full CRUD policies

  1. Security Changes
    - Public (anon) can SELECT all gallery_images
    - Authenticated users can INSERT, UPDATE, DELETE gallery_images
*/

DO $$
BEGIN
  DROP POLICY IF EXISTS "Public can view gallery images" ON gallery_images;
  DROP POLICY IF EXISTS "Authenticated users can manage gallery images" ON gallery_images;
  DROP POLICY IF EXISTS "Allow public read access to gallery_images" ON gallery_images;
  DROP POLICY IF EXISTS "Allow authenticated full access to gallery_images" ON gallery_images;
  DROP POLICY IF EXISTS "Authenticated can insert gallery_images" ON gallery_images;
  DROP POLICY IF EXISTS "Authenticated can update gallery_images" ON gallery_images;
  DROP POLICY IF EXISTS "Authenticated can delete gallery_images" ON gallery_images;
  DROP POLICY IF EXISTS "Anon can select gallery_images" ON gallery_images;
END $$;

CREATE POLICY "Anon can select gallery_images"
  ON gallery_images FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated can select gallery_images"
  ON gallery_images FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert gallery_images"
  ON gallery_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update gallery_images"
  ON gallery_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete gallery_images"
  ON gallery_images FOR DELETE
  TO authenticated
  USING (true);
