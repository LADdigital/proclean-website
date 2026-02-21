/*
  # Increase admin-gallery storage bucket file size limit

  ## Changes
  - Raises the file_size_limit on the admin-gallery bucket from 10MB to 52428800 bytes (50MB)
    to accommodate large, uncompressed photos (DSLR JPEGs, PNGs, HEIC files, etc.)
  - Expands allowed_mime_types to include HEIC/HEIF formats commonly produced by iPhones
    and adds a wildcard-style broader image type support

  ## Notes
  - No data is modified, only bucket configuration is updated
  - Existing uploads are unaffected
*/

UPDATE storage.buckets
SET
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/heic',
    'image/heif',
    'image/tiff',
    'image/bmp'
  ]
WHERE id = 'admin-gallery';
