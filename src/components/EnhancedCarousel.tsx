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
  const [currentSpeed, setCurrentSpeed] = useState(0.5);
  const targetSpeedRef = useRef(0.5);
  const isInteractingRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout>();

  const duplicatedImages = [...images, ...images, ...images];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    if (prefersReducedMotion()) return;

    const baseSpeed = 0.5;
    const acceleration = 0.02;

    const animate = () => {
      if (container) {
        const speedDiff = targetSpeedRef.current - currentSpeed;
        const newSpeed = currentSpeed + speedDiff * acceleration;
        setCurrentSpeed(newSpeed);

        if (!isInteractingRef.current) {
          container.scrollLeft += newSpeed;

          if (container.scrollLeft >= container.scrollWidth / 3) {
            container.scrollLeft = 0;
          }
        }
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleInteractionStart = () => {
      isInteractingRef.current = true;
      targetSpeedRef.current = 0.1;

      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };

    const handleInteractionEnd = () => {
      resumeTimeoutRef.current = setTimeout(() => {
        isInteractingRef.current = false;
        targetSpeedRef.current = baseSpeed;
      }, 2000);
    };

    container.addEventListener('mouseenter', handleInteractionStart);
    container.addEventListener('mouseleave', handleInteractionEnd);
    container.addEventListener('touchstart', handleInteractionStart);
    container.addEventListener('touchend', handleInteractionEnd);

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
      container.removeEventListener('mouseenter', handleInteractionStart);
      container.removeEventListener('mouseleave', handleInteractionEnd);
      container.removeEventListener('touchstart', handleInteractionStart);
      container.removeEventListener('touchend', handleInteractionEnd);
    };
  }, [currentSpeed]);

  return (
    <div className="relative">
      <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-stone-50 to-transparent z-10 pointer-events-none" />
      <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-stone-50 to-transparent z-10 pointer-events-none" />

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide"
        style={{
          cursor: 'default',
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
