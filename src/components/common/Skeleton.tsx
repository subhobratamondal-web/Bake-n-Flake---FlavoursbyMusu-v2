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

export const GalleryItemSkeleton = () => {
  return (
    <div className="w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-white/5 border-4 border-white dark:border-white/10 relative animate-pulse">
      <div className="w-full h-full bg-gradient-to-tr from-slate-200 via-pink-100/40 to-slate-200 dark:from-slate-800 dark:via-pink-950/20 dark:to-slate-800" />
      <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col gap-2 bg-gradient-to-t from-black/60 to-transparent">
        <Skeleton variant="text" className="w-2/3 h-5 bg-white/30" />
        <div className="w-10 h-1 bg-pink-500 rounded-full" />
      </div>
    </div>
  );
};

export const VideoSkeleton = () => {
  return (
    <div className="w-full rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-4 md:p-6 flex flex-col gap-4 animate-pulse">
      <div className="w-full aspect-video rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="flex flex-col gap-2">
        <Skeleton variant="text" className="w-3/4 h-6 opacity-70" />
        <Skeleton variant="text" className="w-1/2 h-4 opacity-50" />
      </div>
    </div>
  );
};
