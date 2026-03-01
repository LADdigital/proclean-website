/*
  # Seed pricing_tiers from static data

  ## Summary
  Backfills the `pricing_tiers` column on existing `admin_services` rows
  using the known static pricing data so the admin panel reflects current
  live prices. Only updates rows where `pricing_tiers` is still NULL and
  a known `service_key` matches.

  ## Changes
  - `admin_services`: sets `pricing_tiers` JSON for all existing rows
    that have a matching service_key
*/

UPDATE admin_services SET pricing_tiers = '[{"label":"Ceramic Coating","price":"Starting at $600"}]'::jsonb
  WHERE service_key = 'ceramic-coating' AND pricing_tiers IS NULL;

UPDATE admin_services SET pricing_tiers = '[{"label":"Paint Correction","price":"Starting at $95 per panel"}]'::jsonb
  WHERE service_key = 'paint-correction' AND pricing_tiers IS NULL;

UPDATE admin_services SET pricing_tiers = '[{"label":"Car / Small Truck","price":"$255"},{"label":"Mid Size SUV / Truck","price":"$295"},{"label":"Full Size SUV / Truck","price":"$325"}]'::jsonb
  WHERE service_key = 'interior-detailing' AND pricing_tiers IS NULL;

UPDATE admin_services SET pricing_tiers = '[{"label":"Car / Small Truck","price":"$255"},{"label":"Mid Size SUV / Truck","price":"$295"},{"label":"Full Size SUV / Truck","price":"$325"}]'::jsonb
  WHERE service_key = 'exterior-detailing' AND pricing_tiers IS NULL;

UPDATE admin_services SET pricing_tiers = '[{"label":"Wheel Restoration","price":"Starting at $125 per wheel"}]'::jsonb
  WHERE service_key = 'wheel-restoration' AND pricing_tiers IS NULL;

UPDATE admin_services SET pricing_tiers = '[{"label":"Paint Touch Up","price":"$50"}]'::jsonb
  WHERE service_key = 'paint-touchup' AND pricing_tiers IS NULL;

UPDATE admin_services SET pricing_tiers = '[{"label":"Windshield Chip Repair","price":"$35"}]'::jsonb
  WHERE service_key = 'rock-chip-repair' AND pricing_tiers IS NULL;

UPDATE admin_services SET pricing_tiers = '[{"label":"Paintless Dent Repair","price":"Starting at $65"}]'::jsonb
  WHERE service_key = 'paintless-dent-repair' AND pricing_tiers IS NULL;

UPDATE admin_services SET pricing_tiers = '[{"label":"Car / Small Truck","price":"$345"},{"label":"Mid Size SUV / Truck","price":"$395"},{"label":"Full Size SUV / Truck","price":"$445"}]'::jsonb
  WHERE service_key = 'complete-detail' AND pricing_tiers IS NULL;

UPDATE admin_services SET pricing_tiers = '[{"label":"Mini Detail","price":"$125"}]'::jsonb
  WHERE service_key = 'mini-detail' AND pricing_tiers IS NULL;

UPDATE admin_services SET pricing_tiers = '[{"label":"Undercoat","price":"Starting at $500"}]'::jsonb
  WHERE service_key = 'undercoat' AND pricing_tiers IS NULL;

UPDATE admin_services SET pricing_tiers = '[{"label":"Spray In Bed Liner (Vortex)","price":"Starting at $475"}]'::jsonb
  WHERE service_key = 'spray-in-bed-liner' AND pricing_tiers IS NULL;

UPDATE admin_services SET pricing_tiers = '[{"label":"Bumper Repair","price":"Starting at $250"}]'::jsonb
  WHERE service_key = 'bumper-repair' AND pricing_tiers IS NULL;

UPDATE admin_services SET pricing_tiers = '[{"label":"Odor Removal","price":"$50"}]'::jsonb
  WHERE service_key = 'odor-removal' AND pricing_tiers IS NULL;

UPDATE admin_services SET pricing_tiers = '[{"label":"Headlight Restoration","price":"$49.99"}]'::jsonb
  WHERE service_key = 'headlight-restoration' AND pricing_tiers IS NULL;

UPDATE admin_services SET pricing_tiers = '[{"label":"Cigarette Burn Repair","price":"$35"}]'::jsonb
  WHERE service_key = 'cigarette-burn-repair' AND pricing_tiers IS NULL;
