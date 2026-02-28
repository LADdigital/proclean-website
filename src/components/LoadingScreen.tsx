import { useEffect, useRef } from 'react';
import { services } from '../data/services';

interface LoadingScreenProps {
  onDone: () => void;
}

// Phase 1: 500ms logo fade-in then fade-out
// Phase 2: 4500ms carousel — 10 services, 450ms each
// Each card: 80ms ease-in from bottom, 290ms hold, 80ms fade-out at top
// Total: 5000ms

const PHASE1_MS = 500;
const PHASE2_MS = 4500;
const TOTAL_MS = PHASE1_MS + PHASE2_MS;
const CARD_MS = PHASE2_MS / services.length; // 450ms per card

const CARD_RISE_MS = 80;
const CARD_HOLD_MS = CARD_MS - CARD_RISE_MS * 2;
const CARD_FADE_MS = 80;

const FINAL_FADE_MS = 350;
const FINAL_FADE_START = TOTAL_MS - FINAL_FADE_MS;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInCubic(t: number) {
  return t * t * t;
}

export default function LoadingScreen({ onDone }: LoadingScreenProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const logoEl = overlay.querySelector<HTMLElement>('.ls-logo');
    const carouselEl = overlay.querySelector<HTMLElement>('.ls-carousel');
    const cardEls = overlay.querySelectorAll<HTMLElement>('.ls-card');

    let lastCardIndex = -1;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;

      // ── Phase 1: logo ──────────────────────────────────────────────────────
      if (elapsed < PHASE1_MS) {
        const t = elapsed / PHASE1_MS;
        // First half: fade in, second half: fade out
        const logoOpacity = t < 0.5
          ? easeOutCubic(t * 2)
          : 1 - easeInCubic((t - 0.5) * 2);
        if (logoEl) {
          logoEl.style.opacity = String(logoOpacity);
          logoEl.style.transform = `scale(${0.94 + 0.06 * Math.min(t * 2, 1)})`;
        }
        if (carouselEl) carouselEl.style.opacity = '0';
      } else {
        // ── Phase 2: carousel ────────────────────────────────────────────────
        if (logoEl) logoEl.style.opacity = '0';
        if (carouselEl) carouselEl.style.opacity = '1';

        const phase2Elapsed = elapsed - PHASE1_MS;
        const cardIndex = Math.min(
          Math.floor(phase2Elapsed / CARD_MS),
          services.length - 1
        );
        const cardElapsed = phase2Elapsed - cardIndex * CARD_MS;

        if (cardIndex !== lastCardIndex) {
          cardEls.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.display = i === cardIndex ? 'flex' : 'none';
          });
          lastCardIndex = cardIndex;
        }

        const activeCard = cardEls[cardIndex];
        if (activeCard) {
          let opacity: number;
          let translateY: number;

          if (cardElapsed < CARD_RISE_MS) {
            const t = easeOutCubic(cardElapsed / CARD_RISE_MS);
            opacity = t;
            translateY = 40 * (1 - t);
          } else if (cardElapsed < CARD_RISE_MS + CARD_HOLD_MS) {
            opacity = 1;
            translateY = 0;
          } else {
            const t = easeInCubic((cardElapsed - CARD_RISE_MS - CARD_HOLD_MS) / CARD_FADE_MS);
            opacity = 1 - t;
            translateY = -24 * t;
          }

          activeCard.style.opacity = String(Math.max(0, Math.min(1, opacity)));
          activeCard.style.transform = `translateY(${translateY}px)`;
        }
      }

      // ── Final overlay fade-out ───────────────────────────────────────────
      if (elapsed >= FINAL_FADE_START) {
        const t = Math.min((elapsed - FINAL_FADE_START) / FINAL_FADE_MS, 1);
        overlay.style.opacity = String(1 - easeInCubic(t));
        if (t >= 1) {
          onDone();
          return;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
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
      {/* Phase 1 — Logo */}
      <img
        className="ls-logo"
        src="/Photoroom_20260213_195605.png"
        alt="Pro Clean Auto Detail Systems"
        style={{
          position: 'absolute',
          width: 'min(260px, 55vw)',
          height: 'auto',
          opacity: 0,
          transform: 'scale(0.94)',
          willChange: 'opacity, transform',
          pointerEvents: 'none',
        }}
        draggable={false}
      />

      {/* Phase 2 — Services carousel */}
      <div
        className="ls-carousel"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          willChange: 'opacity',
        }}
      >
        {services.map((service) => (
          <div
            key={service.id}
            className="ls-card"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transform: 'translateY(40px)',
              willChange: 'opacity, transform',
              textAlign: 'center',
              padding: '0 24px',
            }}
          >
            <span
              style={{
                fontFamily: 'inherit',
                fontSize: 'clamp(1.25rem, 4vw, 2rem)',
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: 'rgba(255,255,255,0.92)',
                textTransform: 'uppercase',
                lineHeight: 1.2,
              }}
            >
              {service.shortTitle}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
