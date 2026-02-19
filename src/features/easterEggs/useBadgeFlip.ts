import { useState, useCallback, useRef, useEffect } from 'react';

const FLIP_BACK_DELAY = 4000;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useBadgeFlip(onReducedMotionFlip?: (message: string) => void) {
  const [isFlipped, setIsFlipped] = useState(false);
  const timerRef = useRef<number | null>(null);

  const handleFlip = useCallback(() => {
    if (prefersReducedMotion()) {
      onReducedMotionFlip?.('Built on Reputation. Not Ads.');
      return;
    }

    setIsFlipped(prev => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      if (!prev) {
        timerRef.current = window.setTimeout(() => {
          setIsFlipped(false);
        }, FLIP_BACK_DELAY);
      }

      return !prev;
    });
  }, [onReducedMotionFlip]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { isFlipped, handleFlip };
}
