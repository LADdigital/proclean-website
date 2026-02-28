import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { AdminServiceRecord } from '../hooks/useAdminServices';
import { prefersReducedMotion } from '../utils/animations';

const svgProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const serviceIcons: Record<string, React.ReactNode> = {
  'paint-correction': (
    <svg {...svgProps}><path d="M4 20h16"/><path d="M6 20l2-6h8l2 6"/><path d="M9 10l3-6 3 6"/></svg>
  ),
  'ceramic-coating': (
    <svg {...svgProps}><path d="M12 3l7 4v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V7l7-4z"/></svg>
  ),
  'paintless-dent-repair': (
    <svg {...svgProps}><rect x="3" y="10" width="10" height="6" rx="1"/><path d="M14 7l4 4"/><path d="M16 5l3 3"/></svg>
  ),
  'complete-detailing': (
    <svg {...svgProps}><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/><circle cx="19" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="19" cy="18" r="2" fill="currentColor" stroke="none"/></svg>
  ),
  'interior-detailing': (
    <svg {...svgProps}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  'exterior-detailing': (
    <svg {...svgProps}><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3"/><path d="M8 21h8"/><path d="M12 3v4"/><path d="M8 7h8"/></svg>
  ),
  'wheel-restoration': (
    <svg {...svgProps}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>
  ),
  'paint-touchup': (
    <svg {...svgProps}><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
  ),
  'rock-chip-repair': (
    <svg {...svgProps}><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6"/><path d="M9 15l2-2"/><path d="M13 9l2 2"/></svg>
  ),
  'rv-detailing': (
    <svg {...svgProps}><rect x="1" y="7" width="18" height="11" rx="2"/><path d="M19 9h2l2 4v2h-4"/><circle cx="6" cy="18" r="2"/><circle cx="16" cy="18" r="2"/></svg>
  ),
  'boat-detailing': (
    <svg {...svgProps}><path d="M3 17l4-8 5 6 3-4 4 6"/><path d="M2 20h20"/><path d="M12 3v4"/><path d="M8 7h8"/></svg>
  ),
};

const fallbackIcon = (
  <svg {...svgProps}><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>
);

const VISIBLE_COUNT = 4;
const AUTO_ADVANCE_MS = 3500;

interface Props {
  services: AdminServiceRecord[];
  loading: boolean;
}

export default function ServiceCarousel({ services, loading }: Props) {
  const [startIndex, setStartIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const reduced = prefersReducedMotion();

  const total = services.length;
  const canScroll = total > VISIBLE_COUNT;

  const advance = useCallback(() => {
    if (!canScroll) return;
    setStartIndex(i => (i + 1) % total);
  }, [canScroll, total]);

  const retreat = useCallback(() => {
    if (!canScroll) return;
    setStartIndex(i => (i - 1 + total) % total);
  }, [canScroll, total]);

  useEffect(() => {
    if (reduced || hovered || focused || !canScroll) return;
    timerRef.current = setInterval(advance, AUTO_ADVANCE_MS);
    return () => clearInterval(timerRef.current);
  }, [reduced, hovered, focused, canScroll, advance]);

  const visibleServices = total > 0
    ? Array.from({ length: Math.min(VISIBLE_COUNT, total) }, (_, i) => services[(startIndex + i) % total])
    : [];

  if (loading) {
    return (
      <div className="hidden lg:flex flex-col gap-2 w-56 xl:w-64">
        <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">Our Services</p>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 rounded-lg bg-white/10 animate-pulse" />
        ))}
      </div>
    );
  }

  if (total === 0) return null;

  return (
    <div
      className="hidden lg:flex flex-col gap-1.5 w-56 xl:w-64"
      role="region"
      aria-label="Quick service navigation"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowUp') { e.preventDefault(); retreat(); }
        if (e.key === 'ArrowDown') { e.preventDefault(); advance(); }
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Our Services</p>
        {canScroll && (
          <div className="flex gap-1">
            <button
              onClick={retreat}
              aria-label="Previous service"
              className="w-5 h-5 flex items-center justify-center rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={advance}
              aria-label="Next service"
              className="w-5 h-5 flex items-center justify-center rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {visibleServices.map((service) => {
        const key = service.service_key ?? service.id;
        const icon = serviceIcons[key] ?? fallbackIcon;
        return (
          <Link
            key={service.id}
            to={`/services#${key}`}
            aria-label={`View ${service.title} service`}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 hover:border-white/25 transition-all duration-200"
          >
            <span className="shrink-0 text-white/70 group-hover:text-white transition-colors">
              {icon}
            </span>
            <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors leading-tight">
              {service.short_title || service.title}
            </span>
            <ChevronDown className="w-3 h-3 text-white/30 group-hover:text-white/60 transition-colors ml-auto shrink-0 -rotate-90" />
          </Link>
        );
      })}

      {canScroll && (
        <p className="text-white/30 text-xs text-center mt-0.5">
          {startIndex + 1}–{Math.min(startIndex + VISIBLE_COUNT, total)} of {total}
        </p>
      )}
    </div>
  );
}
