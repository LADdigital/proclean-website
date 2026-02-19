import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../utils/animations';

interface RevealOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  triggerOnce?: boolean;
}

export function useRevealAnimation(options: RevealOptions = {}) {
  const {
    threshold = 0.2,
    rootMargin = '0px',
    delay = 0,
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered.current)) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              hasTriggered.current = true;
            }, delay);
          } else {
            setIsVisible(true);
            hasTriggered.current = true;
          }
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, delay, triggerOnce]);

  return { ref, isVisible };
}

export function useStaggeredReveal(count: number, staggerDelay = 80) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const { ref, isVisible } = useRevealAnimation();

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisibleItems(new Set(Array.from({ length: count }, (_, i) => i)));
      return;
    }

    if (isVisible) {
      Array.from({ length: count }).forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems((prev) => new Set([...prev, index]));
        }, index * staggerDelay);
      });
    }
  }, [isVisible, count, staggerDelay]);

  return { ref, visibleItems };
}
