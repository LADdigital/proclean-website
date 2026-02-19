/*
  # Create Gallery Configuration Table
  
  1. New Tables
    - `gallery_config`
      - `id` (uuid, primary key)
      - `key` (text, unique) - Configuration key (e.g., 'home_carousel')
      - `images` (jsonb) - Array of image URLs
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `gallery_config` table
    - Add policy for public read access
    - Add policy for authenticated users to update (for admin panel)
*/

CREATE TABLE IF NOT EXISTS gallery_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to gallery config"
  ON gallery_config
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update gallery config"
  ON gallery_config
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert gallery config"
  ON gallery_config
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

INSERT INTO gallery_config (key, images) 
VALUES ('home_carousel', '[]'::jsonb)
ON CONFLICT (key) DO NOTHING;
