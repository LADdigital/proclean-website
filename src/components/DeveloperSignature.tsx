import { useEffect, useState, useRef } from 'react';
import { prefersReducedMotion } from '../utils/animations';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isDesktop;
}

export default function DeveloperSignature() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const isDesktop = useIsDesktop();

  const animated = isDesktop && !prefersReducedMotion();

  useEffect(() => {
    if (!animated) {
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
  }, [animated, hasRevealed]);

  return (
    <div className="bg-brand-charcoal pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <a
            href="https://laddigitalofyakima.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-10"
            style={animated ? {
              transition: 'opacity 800ms cubic-bezier(0.22, 1, 0.36, 1), transform 800ms cubic-bezier(0.22, 1, 0.36, 1)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
            } : undefined}
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
            className="group"
            style={animated ? {
              transition: 'opacity 240ms cubic-bezier(0.22, 1, 0.36, 1), transform 240ms cubic-bezier(0.22, 1, 0.36, 1)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
            } : undefined}
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
