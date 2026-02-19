import { Instagram, Facebook } from 'lucide-react';
import { CONTACT } from '../data/services';

interface SocialLinksProps {
  variant?: 'light' | 'dark';
}

export default function SocialLinks({ variant = 'dark' }: SocialLinksProps) {
  const baseClasses = 'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110';
  const variantClasses = variant === 'light'
    ? 'bg-white/10 text-white hover:bg-white hover:text-brand-red'
    : 'bg-stone-100 text-stone-600 hover:bg-brand-red hover:text-white';

  return (
    <div className="flex items-center gap-3">
      <a
        href={CONTACT.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow Pro Clean on Instagram"
        className={`${baseClasses} ${variantClasses}`}
      >
        <Instagram className="w-5 h-5" />
      </a>
      <a
        href={CONTACT.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow Pro Clean on Facebook"
        className={`${baseClasses} ${variantClasses}`}
      >
        <Facebook className="w-5 h-5" />
      </a>
    </div>
  );
}
