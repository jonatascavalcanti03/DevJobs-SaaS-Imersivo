import { JobCardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050510] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-4 text-center">
          <div className="h-12 w-64 bg-white/5 rounded-xl mx-auto animate-pulse" />
          <div className="h-4 w-96 bg-white/5 rounded-xl mx-auto animate-pulse" />
        </div>
        <div className="h-16 w-full bg-white/5 rounded-2xl animate-pulse" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
