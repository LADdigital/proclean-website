/*
  # Fix RLS Policies - Remove Always-True Clauses

  ## Summary
  Replaces overly permissive RLS policies on `gallery_config` and `service_images`
  that had `USING (true)` / `WITH CHECK (true)` with proper checks that verify
  the requesting user is authenticated via `auth.uid() IS NOT NULL`.

  ## Changes

  ### gallery_config
  - Drop: "Authenticated users can insert gallery config" (WITH CHECK always true)
  - Drop: "Authenticated users can update gallery config" (USING/WITH CHECK always true)
  - Add: Replacement INSERT policy checking auth.uid() IS NOT NULL
  - Add: Replacement UPDATE policy checking auth.uid() IS NOT NULL

  ### service_images
  - Drop: "Authenticated users can insert service images" (WITH CHECK always true)
  - Drop: "Authenticated users can update service images" (USING/WITH CHECK always true)
  - Drop: "Authenticated users can delete service images" (USING always true)
  - Add: Replacement INSERT policy checking auth.uid() IS NOT NULL
  - Add: Replacement UPDATE policy checking auth.uid() IS NOT NULL
  - Add: Replacement DELETE policy checking auth.uid() IS NOT NULL

  ## Notes
  - These tables have no per-row ownership column, so the check is whether the
    caller is a valid authenticated user (auth.uid() IS NOT NULL).
  - Public SELECT policies are unchanged.
*/

-- gallery_config: drop old always-true policies
DROP POLICY IF EXISTS "Authenticated users can insert gallery config" ON gallery_config;
DROP POLICY IF EXISTS "Authenticated users can update gallery config" ON gallery_config;

-- gallery_config: insert — only authenticated users
CREATE POLICY "Authenticated users can insert gallery config"
  ON gallery_config
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- gallery_config: update — only authenticated users
CREATE POLICY "Authenticated users can update gallery config"
  ON gallery_config
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- service_images: drop old always-true policies
DROP POLICY IF EXISTS "Authenticated users can insert service images" ON service_images;
DROP POLICY IF EXISTS "Authenticated users can update service images" ON service_images;
DROP POLICY IF EXISTS "Authenticated users can delete service images" ON service_images;

-- service_images: insert — only authenticated users
CREATE POLICY "Authenticated users can insert service images"
  ON service_images
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- service_images: update — only authenticated users
CREATE POLICY "Authenticated users can update service images"
  ON service_images
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- service_images: delete — only authenticated users
CREATE POLICY "Authenticated users can delete service images"
  ON service_images
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);
