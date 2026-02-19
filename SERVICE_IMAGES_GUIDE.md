# Service Images Upload Guide

## How to Upload Service Images

Each service on the Services page can have its own custom image that showcases your actual work.

### Accessing Editor Mode

To upload or manage service images, add `?edit=true` to the Services page URL:

```
https://yoursite.com/services?edit=true
```

### In Editor Mode

When in editor mode, you'll see upload areas for each service:

1. **Upload a New Image**
   - Click on the upload area
   - Select an image from your computer
   - The image will automatically upload and display
   - Supported formats: JPG, PNG, WEBP
   - Maximum file size: 5MB

2. **Replace an Existing Image**
   - Hover over the current image
   - Click "Replace" button
   - Select a new image

3. **Remove an Image**
   - Hover over the current image
   - Click "Remove" button
   - Confirm the removal

### In Production Mode

When viewing the site normally (without `?edit=true`):
- Only uploaded images are displayed
- No upload controls are visible
- Images use object-cover for proper display
- Fallback to stock images if no custom image uploaded

### Storage

- All images are stored in Supabase Storage
- Images are publicly accessible
- Each service can have one image
- Images persist across sessions

### Image Guidelines

For best results:
- Use high-quality photos of your actual work
- Recommended aspect ratio: 4:3
- Minimum resolution: 1200x900 pixels
- Show clear before/after or finished work
- Ensure good lighting and focus
