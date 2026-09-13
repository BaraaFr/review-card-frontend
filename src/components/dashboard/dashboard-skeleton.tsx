import {
    Skeleton,
  } from "@/components/ui/skeleton";
  
  export function DashboardSkeleton() {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({
            length: 4,
          }).map(
            (_, index) => (
              <Skeleton
                key={
                  index
                }
                className="h-44 rounded-2xl"
              />
            )
          )}
        </div>
  
        <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
          <Skeleton className="h-[420px] rounded-2xl" />
  
          <Skeleton className="h-[420px] rounded-2xl" />
        </div>
      </div>
    );
  }