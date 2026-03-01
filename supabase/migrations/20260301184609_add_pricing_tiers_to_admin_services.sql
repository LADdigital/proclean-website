/*
  # Add pricing_tiers to admin_services

  ## Summary
  Adds a `pricing_tiers` JSONB column to the `admin_services` table to store
  structured pricing data (label + price pairs) for each service.

  ## Changes
  - `admin_services`: new column `pricing_tiers` (jsonb, nullable)
    - Stores an array of objects: [{ "label": "Car / Small Truck", "price": "$255" }, ...]
    - When null, the service either has no pricing or falls back to static data
    - When present, overrides static pricing data on the Services page

  ## Notes
  - Existing rows remain unaffected (column defaults to NULL)
  - No destructive operations performed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_services' AND column_name = 'pricing_tiers'
  ) THEN
    ALTER TABLE admin_services ADD COLUMN pricing_tiers jsonb DEFAULT NULL;
  END IF;
END $$;
