import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton = ({ className, variant = 'rectangular' }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-slate-200/50 dark:bg-white/5",
        variant === 'circular' ? "rounded-full" : variant === 'text' ? "h-4 rounded" : "rounded-2xl",
        className
      )}
    />
  );
};

export const ProductSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <Skeleton className="aspect-square w-full rounded-[2.5rem]" />
      <div className="flex flex-col items-center gap-2 px-2">
        <Skeleton variant="text" className="w-3/4 h-6" />
        <Skeleton variant="text" className="w-1/2 h-4 opacity-50" />
      </div>
    </div>
  );
};
