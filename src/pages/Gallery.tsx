import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import BookingButton from '../components/BookingButton';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { supabase } from '../lib/supabase';

interface GalleryImage {
  id: string;
  image_url: string;
  position: number;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animRef = useScrollAnimation();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('id, image_url, position')
      .order('position', { ascending: true });

    if (error) {
      setFetchError(true);
    } else if (data) {
      setImages(data);
    }
    setLoading(false);
  }

  const openLightbox = useCallback((index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, goToPrevious, goToNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  return (
    <div ref={animRef}>
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-brand-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/procleanteam.jpeg"
            alt="Pro Clean Auto Detail Systems gallery"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/80 to-brand-charcoal" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-brand-orange-light font-semibold text-sm uppercase tracking-wider mb-3">
              Our Work
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
              Auto Detailing Gallery
            </h1>
            <p className="text-lg text-stone-400 leading-relaxed">
              Browse real results from Pro Clean Auto Detail Systems. Every photo represents
              actual work performed at our Yakima, WA shop.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl sm:rounded-2xl bg-stone-200 animate-pulse"
                />
              ))}
            </div>
          ) : fetchError ? (
            <div className="text-center py-20">
              <p className="text-stone-500 text-lg">Unable to load gallery. Please try again later.</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-stone-500 text-lg">Add images in editor mode.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => openLightbox(index)}
                  className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 image-hover-apple shadow-lg"
                >
                  <img
                    src={image.image_url}
                    alt="Gallery image"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-brand-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Want Results Like These?
          </h2>
          <p className="text-stone-400 text-lg mb-8">
            Book your appointment and let us transform your vehicle.
            Serving Yakima, WA and surrounding areas.
          </p>
          <BookingButton size="lg" variant="primary">
            Book Your Appointment
          </BookingButton>
        </div>
      </section>

      {lightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-enter"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white apple-transition z-10"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 p-2 text-white/70 hover:text-white apple-transition z-10 hidden sm:block"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 p-2 text-white/70 hover:text-white apple-transition z-10 hidden sm:block"
            aria-label="Next image"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div
            className="max-w-5xl max-h-[85vh] px-4 modal-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex].image_url}
              alt="Gallery image"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
