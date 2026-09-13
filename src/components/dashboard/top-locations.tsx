import {
    MapPin,
  } from "lucide-react";
  
  import type {
    StoreAnalytics,
  } from "@/types/analytics";
  
  import {
    formatNumber,
  } from "@/lib/format";
  
  export function TopLocations({
    stores,
  }: {
    stores: StoreAnalytics[];
  }) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-sm">
        <div>
          <h3 className="font-semibold">
            Top locations
          </h3>
  
          <p className="mt-1 text-xs text-muted-foreground">
            Engagement across your
            branches
          </p>
        </div>
  
        {stores.length ===
        0 ? (
          <div className="flex h-48 items-center justify-center text-center">
            <div>
              <MapPin className="mx-auto size-7 text-muted-foreground/50" />
  
              <p className="mt-3 text-sm font-medium">
                No location data yet
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-2">
            {stores
              .slice(
                0,
                5
              )
              .map(
                (
                  store
                ) => (
                  <div
                    key={
                      store.id
                    }
                    className="flex items-center gap-3 rounded-xl p-3 hover:bg-muted/60"
                  >
                    <div className="flex size-9 items-center justify-center rounded-xl bg-muted">
                      <MapPin className="size-4 text-emerald-500 dark:text-emerald-400" />
                    </div>
  
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {
                          store.name
                        }
                      </p>
  
                      <p className="truncate text-xs text-muted-foreground">
                        {store.address ??
                          store.business
                            .name}
                      </p>
                    </div>
  
                    <span className="text-sm font-semibold">
                      {formatNumber(
                        store.total
                      )}
                    </span>
                  </div>
                )
              )}
          </div>
        )}
      </div>
    );
  }