/*
  # Add caption column to gallery_images

  ## Summary
  Adds a `caption` column to the `gallery_images` table to support
  descriptive text displayed below images in the public gallery.

  ## Changes
  - `gallery_images`
    - New column: `caption` (text, nullable) — optional caption for each gallery image, max 200 chars enforced at DB level via CHECK constraint

  ## Notes
  - Existing rows get caption = NULL by default (displays gracefully as no caption)
  - A CHECK constraint enforces the 200-character limit at the database level
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'gallery_images' AND column_name = 'caption'
  ) THEN
    ALTER TABLE gallery_images
      ADD COLUMN caption text,
      ADD CONSTRAINT gallery_images_caption_length CHECK (char_length(caption) <= 200);
  END IF;
END $$;
