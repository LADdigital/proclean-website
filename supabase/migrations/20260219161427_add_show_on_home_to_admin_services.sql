/*
  # Add show_on_home column to admin_services

  ## Summary
  Adds a `show_on_home` boolean column to the `admin_services` table to control
  which services appear in the "Professional Auto Detailing Services" section on
  the home page, independently of whether the service is active/visible on the
  /services page.

  ## Changes
  - `admin_services`: new column `show_on_home` (boolean, default false)
    - When true, the service card appears in the home page services section
    - When false, the service only appears on the /services page (if is_active)
    - Existing records default to false so no unintended home page changes occur
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_services' AND column_name = 'show_on_home'
  ) THEN
    ALTER TABLE admin_services ADD COLUMN show_on_home boolean NOT NULL DEFAULT false;
  END IF;
END $$;
