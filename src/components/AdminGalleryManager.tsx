import { useState, useRef } from 'react';
import { Upload, X, GripVertical } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminGalleryManagerProps {
  onImagesUpdate: (images: string[]) => void;
  currentImages: string[];
}

export default function AdminGalleryManager({ onImagesUpdate, currentImages }: AdminGalleryManagerProps) {
  const [images, setImages] = useState<string[]>(currentImages);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);

    setImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    onImagesUpdate(images);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      onImagesUpdate(newImages);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const event = {
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(event);
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = images[index];

    if (imageUrl.includes('supabase')) {
      try {
        const pathMatch = imageUrl.match(/gallery\/[^?]+/);
        if (pathMatch) {
          await supabase.storage
            .from('images')
            .remove([pathMatch[0]]);
        }
      } catch (error) {
        console.error('Error removing image from storage:', error);
      }
    }

    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesUpdate(newImages);
  };

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="bg-white border-2 border-dashed border-brand-red/30 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-brand-charcoal">
          Admin: Gallery Manager
        </h3>
        <span className="text-xs bg-brand-red/10 text-brand-red px-2 py-1 rounded">
          Dev Only
        </span>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-brand-red bg-red-50'
            : 'border-stone-300 hover:border-brand-red/50'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-stone-400 mx-auto mb-4" />
        <p className="text-sm text-stone-600 mb-2">
          Drag and drop images here, or click to select
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-block px-4 py-2 bg-brand-red text-white text-sm font-medium rounded-lg hover:bg-brand-red-dark cursor-pointer transition-colors"
        >
          {uploading ? 'Uploading...' : 'Select Files'}
        </label>
      </div>

      {images.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-stone-700 mb-3">
            Current Images ({images.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className="relative group aspect-video bg-stone-100 rounded-lg overflow-hidden cursor-move border-2 border-stone-200 hover:border-brand-red/50 transition-colors"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-white/90 rounded p-1">
                  <GripVertical className="w-4 h-4 text-stone-500" />
                </div>
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
