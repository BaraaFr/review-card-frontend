import {
    RefreshCw,
    TriangleAlert,
  } from "lucide-react";
  
  import {
    Button,
  } from "@/components/ui/button";
  
  export function AnalyticsErrorState({
    onRetry,
  }: {
    onRetry: () => void;
  }) {
    return (
      <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-dashed border-border">
        <div className="max-w-md px-6 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-500/10">
            <TriangleAlert className="size-6 text-red-500" />
          </div>
  
          <h3 className="mt-5 text-xl font-semibold">
            Unable to load analytics
          </h3>
  
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Something went wrong
            while retrieving your
            analytics data.
          </p>
  
          <Button
            variant="outline"
            className="mt-6"
            onClick={
              onRetry
            }
          >
            <RefreshCw className="size-4" />
  
            Try again
          </Button>
        </div>
      </div>
    );
  }