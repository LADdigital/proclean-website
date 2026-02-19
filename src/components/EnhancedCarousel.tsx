import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../utils/animations';

interface CarouselImage {
  src: string;
  alt: string;
}

interface EnhancedCarouselProps {
  images: CarouselImage[];
}

export default function EnhancedCarousel({ images }: EnhancedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  const duplicatedImages = [...images, ...images, ...images];

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    if (prefersReducedMotion()) return;

    const speed = 0.5;

    const animate = () => {
      if (container && !pausedRef.current) {
        container.scrollLeft += speed;

        if (container.scrollLeft >= container.scrollWidth / 3) {
          container.scrollLeft = 0;
        }
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative cursor-pointer select-none" onClick={() => setPaused(p => !p)} title={paused ? 'Click to resume' : 'Click to pause'}>
      <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-stone-50 to-transparent z-10 pointer-events-none" />
      <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-stone-50 to-transparent z-10 pointer-events-none" />

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide"
        style={{
          cursor: 'inherit',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-80 h-64 rounded-2xl overflow-hidden shadow-lg image-hover-apple"
            style={{ scrollSnapAlign: 'start' }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {paused && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="bg-black/50 text-white text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm">
            Paused — click to resume
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
