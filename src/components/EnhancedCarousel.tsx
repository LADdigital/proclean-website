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
  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const animationFrameRef = useRef<number>();
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  const duplicatedImages = [...images, ...images, ...images];

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return;

    const ITEM_WIDTH = 320 + 24;
    const totalWidth = images.length * ITEM_WIDTH;
    const speed = 0.4;

    const animate = () => {
      if (!pausedRef.current) {
        positionRef.current += speed;
        if (positionRef.current >= totalWidth) {
          positionRef.current -= totalWidth;
        }
        track.style.transform = `translateX(-${positionRef.current}px)`;
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [images.length]);

  return (
    <div
      className="relative cursor-pointer select-none overflow-hidden"
      onClick={() => setPaused(p => !p)}
      title={paused ? 'Click to resume' : 'Click to pause'}
    >
      <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-stone-50 to-transparent z-10 pointer-events-none" />
      <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-stone-50 to-transparent z-10 pointer-events-none" />

      <div
        ref={trackRef}
        className="flex gap-6"
        style={{
          willChange: 'transform',
          width: 'max-content',
        }}
      >
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-80 h-64 rounded-2xl overflow-hidden shadow-lg"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              draggable={false}
              loading="lazy"
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
    </div>
  );
}
