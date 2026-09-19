"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  format,
  parseISO,
} from "date-fns";

import {
  AlertTriangle,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  CreditCard,
  Mail,
  Phone,
  UserRoundCheck,
} from "lucide-react";

import type {
  AdminSubscriptionRecord,
} from "@/types/admin-subscription";

import {
  RenewalFollowUpDialog,
} from "./renewal-follow-up-dialog";

import {
  Button,
  buttonVariants,
} from "@/components/ui/button";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

type Props = {
  records:
    AdminSubscriptionRecord[];

  onManage:
    (
      record:
        AdminSubscriptionRecord
    ) => void;
};

type WindowFilter =
  | "7"
  | "14"
  | "30"
  | "OVERDUE"
  | "CALLBACKS";

type ContactFilter =
  | ""
  | "NOT_CONTACTED"
  | "CONTACTED"
  | "INTERESTED"
  | "DECLINED";

type PaymentFilter =
  | ""
  | "TRIAL"
  | "RECORDED_PAYMENT"
  | "NO_RECORDED_PAYMENT";

const DAY_MS =
  24 * 60 * 60 * 1000;

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function effectiveStatus(
  record:
    AdminSubscriptionRecord
) {
  const subscription =
    record.subscription;

  if (!subscription) {
    return "NO_SUBSCRIPTION";
  }

  if (
    subscription.expiresAt &&
    (
      subscription.status ===
        "ACTIVE" ||
      subscription.status ===
        "TRIAL"
    ) &&
    new Date(
      subscription.expiresAt
    ).getTime() <
      Date.now()
  ) {
    return "EXPIRED";
  }

  return subscription.status;
}

function isOverdue(
  record:
    AdminSubscriptionRecord,

  now:
    number
) {
  const subscription =
    record.subscription;

  if (
    !subscription?.expiresAt
  ) {
    return false;
  }

  const status =
    effectiveStatus(
      record
    );

  return (
    status ===
      "PAST_DUE" ||
    status ===
      "EXPIRED" ||
    (
      new Date(
        subscription.expiresAt
      ).getTime() <
      now
    )
  );
}

function isCallbackDue(
  record:
    AdminSubscriptionRecord,

  now:
    number
) {
  const followUp =
    record.renewalFollowUp;

  if (
    !followUp?.nextFollowUpAt ||
    followUp.status ===
      "DECLINED"
  ) {
    return false;
  }

  return (
    new Date(
      followUp.nextFollowUpAt
    ).getTime() <=
    now
  );
}

function expiryLabel(
  record:
    AdminSubscriptionRecord,

  now:
    number
) {
  const expiry =
    record.subscription
      ?.expiresAt;

  if (!expiry) {
    return "No expiration";
  }

  const remaining =
    new Date(
      expiry
    ).getTime() -
    now;

  if (
    remaining <=
    0
  ) {
    const elapsedDays =
      Math.floor(
        Math.abs(
          remaining
        ) /
          DAY_MS
      );

    return elapsedDays ===
      0
      ? "Expired today"
      : `Expired ${elapsedDays}d ago`;
  }

  if (
    remaining <
    DAY_MS
  ) {
    return "Expires within 24h";
  }

  return `Expires in ${Math.ceil(
    remaining /
      DAY_MS
  )}d`;
}

function followUpLabel(
  record:
    AdminSubscriptionRecord
) {
  switch (
    record.renewalFollowUp
      ?.status
  ) {
    case "CONTACTED":
      return "Contacted";

    case "INTERESTED":
      return "Interested";

    case "DECLINED":
      return "Declined";

    default:
      return "Not contacted";
  }
}

/*
 * =========================================================
 * RENEWAL DESK
 * =========================================================
 */

