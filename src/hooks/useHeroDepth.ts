import { useEffect, useRef, useState } from 'react';
import { clamp, prefersReducedMotion } from '../utils/animations';

const MAX_SCROLL = 300;

function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
}

export function useHeroDepth() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion() || !isDesktop()) return;

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const scroll = window.scrollY;
          const progress = clamp(scroll / MAX_SCROLL, 0, 1);
          setScrollProgress(progress);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const backgroundTransform = {
    transform: `translateY(${scrollProgress * -20}px) scale(${1 + scrollProgress * 0.05})`,
    transition: 'none',
  };

  const contentTransform = {
    transform: `translateY(${scrollProgress * -10}px)`,
    transition: 'none',
  };

  return { scrollProgress, backgroundTransform, contentTransform };
}
