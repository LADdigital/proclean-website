import { useEffect, useState, useCallback, useRef } from 'react';

const STORAGE_KEY = 'proclean_detail_mode';
const TRIGGER_SEQUENCE = 'detail';
const BUFFER_SIZE = 10;

function isInputElement(element: Element | null): boolean {
  if (!element) return false;
  const tagName = element.tagName.toLowerCase();
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    element.hasAttribute('contenteditable')
  );
}

function hasPhysicalKeyboard(): boolean {
  if (typeof window === 'undefined') return false;
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  return hasFinePointer || !hasCoarsePointer;
}

export function useDetailMode(onToggle?: (isOn: boolean) => void) {
  const [isActive, setIsActive] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) === '1';
  });
  const bufferRef = useRef<string[]>([]);

  const toggle = useCallback(() => {
    setIsActive(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      document.body.setAttribute('data-detail-mode', next ? 'on' : 'off');
      onToggle?.(next);
      return next;
    });
  }, [onToggle]);

  useEffect(() => {
    document.body.setAttribute('data-detail-mode', isActive ? 'on' : 'off');
  }, [isActive]);

  useEffect(() => {
    if (!hasPhysicalKeyboard()) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isInputElement(document.activeElement)) return;

      const char = e.key.toLowerCase();
      if (char.length !== 1) return;

      bufferRef.current.push(char);
      if (bufferRef.current.length > BUFFER_SIZE) {
        bufferRef.current.shift();
      }

      const joined = bufferRef.current.join('');
      if (joined.includes(TRIGGER_SEQUENCE)) {
        bufferRef.current = [];
        toggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

  return { isActive, toggle };
}
