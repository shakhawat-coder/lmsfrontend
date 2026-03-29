import { Skeleton } from "@/components/ui/skeleton";

export default function BookCardSkeleton() {
  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Skeleton className="h-full w-full" />
      </div>
      
      {/* Content Skeleton */}
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        
        <Skeleton className="h-10 w-full rounded-xl mt-4" />
      </div>
    </div>
  );
}
