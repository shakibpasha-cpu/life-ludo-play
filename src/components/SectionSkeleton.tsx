import { Skeleton } from "@/components/ui/skeleton";

const SectionSkeleton = ({ tiles = 3 }: { tiles?: number }) => (
  <section className="py-20 md:py-28 px-4" role="status" aria-label="Loading section">
    <div className="max-w-6xl mx-auto space-y-6">
      <Skeleton className="h-8 w-52 mx-auto rounded-lg" />
      <Skeleton className="h-4 w-72 max-w-full mx-auto rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        {Array.from({ length: tiles }).map((_, i) => (
          <Skeleton key={i} className="w-full aspect-video rounded-2xl" />
        ))}
      </div>
    </div>
  </section>
);

export default SectionSkeleton;
