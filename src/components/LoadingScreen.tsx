import { useEffect, useRef } from 'react';

interface LoadingScreenProps {
  onDone: () => void;
}

export default function LoadingScreen({ onDone }: LoadingScreenProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    let raf: number;

    const totalMs = 1800;
    const logoFadeMs = 600;
    const sweepDelayMs = 700;
    const sweepMs = 800;
    const fadeOutMs = 400;
    const fadeOutStartMs = sweepDelayMs + sweepMs - 200;

    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;

      const logoEl = overlay.querySelector<HTMLElement>('.ls-logo');
      const sweepEl = overlay.querySelector<HTMLElement>('.ls-sweep');

      if (logoEl) {
        const t = Math.min(elapsed / logoFadeMs, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        logoEl.style.opacity = String(eased);
        logoEl.style.transform = `scale(${0.95 + 0.05 * eased})`;
      }

      if (sweepEl && elapsed >= sweepDelayMs) {
        const sweepElapsed = elapsed - sweepDelayMs;
        const t = Math.min(sweepElapsed / sweepMs, 1);
        sweepEl.style.transform = `translateX(${-110 + t * 220}%)`;
        sweepEl.style.opacity = t < 0.95 ? '1' : String(1 - (t - 0.95) / 0.05);
      }

      if (elapsed >= fadeOutStartMs) {
        const fadeT = Math.min((elapsed - fadeOutStartMs) / fadeOutMs, 1);
        overlay.style.opacity = String(1 - fadeT);
        if (fadeT >= 1) {
          onDone();
          return;
        }
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#1C1917',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        willChange: 'opacity',
      }}
    >
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: 'min(280px, 60vw)',
          borderRadius: '8px',
        }}
      >
        <img
          className="ls-logo"
          src="/Photoroom_20260213_195605.png"
          alt="Pro Clean Auto Detail Systems"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            opacity: 0,
            transform: 'scale(0.95)',
            willChange: 'opacity, transform',
          }}
          draggable={false}
        />
        <div
          className="ls-sweep"
          style={{
            position: 'absolute',
            inset: '-20% -30%',
            transform: 'translateX(-110%)',
            background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.38) 50%, transparent 70%)',
            willChange: 'transform',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}
