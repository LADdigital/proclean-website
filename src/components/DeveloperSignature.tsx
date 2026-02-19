import { useEffect, useState, useRef } from 'react';
import { prefersReducedMotion } from '../utils/animations';

export default function DeveloperSignature() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (prefersReducedMotion()) {
      setIsVisible(true);
      setHasRevealed(true);
      return;
    }

    const handleScroll = () => {
      if (hasRevealed) return;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const bottomThreshold = documentHeight * 0.88;

      if (scrollPosition >= bottomThreshold) {
        scrollTimeoutRef.current = setTimeout(() => {
          setIsVisible(true);
          setHasRevealed(true);
        }, 2000);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [hasRevealed]);

  return (
    <div className="bg-brand-charcoal pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <a
            href="https://laddigitalofyakima.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-10 transition-all duration-[800ms]"
            style={{
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
            }}
          >
            <img
              src="/3B18F411-3D29-485D-B553-28675ABEFC9D.png"
              alt="LAD Digital"
              className="h-24 sm:h-28 w-auto transition-all duration-[600ms] hover:scale-105"
              style={{
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                filter: 'brightness(0.85)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'brightness(0.85)';
              }}
            />
          </a>

          <div
            className="h-px w-[60%] mb-7"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
          />

          <a
            href="https://laddigitalofyakima.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group transition-all duration-[240ms]"
            style={{
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
            }}
          >
            <span
              className="text-[13px] tracking-[0.05em] font-normal group-hover:opacity-100 transition-opacity duration-[600ms] group-hover:underline decoration-1 underline-offset-4"
              style={{
                color: 'rgba(255, 255, 255, 0.65)',
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              Crafted with precision by LAD Digital
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
