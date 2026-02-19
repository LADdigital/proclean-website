import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

interface GalleryImage {
  id: string;
  service_id: string;
  image_url: string;
  title: string;
  alt_text?: string;
}

export default function MovingGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('id, service_id, image_url, title, alt_text')
          .order('position', { ascending: true });

        if (error) throw error;
        setImages(data || []);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-64 bg-stone-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!images.length) {
    return null;
  }

  return (
    <div className="py-16 sm:py-20 bg-stone-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center fade-in">
          <p className="text-brand-red font-semibold text-sm uppercase tracking-wider mb-3">
            Our Gallery
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-charcoal">
            Professional Results
          </h2>
        </div>
      </div>

      <div
        className="relative w-full overflow-hidden cursor-pointer select-none"
        onClick={() => setPaused(p => !p)}
        title={paused ? 'Click to resume' : 'Click to pause'}
      >
        <div
          ref={trackRef}
          className="flex gap-6 animate-scroll"
          style={{ animationPlayState: paused ? 'paused' : 'running' }}
        >
          {[...images, ...images].map((image, idx) => (
            <div
              key={`${image.id}-${idx}`}
              className="shrink-0 w-80 h-60 rounded-xl overflow-hidden shadow-lg border border-stone-200 group bg-brand-charcoal flex items-center justify-center"
            >
              <img
                src={image.image_url}
                alt={image.alt_text || image.title}
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="text-white">
                  <p className="text-sm font-semibold">{image.title}</p>
                  <p className="text-xs text-stone-300 capitalize mt-1">{image.service_id.replace('-', ' ')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {paused && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 text-white text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm">
              Paused — click to resume
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 12px));
          }
        }

        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
