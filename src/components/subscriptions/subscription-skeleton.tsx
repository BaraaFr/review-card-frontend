import {
    Skeleton,
  } from "@/components/ui/skeleton";
  
  export function SubscriptionSkeleton() {
    return (
      <div className="space-y-6">
        <Skeleton className="h-72 rounded-3xl" />
  
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-44 rounded-2xl" />
  
          <Skeleton className="h-44 rounded-2xl" />
        </div>
  
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({
            length: 3,
          }).map(
            (_, index) => (
              <Skeleton
                key={
                  index
                }
                className="h-[430px] rounded-2xl"
              />
            )
          )}
        </div>
      </div>
    );
  }