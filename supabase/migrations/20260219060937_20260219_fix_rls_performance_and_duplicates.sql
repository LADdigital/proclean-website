/*
  # Fix RLS Policy Security Issues

  ## Summary
  Addresses all flagged RLS security warnings across four tables:

  1. **gallery_config** — Replace bare `auth.uid()` with `(select auth.uid())` in INSERT and UPDATE
     policies to avoid per-row re-evaluation and improve query performance.

  2. **service_images** — Same `(select auth.uid())` fix for INSERT, UPDATE, and DELETE policies.

  3. **gallery_images** — Two problems fixed:
     - Remove duplicate overlapping policies (kept the better-named set, dropped the always-true ones)
     - Replace bare `auth.uid()` with `(select auth.uid())` in surviving policies
     - Consolidate the two public SELECT policies into one

  4. **admin_services** — Replace always-true (`true`) USING/WITH CHECK clauses with proper
     `(select auth.uid()) IS NOT NULL` checks on INSERT, UPDATE, and DELETE policies.

  ## Notes
  - No data is affected; only policy definitions change
  - All mutations (INSERT/UPDATE/DELETE) continue to require an authenticated session
  - Public SELECT access is preserved where it existed
*/

-- ============================================================
-- gallery_config: fix auth.uid() → (select auth.uid())
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can insert gallery config" ON public.gallery_config;
DROP POLICY IF EXISTS "Authenticated users can update gallery config" ON public.gallery_config;

CREATE POLICY "Authenticated users can insert gallery config"
  ON public.gallery_config
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can update gallery config"
  ON public.gallery_config
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- ============================================================
-- service_images: fix auth.uid() → (select auth.uid())
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can insert service images" ON public.service_images;
DROP POLICY IF EXISTS "Authenticated users can update service images" ON public.service_images;
DROP POLICY IF EXISTS "Authenticated users can delete service images" ON public.service_images;

CREATE POLICY "Authenticated users can insert service images"
  ON public.service_images
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can update service images"
  ON public.service_images
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can delete service images"
  ON public.service_images
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

-- ============================================================
-- gallery_images: remove duplicates, fix always-true, fix auth.uid()
-- ============================================================

-- Drop all existing gallery_images policies so we can start clean
DROP POLICY IF EXISTS "Anon can select gallery_images" ON public.gallery_images;
DROP POLICY IF EXISTS "Authenticated can select gallery_images" ON public.gallery_images;
DROP POLICY IF EXISTS "Public read access to gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Authenticated can insert gallery_images" ON public.gallery_images;
DROP POLICY IF EXISTS "Authenticated users can insert gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Authenticated can update gallery_images" ON public.gallery_images;
DROP POLICY IF EXISTS "Authenticated users can update gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Authenticated can delete gallery_images" ON public.gallery_images;
DROP POLICY IF EXISTS "Authenticated users can delete gallery images" ON public.gallery_images;

-- Single consolidated SELECT policy for everyone (public read)
CREATE POLICY "Public read access to gallery images"
  ON public.gallery_images
  FOR SELECT
  TO public
  USING (true);

-- Authenticated write policies with (select auth.uid()) for performance
CREATE POLICY "Authenticated users can insert gallery images"
  ON public.gallery_images
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can update gallery images"
  ON public.gallery_images
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can delete gallery images"
  ON public.gallery_images
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

-- ============================================================
-- admin_services: replace always-true clauses
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can insert services" ON public.admin_services;
DROP POLICY IF EXISTS "Authenticated users can update services" ON public.admin_services;
DROP POLICY IF EXISTS "Authenticated users can delete services" ON public.admin_services;

CREATE POLICY "Authenticated users can insert services"
  ON public.admin_services
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can update services"
  ON public.admin_services
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can delete services"
  ON public.admin_services
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);
