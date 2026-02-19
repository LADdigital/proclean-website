/*
  # Expand admin_services table schema

  ## Summary
  Adds new columns to admin_services to support full editing of all service content
  that appears on the public Services page.

  ## Changes to admin_services
  - `service_key` (text, unique, nullable) — slug key like 'ceramic-coating', links to static service definition
  - `features` (text[], default '{}') — array of feature bullet points shown in "What's Included"
  - `short_title` (text) — short label used in the sticky nav
  - `sort_order` (integer, default 0) — controls display order

  ## Notes
  - All additions use IF NOT EXISTS to be safe
  - Existing rows are unaffected
  - RLS policies already exist from prior migration; no changes needed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_services' AND column_name = 'service_key'
  ) THEN
    ALTER TABLE admin_services ADD COLUMN service_key text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_services' AND column_name = 'features'
  ) THEN
    ALTER TABLE admin_services ADD COLUMN features text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_services' AND column_name = 'short_title'
  ) THEN
    ALTER TABLE admin_services ADD COLUMN short_title text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_services' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE admin_services ADD COLUMN sort_order integer DEFAULT 0;
  END IF;
END $$;
