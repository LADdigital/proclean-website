/*
  # Fix admin-gallery storage read policy for authenticated users

  ## Problem
  The existing read policy on the admin-gallery storage bucket only grants
  SELECT access to the `anon` role. Authenticated admin users were unable to
  preview uploaded images in the admin panel because their role (`authenticated`)
  was not covered by any SELECT policy.

  ## Changes
  - Add a SELECT policy on storage.objects for `authenticated` role
    so that logged-in admin users can also read files from admin-gallery
*/

CREATE POLICY "Authenticated can read admin-gallery"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'admin-gallery');
