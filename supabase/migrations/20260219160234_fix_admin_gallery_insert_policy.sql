/*
  # Fix admin-gallery storage INSERT policy

  ## Problem
  The admin-gallery storage bucket was missing an INSERT policy for authenticated users.
  This caused all uploads to silently fail — the file never reached storage, so no
  public URL was generated and no row was inserted into gallery_images.

  ## Changes
  - Add INSERT policy on storage.objects for the admin-gallery bucket,
    allowing any authenticated user to upload files.
*/

CREATE POLICY "Authenticated can insert into admin-gallery"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'admin-gallery');
