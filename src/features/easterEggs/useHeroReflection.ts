import { useEffect, useRef, useCallback } from 'react';

const REST_POSITION = 50;
const MAX_OFFSET = 30;
const IDLE_TIMEOUT = 800;
const EASE_DURATION = 400;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useHeroReflection(containerRef: React.RefObject<HTMLElement>) {
  const bandRef = useRef<HTMLDivElement | null>(null);
  const lastScrollY = useRef(0);
  const currentOffset = useRef(REST_POSITION);
  const targetOffset = useRef(REST_POSITION);
  const idleTimer = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);
  const isEasing = useRef(false);
  const easeStartTime = useRef(0);
  const easeStartValue = useRef(REST_POSITION);

  const updateBandPosition = useCallback((offset: number) => {
    if (bandRef.current) {
      bandRef.current.style.transform = `translateX(${offset}%) rotate(25deg)`;
    }
  }, []);

  const easeToRest = useCallback(() => {
    if (prefersReducedMotion()) return;

    isEasing.current = true;
    easeStartTime.current = performance.now();
    easeStartValue.current = currentOffset.current;

    const animate = (now: number) => {
      const elapsed = now - easeStartTime.current;
      const progress = Math.min(elapsed / EASE_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      currentOffset.current = easeStartValue.current + (REST_POSITION - easeStartValue.current) * eased;
      updateBandPosition(currentOffset.current);

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      } else {
        isEasing.current = false;
        currentOffset.current = REST_POSITION;
      }
    };

    rafId.current = requestAnimationFrame(animate);
  }, [updateBandPosition]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const container = containerRef.current;
    if (!container) return;

    const band = document.createElement('div');
    band.className = 'hero-reflection-band';
    bandRef.current = band;

    const overlay = document.createElement('div');
    overlay.className = 'hero-reflection-overlay';
    overlay.appendChild(band);
    container.appendChild(overlay);

    updateBandPosition(REST_POSITION);

    const handleScroll = () => {
      if (isEasing.current && rafId.current) {
        cancelAnimationFrame(rafId.current);
        isEasing.current = false;
      }

      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY.current;
      lastScrollY.current = scrollY;

      const movement = Math.min(Math.max(delta * 0.8, -MAX_OFFSET), MAX_OFFSET);
      targetOffset.current = REST_POSITION + movement;
      currentOffset.current = targetOffset.current;
      updateBandPosition(currentOffset.current);

      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
      }
      idleTimer.current = window.setTimeout(easeToRest, IDLE_TIMEOUT);
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      overlay.remove();
    };
  }, [containerRef, updateBandPosition, easeToRest]);
}
