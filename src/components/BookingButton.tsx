import { Calendar } from 'lucide-react';
import { BOOKING_URL } from '../data/services';

interface BookingButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export default function BookingButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
}: BookingButtonProps) {
  const baseClasses = 'inline-flex items-center gap-2 font-semibold rounded-lg btn-apple-hover';

  const variants = {
    primary: 'bg-brand-red text-white hover:shadow-lg hover:shadow-red-900/30',
    secondary: 'bg-brand-orange text-white hover:shadow-lg hover:shadow-orange-900/30',
    outline: 'border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <Calendar className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
      {children || 'Book Now'}
    </a>
  );
}
