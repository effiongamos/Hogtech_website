import React, { useState, useEffect, useRef } from 'react';
import { ImageOff } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  rootMargin?: string;
  threshold?: number;
  decoding?: 'async' | 'sync' | 'auto';
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
}

/**
 * Reusable image component with IntersectionObserver-based lazy loading.
 * Defers image fetching and decoding until the element approaches the viewport,
 * displaying a graceful dark-mode compatible skeleton placeholder and smooth fade-in.
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = 'relative w-full h-full overflow-hidden bg-slate-100 dark:bg-slate-800',
  rootMargin = '150px 0px 150px 0px',
  threshold = 0.01,
  decoding = 'async',
  referrerPolicy = 'no-referrer',
  onClick,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    // If IntersectionObserver is unavailable in the environment, load immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const currentEl = containerRef.current;
    if (!currentEl) return;

    let observer: IntersectionObserver | null = null;

    try {
      observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            setIsInView(true);
            if (observer && currentEl) {
              observer.unobserve(currentEl);
              observer.disconnect();
            }
          }
        },
        {
          root: null,
          rootMargin,
          threshold,
        }
      );

      observer.observe(currentEl);
    } catch {
      // In case of any observation error, fallback to loading immediately
      setIsInView(true);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [rootMargin, threshold]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${containerClassName}`}
      onClick={onClick}
      style={style}
    >
      {/* Skeleton Shimmer Placeholder before load */}
      {(!isLoaded || !isInView) && !hasError && (
        <div
          className="absolute inset-0 bg-slate-200 dark:bg-slate-800/80 animate-pulse transition-opacity duration-300"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      )}

      {/* Render Image once observed in viewport */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding={decoding}
          referrerPolicy={referrerPolicy}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`${className} transition-opacity duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Fallback state if image fails to load */}
      {hasError && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-800/90 text-slate-400 dark:text-slate-500"
          role="img"
          aria-label={alt}
        >
          <ImageOff className="w-8 h-8 stroke-[1.5] mb-2 opacity-60" />
          <span className="text-[11px] font-medium text-center line-clamp-2 px-2">
            {alt}
          </span>
        </div>
      )}
    </div>
  );
};
