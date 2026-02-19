export const EASING = {
  apple: 'cubic-bezier(0.22, 1, 0.36, 1)',
  appleValues: [0.22, 1, 0.36, 1] as const,
};

export const DURATION = {
  micro: 220,
  small: 300,
  medium: 600,
  large: 800,
  xlarge: 1000,
};

export const STAGGER = {
  tight: 80,
  medium: 120,
  loose: 160,
};

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const applyReducedMotion = <T>(animationValue: T, fallback: T): T => {
  return prefersReducedMotion() ? fallback : animationValue;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const lerp = (start: number, end: number, progress: number): number => {
  return start + (end - start) * progress;
};
