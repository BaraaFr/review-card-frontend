import Link from "next/link";

import {
  BarChart3,
  Check,
  LockKeyhole,
  Radio,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import {
  buttonVariants,
} from "@/components/ui/button";

type Props = {
  reason?:
    | "EXPIRED"
    | "CANCELED"
    | "PAST_DUE"
    | "NO_SUBSCRIPTION";
};

export function AnalyticsLockedState({
  reason = "EXPIRED",
}: Props) {
  const title =
    reason === "PAST_DUE"
      ? "Your analytics are temporarily locked"
      : reason ===
          "CANCELED"
        ? "Your analytics are locked"
        : "Your analytics subscription has expired";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-6 shadow-sm md:p-10">
      {/* Background */}
      <div className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-emerald-500/[0.07] blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-32 left-1/4 size-72 rounded-full bg-violet-500/[0.05] blur-[110px]" />

      <div className="relative grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
        {/* Copy */}
        <div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10">
            <LockKeyhole className="size-5 text-amber-600 dark:text-amber-400" />
          </div>

          <p className="mt-7 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Subscription required
          </p>

          <h2 className="mt-2 max-w-xl text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
            {title}
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Your physical review
            cards are still active
            and customer activity
            continues to be
            recorded. Renew your
            subscription to unlock
            your analytics and the
            activity collected while
            access was unavailable.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <LockedFeature>
              Interaction analytics
            </LockedFeature>

            <LockedFeature>
              NFC & QR performance
            </LockedFeature>

            <LockedFeature>
              Card performance
            </LockedFeature>

            <LockedFeature>
              Location analytics
            </LockedFeature>

            <LockedFeature>
              Review insights
            </LockedFeature>

            <LockedFeature>
              Customer insights
            </LockedFeature>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/subscription"
              className={buttonVariants({
                className:
                  "h-11 px-5",
              })}
            >
              <Sparkles
                data-icon="inline-start"
                className="size-4"
              />

              Renew subscription
            </Link>
          </div>
        </div>

        {/* Locked Preview */}
        <div className="relative">
          <div className="rounded-3xl border border-border/70 bg-background/70 p-5 shadow-xl backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">
                  Performance
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Customer activity
                </p>
              </div>

              <LockKeyhole className="size-4 text-muted-foreground" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <FakeMetric
                icon={
                  BarChart3
                }
                label="Interactions"
              />

              <FakeMetric
                icon={
                  Users
                }
                label="Visitors"
              />

              <FakeMetric
                icon={
                  Radio
                }
                label="NFC taps"
              />

              <FakeMetric
                icon={
                  Star
                }
                label="Reviews"
              />
            </div>

            <div className="relative mt-4 h-40 overflow-hidden rounded-2xl border border-border/60 bg-muted/30">
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[5px]">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-background shadow-lg">
                  <LockKeyhole className="size-5 text-muted-foreground" />
                </div>
              </div>

              <svg
                viewBox="0 0 500 160"
                className="h-full w-full opacity-25"
                aria-hidden
              >
                <path
                  d="M0 125 C60 95, 90 130, 145 80 C190 35, 240 115, 295 65 C355 15, 405 90, 500 30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LockedFeature({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500/10">
        <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
      </div>

      {children}
    </div>
  );
}

function FakeMetric({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;

  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4">
      <Icon className="size-4 text-muted-foreground" />

      <div className="mt-6 flex gap-1">
        <div className="h-5 w-4 rounded bg-muted-foreground/20" />
        <div className="h-5 w-4 rounded bg-muted-foreground/20" />
        <div className="h-5 w-4 rounded bg-muted-foreground/20" />
      </div>

      <p className="mt-2 text-[11px] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}