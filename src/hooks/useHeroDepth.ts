import { useEffect, useState } from 'react';
import { clamp, prefersReducedMotion } from '../utils/animations';

const MAX_SCROLL = 300;

export function useHeroDepth() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scroll = window.scrollY;
          const progress = clamp(scroll / MAX_SCROLL, 0, 1);
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

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
