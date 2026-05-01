import Skeleton from "@/components/ui/Skeleton";

export default function VagasLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Bar Skeleton */}
      <div className="max-w-2xl mx-auto">
        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      </div>

      {/* Grid Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 space-y-4 border border-border/50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="w-6 h-6 rounded-lg" />
            </div>
            <Skeleton className="h-6 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border/30">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
