import React, { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  darkFallback?: boolean;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
  priority = false,
  width,
  height,
  darkFallback = false,
}) => {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-4 ${
          darkFallback
            ? 'bg-[#1D2922] text-[#D7A65A]'
            : 'bg-[#E7DFD0] text-[#101B17]'
        } ${className}`}
        role="img"
        aria-label={alt}
      >
        <UtensilsCrossed className="w-6 h-6 opacity-55 mb-1.5" />
        {fallbackLabel && (
          <span className="text-xs font-medium text-center line-clamp-2 opacity-80">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      referrerPolicy="no-referrer"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`${className} transition-opacity duration-300 ${
        loaded || priority ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
};
