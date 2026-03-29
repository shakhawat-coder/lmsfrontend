import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryCardSkeleton() {
  return (
    <div className="relative group bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse flex flex-col items-center text-center space-y-6">
      {/* Icon Circle */}
      <div className="relative">
        <Skeleton className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800" />
      </div>
      
      {/* Content */}
      <div className="space-y-4 w-full">
        <div className="space-y-2 flex flex-col items-center">
          <Skeleton className="h-6 w-32 rounded-lg" />
          <Skeleton className="h-4 w-48 rounded-md opacity-70" />
        </div>
        
        {/* Count Badge */}
        <div className="pt-2 flex justify-center">
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
      
      {/* Action Button */}
      <Skeleton className="h-10 w-full rounded-2xl mt-4" />
    </div>
  );
}