export function RenewalDesk({
  records,
  onManage,
}: Props) {
  const [
    windowFilter,
    setWindowFilter,
  ] =
    useState<WindowFilter>(
      "30"
    );

  const [
    contactFilter,
    setContactFilter,
  ] =
    useState<ContactFilter>(
      ""
    );

  const [
    paymentFilter,
    setPaymentFilter,
  ] =
    useState<PaymentFilter>(
      ""
    );

  const [
    selected,
    setSelected,
  ] =
    useState<
      AdminSubscriptionRecord |
      null
    >(
      null
    );

  /*
   * Allow the dashboard's Expiring soon
   * link to open this page prefiltered.
   */

  useEffect(() => {
    const requested =
      new URLSearchParams(
        window.location.search
      ).get(
        "renewals"
      );

    if (
      requested ===
      "7" ||
      requested ===
      "14" ||
      requested ===
      "30" ||
      requested ===
      "OVERDUE" ||
      requested ===
      "CALLBACKS"
    ) {
      setWindowFilter(
        requested
      );
    }
  }, []);

  const now =
    Date.now();

  /*
   * One business can have many
   * subscription records historically.
   *
   * The existing API returns only
   * the current subscription.
   */

  const candidates =
    useMemo(
      () =>
        records.filter(
          (record) => {
            const subscription =
              record.subscription;

            if (
              !subscription?.expiresAt
            ) {
              return false;
            }

            if (
              effectiveStatus(
                record
              ) ===
              "CANCELED"
            ) {
              return false;
            }

            return true;
          }
        ),

      [records]
    );

  const stats =
    useMemo(
      () => {
        const future =
          candidates.filter(
            (record) => {
              const expiry =
                new Date(
                  record.subscription!
                    .expiresAt!
                ).getTime();

              return (
                expiry >=
                now &&
                !isOverdue(
                  record,
                  now
                )
              );
            }
          );

        const dueWithin = (
          days:
            number
        ) =>
          future.filter(
            (record) =>
              new Date(
                record.subscription!
                  .expiresAt!
              ).getTime() <=
              now +
                days *
                  DAY_MS
          ).length;

        return {
          seven:
            dueWithin(
              7
            ),

          thirty:
            dueWithin(
              30
            ),

          overdue:
            candidates.filter(
              (record) =>
                isOverdue(
                  record,
                  now
                )
            ).length,

          callbacks:
            candidates.filter(
              (record) =>
                isCallbackDue(
                  record,
                  now
                )
            ).length,
        };
      },

      [candidates, now]
    );

  const visible =
    useMemo(
      () => {
        return candidates
          .filter(
            (record) => {
              const subscription =
                record.subscription!;

              const expiry =
                new Date(
                  subscription.expiresAt!
                ).getTime();

              const overdue =
                isOverdue(
                  record,
                  now
                );

              if (
                windowFilter ===
                "OVERDUE"
              ) {
                if (
                  !overdue
                ) {
                  return false;
                }
              } else if (
                windowFilter ===
                "CALLBACKS"
              ) {
                if (
                  !isCallbackDue(
                    record,
                    now
                  )
                ) {
                  return false;
                }
              } else {
                const days =
                  Number(
                    windowFilter
                  );

                /*
                 * Include both:
                 * - Upcoming expirations
                 * - Already overdue
                 *
                 * That way a missed renewal
                 * does not disappear from
                 * the default desk.
                 */

                if (
                  !overdue &&
                  (
                    expiry <
                      now ||
                    expiry >
                      now +
                        days *
                          DAY_MS
                  )
                ) {
                  return false;
                }
              }

              const savedStatus =
                record.renewalFollowUp
                  ?.status;

              if (
                contactFilter ===
                  "NOT_CONTACTED" &&
                savedStatus
              ) {
                return false;
              }

              if (
                contactFilter &&
                contactFilter !==
                  "NOT_CONTACTED" &&
                savedStatus !==
                  contactFilter
              ) {
                return false;
              }

              if (
                paymentFilter ===
                  "TRIAL" &&
                subscription.status !==
                  "TRIAL"
              ) {
                return false;
              }

              if (
                paymentFilter ===
                  "RECORDED_PAYMENT" &&
                !record.hasRecordedSubscriptionPayment
              ) {
                return false;
              }

              if (
                paymentFilter ===
                  "NO_RECORDED_PAYMENT" &&
                record.hasRecordedSubscriptionPayment
              ) {
                return false;
              }

              return true;
            }
          )

          /*
           * Follow-ups due first,
           * then overdue subscriptions,
           * then nearest expiration.
           */

          .sort(
            (
              first,
              second
            ) => {
              const firstCallback =
                isCallbackDue(
                  first,
                  now
                )
                  ? 0
                  : 1;

              const secondCallback =
                isCallbackDue(
                  second,
                  now
                )
                  ? 0
                  : 1;

              if (
                firstCallback !==
                secondCallback
              ) {
                return (
                  firstCallback -
                  secondCallback
                );
              }

              const firstOverdue =
                isOverdue(
                  first,
                  now
                )
                  ? 0
                  : 1;

              const secondOverdue =
                isOverdue(
                  second,
                  now
                )
                  ? 0
                  : 1;

              if (
                firstOverdue !==
                secondOverdue
              ) {
                return (
                  firstOverdue -
                  secondOverdue
                );
              }

              return (
                new Date(
                  first.subscription!
                    .expiresAt!
                ).getTime() -
                new Date(
                  second.subscription!
                    .expiresAt!
                ).getTime()
              );
            }
          );
      },

      [
        candidates,
        now,
        windowFilter,
        contactFilter,
        paymentFilter,
      ]
    );

  return (
    <>
      <section className="min-w-0 overflow-hidden rounded-2xl border border-emerald-500/20 bg-card shadow-sm">

        {/* Header */}

        <div className="border-b border-border/60 bg-emerald-500/[0.04] p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Revenue operations
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                Renewal Desk
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Know who to contact, track renewal
                conversations, and record payments
                before customers lose access.
              </p>
            </div>

            <div className="w-fit rounded-full border border-emerald-500/20 bg-background px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              {visible.length}{" "}

              {visible.length ===
              1
                ? "business"
                : "businesses"}
            </div>
          </div>

          {/* Quick overview */}

          <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <QuickStat
              label="Next 7 days"
              value={
                stats.seven
              }
              icon={
                Clock3
              }
              active={
                windowFilter ===
                "7"
              }
              onClick={() =>
                setWindowFilter(
                  "7"
                )
              }
            />

            <QuickStat
              label="Next 30 days"
              value={
                stats.thirty
              }
              icon={
                CalendarClock
              }
              active={
                windowFilter ===
                "30"
              }
              onClick={() =>
                setWindowFilter(
                  "30"
                )
              }
            />

            <QuickStat
              label="Overdue"
              value={
                stats.overdue
              }
              icon={
                AlertTriangle
              }
              active={
                windowFilter ===
                "OVERDUE"
              }
              onClick={() =>
                setWindowFilter(
                  "OVERDUE"
                )
              }
            />

            <QuickStat
              label="Follow-ups due"
              value={
                stats.callbacks
              }
              icon={
                UserRoundCheck
              }
              active={
                windowFilter ===
                "CALLBACKS"
              }
              onClick={() =>
                setWindowFilter(
                  "CALLBACKS"
                )
              }
            />
          </div>
        </div>

        {/* Filters */}

        <div className="grid min-w-0 grid-cols-1 gap-3 border-b border-border/60 bg-muted/20 p-4 sm:grid-cols-3 sm:p-5">

          <NativeSelect
            value={
              windowFilter
            }
            onChange={(event) =>
              setWindowFilter(
                event.target.value as
                  WindowFilter
              )
            }
          >
            <NativeSelectOption value="7">
              Next 7 days + overdue
            </NativeSelectOption>

            <NativeSelectOption value="14">
              Next 14 days + overdue
            </NativeSelectOption>

            <NativeSelectOption value="30">
              Next 30 days + overdue
            </NativeSelectOption>

            <NativeSelectOption value="OVERDUE">
              Overdue only
            </NativeSelectOption>

            <NativeSelectOption value="CALLBACKS">
              Follow-ups due
            </NativeSelectOption>
          </NativeSelect>

          <NativeSelect
            value={
              contactFilter
            }
            onChange={(event) =>
              setContactFilter(
                event.target.value as
                  ContactFilter
              )
            }
          >
            <NativeSelectOption value="">
              All contact statuses
            </NativeSelectOption>

            <NativeSelectOption value="NOT_CONTACTED">
              Not contacted
            </NativeSelectOption>

            <NativeSelectOption value="CONTACTED">
              Contacted
            </NativeSelectOption>

            <NativeSelectOption value="INTERESTED">
              Interested
            </NativeSelectOption>

            <NativeSelectOption value="DECLINED">
              Declined
            </NativeSelectOption>
          </NativeSelect>

          <NativeSelect
            value={
              paymentFilter
            }
            onChange={(event) =>
              setPaymentFilter(
                event.target.value as
                  PaymentFilter
              )
            }
          >
            <NativeSelectOption value="">
              All payment histories
            </NativeSelectOption>

            <NativeSelectOption value="TRIAL">
              Current trials
            </NativeSelectOption>

            <NativeSelectOption value="RECORDED_PAYMENT">
              Subscription payment recorded
            </NativeSelectOption>

            <NativeSelectOption value="NO_RECORDED_PAYMENT">
              No recorded subscription payment
            </NativeSelectOption>
          </NativeSelect>

        </div>

        {/* Records */}

        <div className="p-3 sm:p-5">
          {visible.length ===
          0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center text-center">
              <CheckCircle2 className="size-9 text-emerald-600" />

              <h3 className="mt-3 font-semibold">
                No matching renewals
              </h3>

              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                There are no businesses matching
                the selected renewal filters.
              </p>
            </div>
          ) : (
            <div className="grid min-w-0 gap-3 xl:grid-cols-2">

              {visible.map(
                (record) => (
                  <RenewalCard
                    key={
                      record.business.id
                    }
                    record={
                      record
                    }
                    now={
                      now
                    }
                    onFollowUp={() =>
                      setSelected(
                        record
                      )
                    }
                    onManage={() =>
                      onManage(
                        record
                      )
                    }
                  />
                )
              )}

            </div>
          )}
        </div>
      </section>

      <RenewalFollowUpDialog
        record={
          selected
        }
        onOpenChange={(open) => {
          if (!open) {
            setSelected(
              null
            );
          }
        }}
      />
    </>
  );
}

