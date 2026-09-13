import {
    Radio,
  } from "lucide-react";
  
  import type {
    CardAnalytics,
  } from "@/types/analytics";
  
  import {
    formatNumber,
  } from "@/lib/format";
  
  export function TopCards({
    cards,
  }: {
    cards: CardAnalytics[];
  }) {
    const topCards =
      cards.slice(0, 5);
  
    return (
      <div className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-sm">
        <div>
          <h3 className="font-semibold">
            Top review cards
          </h3>
  
          <p className="mt-1 text-xs text-muted-foreground">
            Best performing card
            placements
          </p>
        </div>
  
        {topCards.length ===
        0 ? (
          <div className="flex h-52 items-center justify-center text-center">
            <div>
              <Radio className="mx-auto size-7 text-muted-foreground/50" />
  
              <p className="mt-3 text-sm font-medium">
                No activity yet
              </p>
  
              <p className="mt-1 text-xs text-muted-foreground">
                Card performance
                will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-2">
            {topCards.map(
              (
                card,
                index
              ) => (
                <div
                  key={
                    card.id
                  }
                  className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-muted/60"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                    {index +
                      1}
                  </div>
  
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {card.label ??
                        "Review Card"}
                    </p>
  
                    <p className="truncate text-xs text-muted-foreground">
                      {card.store
                        ?.name ??
                        "No location"}
                    </p>
                  </div>
  
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {formatNumber(
                        card.total
                      )}
                    </p>
  
                    <p className="text-[11px] text-muted-foreground">
                      interactions
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  }