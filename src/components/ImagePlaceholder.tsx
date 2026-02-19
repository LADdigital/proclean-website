import { Image as ImageIcon } from 'lucide-react';

interface ImagePlaceholderProps {
  alt?: string;
  className?: string;
}

export default function ImagePlaceholder({ alt = 'Image coming soon', className = '' }: ImagePlaceholderProps) {
  return (
    <div className={`bg-gradient-to-br from-stone-100 to-stone-200 flex flex-col items-center justify-center ${className}`}>
      <ImageIcon className="w-12 h-12 text-stone-400 mb-3" />
      <p className="text-stone-500 font-medium">Image Coming Soon</p>
      <p className="text-xs text-stone-400 mt-1">{alt}</p>
    </div>
  );
}