/*
 * =========================================================
 * QUICK STAT
 * =========================================================
 */

function QuickStat({
  label,
  value,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;

  value: number;

  icon:
    React.ElementType;

  active:
    boolean;

  onClick:
    () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      aria-pressed={
        active
      }
      className={`min-w-0 rounded-xl border p-4 text-left transition ${
        active
          ? "border-emerald-500/50 bg-emerald-500/[0.08]"
          : "border-border/70 bg-background hover:border-emerald-500/30"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <Icon className="size-4 text-emerald-600 dark:text-emerald-400" />

        <span className="text-2xl font-semibold tracking-tight">
          {value}
        </span>
      </div>

      <p className="mt-3 text-xs font-medium sm:text-sm">
        {label}
      </p>
    </button>
  );
}

/*
 * =========================================================
 * RENEWAL CARD
 * =========================================================
 */

function RenewalCard({
  record,
  now,
  onFollowUp,
  onManage,
}: {
  record:
    AdminSubscriptionRecord;

  now:
    number;

  onFollowUp:
    () => void;

  onManage:
    () => void;
}) {
  const subscription =
    record.subscription!;

  const overdue =
    isOverdue(
      record,
      now
    );

  const callbackDue =
    isCallbackDue(
      record,
      now
    );

  const followUp =
    record.renewalFollowUp;

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border/70 bg-background">

      {/* Heading */}

      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 p-4">

        <div className="min-w-0">
          <h3
            className="truncate text-base font-semibold"
            title={
              record.business.name
            }
          >
            {record.business.name}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {record.customer.name}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {subscription.plan}

            {" · "}

            {subscription.status}
          </p>
        </div>

        <div
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            overdue
              ? "bg-destructive/10 text-destructive"
              : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
          }`}
        >
          {expiryLabel(
            record,
            now
          )}
        </div>
      </div>

      {/* Content */}

      <div className="flex-1 space-y-4 p-4">

        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">

          <div>
            <p className="text-xs text-muted-foreground">
              Expiration
            </p>

            <p className="mt-1 text-sm font-medium">
              {format(
                parseISO(
                  subscription.expiresAt!
                ),

                "MMM d, yyyy"
              )}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Follow-up
            </p>

            <p className="mt-1 text-sm font-medium">
              {followUpLabel(
                record
              )}
            </p>
          </div>

        </div>

        {callbackDue && (
          <div className="rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-400">
            Follow-up is due
          </div>
        )}

        {followUp?.nextFollowUpAt && (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarClock className="size-3.5" />

            Next contact:{" "}

            {format(
              parseISO(
                followUp.nextFollowUpAt
              ),

              "MMM d, yyyy"
            )}
          </p>
        )}

        {followUp?.note && (
          <div className="rounded-lg bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">
              Last note
            </p>

            <p className="mt-1 line-clamp-2 whitespace-pre-wrap text-sm">
              {followUp.note}
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`mailto:${record.customer.email}`}
            className={buttonVariants({
              variant:
                "outline",

              size:
                "sm",
            })}
          >
            <Mail className="size-4" />

            Email
          </a>

          {record.customer.phoneNumber && (
            <a
              href={`tel:${record.customer.phoneNumber}`}
              className={buttonVariants({
                variant:
                  "outline",

                size:
                  "sm",
              })}
            >
              <Phone className="size-4" />

              Call
            </a>
          )}

          <Link
            href={`/admin/customers/${record.customer.id}`}
            className={buttonVariants({
              variant:
                "ghost",

              size:
                "sm",
            })}
          >
            Customer

            <ArrowUpRight className="size-4" />
          </Link>
        </div>

      </div>

      {/* Footer */}

      <div className="grid grid-cols-1 gap-2 border-t border-border/60 bg-muted/20 p-3 sm:grid-cols-2">

        <Button
          type="button"
          variant="outline"
          className="h-10"
          onClick={
            onFollowUp
          }
        >
          <UserRoundCheck className="size-4" />

          {followUp
            ? "Update follow-up"
            : "Log follow-up"}
        </Button>

        <Button
          type="button"
          className="h-10"
          onClick={
            onManage
          }
        >
          <CreditCard className="size-4" />

          Record payment
        </Button>

      </div>
    </article>
  );
}