import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import ConfirmModal from './ConfirmModal';

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  service_id: string;
  position: number;
  created_at: string;
}

export default function AdminGalleryPanel() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .order('position', { ascending: true });
    setImages(data ?? []);
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress({ done: 0, total: files.length });

    const currentMax = images.length > 0 ? Math.max(...images.map(i => i.position)) : 0;

    await Promise.all(
      files.map(async (file, idx) => {
        const ext = file.name.split('.').pop();
        const path = `gallery/${Date.now()}-${idx}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('admin-gallery')
          .upload(path, file, { upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage.from('admin-gallery').getPublicUrl(path);
          const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
          await supabase.from('gallery_images').insert({
            image_url: data.publicUrl,
            title: baseName || 'Gallery Image',
            alt_text: null,
            service_id: 'general',
            position: currentMax + idx + 1,
          });
        }

        setUploadProgress(prev => prev ? { ...prev, done: prev.done + 1 } : null);
      })
    );

    await fetchImages();
    setUploadProgress(null);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await supabase.from('gallery_images').delete().eq('id', deleteTarget.id);
    setImages(prev => prev.filter(i => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Gallery</h2>
        <span className="text-stone-400 text-sm">{images.length} photo{images.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="p-5 rounded-2xl bg-[#2a2a2a] border border-stone-700 mb-6">
        <h3 className="text-sm font-semibold text-white mb-4">Upload Photos</h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full py-3 rounded-xl border-2 border-dashed border-stone-600 hover:border-[#B91C1C] text-stone-400 hover:text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          {uploading && uploadProgress
            ? `Uploading ${uploadProgress.done} / ${uploadProgress.total}...`
            : 'Choose Photos from Device'}
        </button>
        {uploading && uploadProgress && (
          <div className="mt-3 w-full bg-stone-700 rounded-full h-1.5">
            <div
              className="bg-[#B91C1C] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(uploadProgress.done / uploadProgress.total) * 100}%` }}
            />
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
        <p className="text-xs text-stone-500 mt-2">You can select multiple photos at once</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-6 h-6 border-2 border-[#B91C1C] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <p className="text-stone-500 text-sm text-center py-10">No photos yet. Upload one above.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((image) => (
            <div key={image.id} className="relative group rounded-xl overflow-hidden aspect-square bg-stone-800">
              <img
                src={image.image_url}
                alt={image.alt_text ?? 'Gallery image'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <button
                  onClick={() => setDeleteTarget(image)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-lg bg-[#B91C1C] text-white text-xs font-medium"
                >
                  Delete
                </button>
              </div>
              {image.alt_text && (
                <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-black/60 text-white text-xs truncate">
                  {image.alt_text}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Photo"
          message="Are you sure you want to delete this photo? This cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
