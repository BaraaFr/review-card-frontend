"use client";

import {
  BarChart3,
  MoreHorizontal,
  Pencil,
  QrCode,
  Radio,
} from "lucide-react";

import type {
  ReviewCard,
} from "@/types/card";

import {
  formatNumber,
} from "@/lib/format";

import {
  CardStatusBadge,
} from "./card-status";

import {
  Button,
} from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  card: ReviewCard;

  onDetails: () => void;

  onEdit: () => void;
};

export function ReviewCardItem({
  card,
  onDetails,
  onEdit,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/20 hover:shadow-lg">
      {/* Physical card preview */}
      <div className="p-4 pb-0">
        <div className="relative aspect-[1.586/1] overflow-hidden rounded-2xl bg-[#080a0d] p-5 text-white shadow-xl">
          <div className="absolute -right-12 -top-16 size-40 rounded-full bg-emerald-400/15 blur-3xl" />

          <div className="absolute -bottom-20 -left-12 size-40 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-tight">
                <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-400 text-black">
                  <Radio className="size-3.5" />
                </div>

                ValYou
              </div>

              <span className="font-mono text-[9px] text-zinc-500">
                {
                  card.code
                }
              </span>
            </div>

            <div className="text-center">
              <div className="text-lg tracking-[0.22em] text-amber-300">
                ★★★★★
              </div>

              <p className="mt-2 text-sm font-semibold">
                TAP TO REVIEW
              </p>

              <Radio className="mx-auto mt-2 size-7 text-emerald-300" />
            </div>

            <p className="text-center text-[9px] uppercase tracking-[0.2em] text-zinc-500">
              Hold your phone here
            </p>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate font-semibold">
                {card.label ??
                  "Review Card"}
              </h3>

              <CardStatusBadge
                status={
                  card.status
                }
              />
            </div>

            <p className="mt-1 truncate text-sm text-muted-foreground">
              {card.store
                ?.name ??
                "No location"}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                />
              }
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={
                    onDetails
                  }
                >
                  <QrCode className="size-4" />

                  QR & NFC
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={
                    onEdit
                  }
                >
                  <Pencil className="size-4" />

                  Rename
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="size-4" />

            Interactions
          </div>

          <span className="font-semibold">
            {formatNumber(
              card._count
                ?.interactions ??
                0
            )}
          </span>
        </div>
      </div>
    </div>
  );
}