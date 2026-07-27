import { Skeleton } from "@/components/ui/skeleton";

const PageSkeleton = () => (
  <div className="min-h-[100svh] bg-background px-4 py-24" role="status" aria-label="Loading page">
    <div className="max-w-6xl mx-auto space-y-8">
      <Skeleton className="h-10 w-2/3 max-w-md rounded-lg" />
      <Skeleton className="h-4 w-1/2 max-w-sm rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  </div>
);

export default PageSkeleton;
