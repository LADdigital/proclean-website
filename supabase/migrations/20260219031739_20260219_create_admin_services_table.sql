/*
  # Create Admin Services Table

  1. New Tables
    - `admin_services`
      - `id` (uuid, primary key)
      - `title` (text, required) — service name shown to public
      - `description` (text, required) — full description
      - `price` (numeric, required) — displayed price
      - `image_url` (text, nullable) — uploaded image URL
      - `is_active` (boolean, default true) — controls public visibility
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS
    - Public can SELECT active services only
    - Authenticated users have full CRUD access
*/

CREATE TABLE IF NOT EXISTS admin_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active services"
  ON admin_services FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all services"
  ON admin_services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert services"
  ON admin_services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update services"
  ON admin_services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete services"
  ON admin_services FOR DELETE
  TO authenticated
  USING (true);
