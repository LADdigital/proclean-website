# Admin Gallery Manager Setup

This document explains how to set up the admin gallery management system for the Pro Clean Auto Detail Systems website.

## Storage Bucket Setup

The admin gallery manager requires a Supabase storage bucket for image uploads. Follow these steps to set it up:

### 1. Create Storage Bucket

In your Supabase Dashboard:
1. Go to **Storage** section
2. Click **New bucket**
3. Name it: `images`
4. Make it **Public**

### 2. Set Storage Policies

Apply these storage policies to allow image uploads:

```sql
-- Allow public read access to images
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');
```

## Features

### Admin Panel (Development Only)

The admin panel is only visible when running in development mode (`npm run dev`). It will not appear in production builds.

**Features:**
- **Drag and Drop Upload**: Drag images directly onto the upload area
- **Multi-file Upload**: Select multiple images at once
- **Reorder Images**: Drag images to reorder them in the carousel
- **Remove Images**: Click the X button to remove images
- **Auto-save**: Changes are automatically saved to Supabase

### Gallery Configuration

Gallery images are stored in the `gallery_config` table with the key `home_carousel`. The configuration includes:
- Array of image URLs
- Last updated timestamp

### Image Storage

- Uploaded images are stored in Supabase Storage under the `images/gallery/` path
- Each image gets a unique filename with timestamp
- Public URLs are automatically generated

## Usage

### To Add Images:

1. Run the development server: `npm run dev`
2. Navigate to the homepage
3. Scroll to "See the Pro Clean Difference" section
4. You'll see the "Admin: Gallery Manager" panel (marked with "Dev Only")
5. Either drag images onto the upload area or click "Select Files"
6. Images will be uploaded and immediately appear in the carousel

### To Reorder Images:

1. In the admin panel, drag any thumbnail to a new position
2. The order is automatically saved
3. The carousel will reflect the new order

### To Remove Images:

1. Hover over any thumbnail in the admin panel
2. Click the X button in the top-right corner
3. The image is removed from both the gallery and storage

## Technical Details

- **Frontend**: React with TypeScript
- **Storage**: Supabase Storage (images bucket)
- **Database**: Supabase PostgreSQL (gallery_config table)
- **Image Upload**: Direct to Supabase Storage with public URLs
- **Carousel**: Custom enhanced carousel with drag, swipe, and wheel scroll support
