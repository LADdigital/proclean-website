/*
  # Create service images table

  1. New Tables
    - `service_images`
      - `id` (uuid, primary key)
      - `service_id` (text) - matches the service.id from services.ts
      - `image_url` (text) - URL to the uploaded image
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `service_images` table
    - Add policy for public read access (anyone can view service images)
    - Add policy for authenticated users to manage images (admin functionality)
*/

CREATE TABLE IF NOT EXISTS service_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id text UNIQUE NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE service_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view service images"
  ON service_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert service images"
  ON service_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update service images"
  ON service_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete service images"
  ON service_images
  FOR DELETE
  TO authenticated
  USING (true);