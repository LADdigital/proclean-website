import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useGalleryConfig(key: string, defaultImages: { src: string; alt: string }[]) {
  const [images, setImages] = useState<{ src: string; alt: string }[]>(defaultImages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, [key]);

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_config')
        .select('images')
        .eq('key', key)
        .maybeSingle();

      if (error) throw error;

      if (data && Array.isArray(data.images) && data.images.length > 0) {
        const loadedImages = data.images.map((src: string, index: number) => ({
          src,
          alt: `Gallery image ${index + 1}`,
        }));
        setImages(loadedImages);
      }
    } catch (error) {
      console.error('Error loading gallery config:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateImages = async (newImageUrls: string[]) => {
    try {
      const { error } = await supabase
        .from('gallery_config')
        .update({
          images: newImageUrls,
          updated_at: new Date().toISOString()
        })
        .eq('key', key);

      if (error) throw error;

      const updatedImages = newImageUrls.map((src, index) => ({
        src,
        alt: `Gallery image ${index + 1}`,
      }));
      setImages(updatedImages);
    } catch (error) {
      console.error('Error updating gallery config:', error);
      throw error;
    }
  };

  return { images, loading, updateImages };
}
