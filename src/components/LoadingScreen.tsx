import { useEffect, useRef } from 'react';
import { services } from '../data/services';

interface LoadingScreenProps {
  onDone: () => void;
}

// ─── Timing history ───────────────────────────────────────────────────────────
// Original:          500 / 4500ms total (80ms rise/fade, 350ms final)
// After ×1.2 (+20%): 600 / 5400ms total (96ms rise/fade, 420ms final)
// After ×1.15 (+15%): 690 / 6210ms total (111ms rise/fade, 483ms final)
// After ÷1.08 (-8%):  639 / 5750ms total (103ms rise/fade, 447ms final)
// Capped to 5500ms:   550 / 4950ms total (90ms rise/fade, 400ms final)  ← current
//
// Services carousel: 8 cards × ~619ms each
// Per card: 90ms rise + 439ms hold + 90ms fade

const PHASE1_MS = 550;
const PHASE2_MS = 4950;
const TOTAL_MS = PHASE1_MS + PHASE2_MS;
const CARD_MS = PHASE2_MS / services.length; // ~619ms per card (8 services)

const CARD_RISE_MS = 90;
const CARD_FADE_MS = 90;
const CARD_HOLD_MS = CARD_MS - CARD_RISE_MS - CARD_FADE_MS;

const FINAL_FADE_MS = 400;
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
            el.style.transform = 'translateY(48px)';
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
            translateY = 48 * (1 - t);
          } else if (cardElapsed < CARD_RISE_MS + CARD_HOLD_MS) {
            opacity = 1;
            translateY = 0;
          } else {
            const t = easeInCubic((cardElapsed - CARD_RISE_MS - CARD_HOLD_MS) / CARD_FADE_MS);
            opacity = 1 - t;
            translateY = -28 * t;
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
          padding: '0 24px',
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
              transform: 'translateY(48px)',
              willChange: 'opacity, transform',
            }}
          >
            {/* Card shell */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(14px, 3vw, 22px) clamp(28px, 6vw, 52px)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                boxShadow: '0 4px 32px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset',
                backdropFilter: 'blur(6px)',
                minWidth: 'clamp(220px, 50vw, 420px)',
                maxWidth: 'min(560px, 88vw)',
              }}
            >
              {/* Accent bar */}
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(212,163,79,0.8), transparent)',
                  borderRadius: '0 0 2px 2px',
                }}
              />
              <span
                style={{
                  fontFamily: 'inherit',
                  fontSize: 'clamp(1rem, 3.5vw, 1.6rem)',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: '#F5F0E8',
                  textTransform: 'uppercase',
                  lineHeight: 1.2,
                  textAlign: 'center',
                  textShadow: '0 1px 8px rgba(0,0,0,0.6)',
                }}
              >
                {service.shortTitle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
