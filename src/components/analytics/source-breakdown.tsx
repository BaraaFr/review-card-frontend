import {
  CircleHelp,
  QrCode,
  Radio,
} from "lucide-react";

import {
  formatNumber,
} from "@/lib/format";

type Props = {
  nfc: number;
  qr: number;
  unknown?: number;
};

export function SourceBreakdown({
  nfc,
  qr,
  unknown = 0,
}: Props) {
  const total =
    nfc +
    qr +
    unknown;

  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-sm">
      <div>
        <h3 className="font-semibold">
          Interaction source
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          How customers interact
          with your review cards.
        </p>
      </div>

      <div className="mt-8 space-y-7">
        <SourceRow
          icon={Radio}
          label="NFC taps"
          value={nfc}
          percentage={
            percentage(
              nfc,
              total
            )
          }
        />

        <SourceRow
          icon={QrCode}
          label="QR scans"
          value={qr}
          percentage={
            percentage(
              qr,
              total
            )
          }
        />

        {unknown > 0 && (
          <SourceRow
            icon={CircleHelp}
            label="Other"
            value={unknown}
            percentage={
              percentage(
                unknown,
                total
              )
            }
          />
        )}
      </div>
    </div>
  );
}

function percentage(
  value: number,
  total: number
) {
  if (total === 0) {
    return 0;
  }

  return Math.round(
    (value / total) *
      100
  );
}

function SourceRow({
  icon: Icon,
  label,
  value,
  percentage,
}: {
  icon: React.ElementType;

  label: string;

  value: number;

  percentage: number;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-muted">
          <Icon className="size-4 text-emerald-600 dark:text-emerald-400" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">
              {label}
            </span>

            <span className="text-sm font-semibold">
              {formatNumber(
                value
              )}
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width:
                  `${percentage}%`,
              }}
            />
          </div>
        </div>

        <span className="w-10 text-right text-xs text-muted-foreground">
          {percentage}%
        </span>
      </div>
    </div>
  );
}