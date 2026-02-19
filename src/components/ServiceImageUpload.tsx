import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ServiceImageUploadProps {
  serviceId: string;
  serviceName: string;
  currentImageUrl?: string;
  onImageUpdate: (imageUrl: string | null) => void;
}

export default function ServiceImageUpload({
  serviceId,
  serviceName,
  currentImageUrl,
  onImageUpdate,
}: ServiceImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${serviceId}-${Date.now()}.${fileExt}`;
      const filePath = `services/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('service-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('service-images')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('service_images')
        .upsert({
          service_id: serviceId,
          image_url: publicUrl,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'service_id',
        });

      if (dbError) throw dbError;

      setImageUrl(publicUrl);
      onImageUpdate(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (!confirm('Remove this image?')) return;

    try {
      const { error } = await supabase
        .from('service_images')
        .delete()
        .eq('service_id', serviceId);

      if (error) throw error;

      setImageUrl('');
      onImageUpdate(null);
    } catch (error) {
      console.error('Error removing image:', error);
      alert('Failed to remove image. Please try again.');
    }
  };

  if (imageUrl) {
    return (
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
        <img
          src={imageUrl}
          alt={serviceName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-white text-brand-charcoal rounded-lg font-medium hover:bg-stone-100 transition-colors disabled:opacity-50"
          >
            Replace
          </button>
          <button
            onClick={handleRemove}
            className="px-4 py-2 bg-brand-red text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Remove
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="aspect-[4/3] rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 flex items-center justify-center hover:border-brand-red hover:bg-red-50 transition-all cursor-pointer group"
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="text-center px-8">
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-red border-t-transparent"></div>
            <p className="text-sm text-stone-600">Uploading...</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-white border-2 border-stone-200 text-stone-400 group-hover:text-brand-red group-hover:border-brand-red flex items-center justify-center mx-auto mb-4 transition-colors">
              <Upload className="w-8 h-8" />
            </div>
            <p className="text-sm text-stone-600 group-hover:text-brand-red transition-colors font-medium">
              Upload {serviceName.toLowerCase()} photo
            </p>
            <p className="text-xs text-stone-400 mt-2">
              Click to select image
            </p>
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
      />
    </div>
  );
}
