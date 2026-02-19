/*
  # Create images gallery table

  1. New Tables
    - `gallery_images`
      - `id` (uuid, primary key)
      - `service_id` (text) - references the service
      - `image_url` (text) - path to the image
      - `title` (text) - image title/description
      - `alt_text` (text) - accessibility alt text
      - `position` (integer) - order in gallery
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `gallery_images` table
    - Add policy for public read access (public gallery)
    - Add policy for authenticated admin updates
*/

CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id text NOT NULL,
  image_url text NOT NULL,
  title text NOT NULL,
  alt_text text,
  "position" integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to gallery images"
  ON gallery_images
  FOR SELECT
  TO public
  USING (true);

INSERT INTO gallery_images (service_id, image_url, title, alt_text, "position") VALUES
  ('ceramic-coating', '/A0E387F6-5681-4071-A8C8-83D275DA5AED_1_105_c.jpeg', 'Ceramic Coating - Premium Protection', 'Vehicle with professional ceramic coating showing deep glossy finish', 1),
  ('interior-detailing', '/434D238A-76CD-4EFA-9437-74805AE33B6B_4_5005_c.jpeg', 'Interior Detailing - Complete Restoration', 'Clean and detailed vehicle interior with restored surfaces', 2),
  ('exterior-detailing', '/22BBAB27-E41B-4DF3-A66A-320252ED9D54_4_5005_c.jpeg', 'Exterior Detailing - Professional Finish', 'Vehicle exterior showing professional wash and polish', 3),
  ('paintless-dent-repair', '/dent.jpg', 'Paintless Dent Repair - Before', 'Vehicle with visible dent damage before repair', 4),
  ('paintless-dent-repair', '/dentafter.jpg', 'Paintless Dent Repair - After', 'Vehicle showing seamless dent removal without repainting', 5);
