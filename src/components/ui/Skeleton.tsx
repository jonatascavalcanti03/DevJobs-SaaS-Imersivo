"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-surface-hover border border-border/30",
        className
      )}
      {...props}
    />
  );
}

export function JobCardSkeleton() {
  return (
    <div className="glass-card p-6 border border-border/30 relative overflow-hidden group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      <div className="mt-6 flex items-center justify-between pt-6 border-t border-border/30">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}
