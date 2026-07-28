import React, { useState, useEffect, useRef } from 'react';
import { getOptimizedImageUrl } from '../utils/googleSheetsSync';
import { cn } from '../lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  quality?: number;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
  skeletonClassName?: string;
  rootMargin?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 600,
  quality = 80,
  fallbackSrc = 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
  className = '',
  containerClassName = '',
  skeletonClassName = '',
  rootMargin = '200px',
  style,
  ...props
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>(() => {
    if (!src) return fallbackSrc;
    return getOptimizedImageUrl(src, width, quality) || src || fallbackSrc;
  });
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.disconnect();
            }
          });
        },
        { rootMargin }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    } else {
      setIsInView(true);
    }
  }, [rootMargin]);

  useEffect(() => {
    if (isInView && src) {
      const optimized = getOptimizedImageUrl(src, width, quality) || src || fallbackSrc;
      setCurrentSrc(optimized);
      setHasError(false);
    } else if (!src) {
      setCurrentSrc(fallbackSrc);
    }
  }, [isInView, src, width, quality, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      if (currentSrc !== src && src) {
        setCurrentSrc(src);
      } else {
        setCurrentSrc(fallbackSrc);
      }
    } else {
      setCurrentSrc(fallbackSrc);
    }
  };

  const finalSrc = currentSrc || src || fallbackSrc;

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden w-full h-full", containerClassName)}>
      {/* Skeleton overlay while loading */}
      {!isLoaded && (
        <div 
          className={cn(
            "absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-slate-200 via-pink-100/50 to-slate-200 dark:from-slate-800 dark:via-pink-900/20 dark:to-slate-800",
            skeletonClassName
          )} 
        />
      )}

      {isInView && finalSrc ? (
        <img
          src={finalSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          referrerPolicy="no-referrer"
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          style={style}
          {...props}
        />
      ) : null}
    </div>
  );
};

export default OptimizedImage;
