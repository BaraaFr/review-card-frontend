"use client";

import {
  useRef,
  useState,
} from "react";

import {
  useQuery,
} from "@tanstack/react-query";

import axios from "axios";

import {
  Loader2,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  api,
} from "@/lib/api";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  useActivatePaidSubscription,
  useStartTrial,
  useSubscriptionUsage,
} from "@/hooks/subscriptions/use-subscription";

import type {
  SubscriptionPlan,
} from "@/types/subscription";

import type {
  CardPaymentMethod,
} from "@/types/card";

type Props = {
  open:
    boolean;

  onOpenChange:
    (
      open:
        boolean
    ) => void;

  businessId:
    string;

  businessName?:
    string;
};

type Payment = {
  id:
    string;

  kind:
    string;

  receiptReference:
    string;

  amountCents:
    number;

  currency:
    string;

  paymentMethod:
    CardPaymentMethod;

  receivedAt:
    string;
};

type PaymentHistoryResponse = {
  data: {
    payments:
      Payment[];

    pagination: {
      page:
        number;

      limit:
        number;

      total:
        number;
    };
  };
};

function getErrorMessage(
  error:
    unknown
) {
  if (
    axios.isAxiosError<{
      message?:
        string;
    }>(
      error
    )
  ) {
    return (
      error.response
        ?.data
        ?.message ??
      "Connection interrupted. Check payment history, then retry using the same receipt."
    );
  }

  return "Unable to complete the request.";
}

export function ManageSubscriptionDialog(
  props:
    Props
) {
  return (
    <Dialog
      open={
        props.open
      }
      onOpenChange={
        props.onOpenChange
      }
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Manage subscription
          </DialogTitle>

          <DialogDescription>
            {props.businessName ??
              "Business"}
            : start the free
            trial or record a
            received subscription
            payment.
          </DialogDescription>
        </DialogHeader>

        {props.open && (
          <SubscriptionForm
            key={
              props.businessId
            }
            {...props}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function SubscriptionForm({
  businessId,
  onOpenChange,
}: Props) {
  const usage =
    useSubscriptionUsage(
      businessId
    );

  const startTrial =
    useStartTrial();

  const activatePaid =
    useActivatePaidSubscription();

  /*
   * Protect against an extremely
   * fast second submission before
   * React renders isPending.
   */
  const busy =
    useRef(false);

  const [
    selectedPlan,
    setSelectedPlan,
  ] =
    useState<
      SubscriptionPlan |
      undefined
    >();

  const plan =
    selectedPlan ??
    usage.data
      ?.subscription
      ?.plan ??
    "STARTER";

  const [
    months,
    setMonths,
  ] =
    useState("1");

  const [
    amount,
    setAmount,
  ] =
    useState("");

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<CardPaymentMethod>(
      "CASH"
    );

  const [
    receiptReference,
    setReceiptReference,
  ] =
    useState("");

  const [
    page,
    setPage,
  ] =
    useState(1);

  /*
   * Payment history contains both
   * card-sale and subscription
   * payments for this business.
   */
  const paymentHistory =
    useQuery({
      queryKey: [
        "payments",
        businessId,
        page,
      ],

      queryFn:
        async () => {
          const response =
            await api.get<PaymentHistoryResponse>(
              `/subscriptions/businesses/${businessId}/payments`,

              {
                params: {
                  page,
                  limit:
                    10,
                },
              }
            );

          return response
            .data
            .data;
        },
    });

  const pending =
    startTrial
      .isPending ||
    activatePaid
      .isPending;

  async function run(
    work:
      () =>
        Promise<unknown>,

    successMessage:
      string
  ) {
    if (
      busy.current
    ) {
      return;
    }

    busy.current =
      true;

    try {
      await work();

      toast.success(
        successMessage
      );

      onOpenChange(
        false
      );
    } catch (error) {
      toast.error(
        getErrorMessage(
          error
        )
      );
    } finally {
      busy.current =
        false;
    }
  }

  if (
    usage.isLoading
  ) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (
    usage.isError
  ) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-destructive">
          Unable to load
          subscription information.
        </p>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            usage.refetch()
          }
        >
          Retry
        </Button>
      </div>
    );
  }

  const subscription =
    usage.data
      ?.subscription;

  const trial =
    usage.data
      ?.trial;

  const normalizedReceipt =
    receiptReference
      .trim()
      .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Current subscription */}
      <section className="rounded-xl border bg-muted/20 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Current subscription
        </p>

        <div className="mt-2">
          {subscription ? (
            <>
              <p className="font-semibold">
                {
                  subscription.plan
                }
                {" · "}
                {
                  subscription.status
                }
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Expires:{" "}
                {subscription
                  .expiresAt
                  ? new Date(
                      subscription
                        .expiresAt
                    )
                      .toLocaleString()
                  : "No expiry"}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No subscription
            </p>
          )}
        </div>
      </section>

      {/* Trial */}
      <section className="space-y-3">
        <div>
          <h3 className="font-medium">
            30-day Starter trial
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            The trial can only be
            started after at least
            one physical card has
            been paid for and
            delivered.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={
            pending ||
            !trial
              ?.eligible
          }
          onClick={() =>
            void run(
              () =>
                startTrial
                  .mutateAsync(
                    businessId
                  ),

              "30-day free trial started"
            )
          }
        >
          {startTrial
            .isPending && (
            <Loader2 className="size-4 animate-spin" />
          )}

          {trial
            ?.eligible
            ? "Start 30-day trial"
            : "Trial already used"}
        </Button>

        {trial
          ?.startedAt && (
          <p className="text-xs text-muted-foreground">
            First trial started:{" "}
            {new Date(
              trial.startedAt
            )
              .toLocaleString()}
          </p>
        )}
      </section>

      {/* Paid subscription */}
      <form
        className="space-y-4 border-t pt-5"
        onSubmit={(
          event
        ) => {
          event.preventDefault();

          /*
           * Convert a USD string to
           * integer cents without
           * floating-point math.
           *
           * Examples:
           * 4.50 -> 450
           * 12   -> 1200
           */
          if (
            !/^\d+(\.\d{1,2})?$/.test(
              amount
            )
          ) {
            toast.error(
              "Enter a USD amount with at most two decimal places."
            );

            return;
          }

          const [
            dollars,
            cents =
              "",
          ] =
            amount.split(
              "."
            );

          const amountCents =
            Number(
              dollars
            ) *
              100 +
            Number(
              cents.padEnd(
                2,
                "0"
              )
            );

          if (
            !Number
              .isSafeInteger(
                amountCents
              ) ||
            amountCents <
              1 ||
            amountCents >
              100_000_000
          ) {
            toast.error(
              "Enter a valid payment amount."
            );

            return;
          }

          const parsedMonths =
            Number(
              months
            );

          if (
            !Number
              .isInteger(
                parsedMonths
              ) ||
            parsedMonths <
              1 ||
            parsedMonths >
              12
          ) {
            toast.error(
              "Choose a duration between 1 and 12 months."
            );

            return;
          }

          if (
            normalizedReceipt
              .length <
            3
          ) {
            toast.error(
              "Enter a valid receipt or transaction reference."
            );

            return;
          }

          void run(
            () =>
              activatePaid
                .mutateAsync({
                  businessId,

                  plan,

                  months:
                    parsedMonths,

                  amountCents,

                  paymentMethod,

                  receiptReference:
                    normalizedReceipt,
                }),

            subscription
              ? "Subscription payment recorded and renewal applied"
              : "Subscription payment recorded and access activated"
          );
        }}
      >
        <div>
          <h3 className="font-medium">
            Record a paid subscription
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Confirm that the
            payment was actually
            received before
            submitting. Existing
            valid trial or paid
            time is preserved.
          </p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="paid-plan"
          >
            Plan
          </Label>

          <select
            id="paid-plan"
            className="w-full rounded-md border bg-background p-2 text-sm"
            value={
              plan
            }
            disabled={
              pending
            }
            onChange={(
              event
            ) =>
              setSelectedPlan(
                event
                  .target
                  .value as SubscriptionPlan
              )
            }
          >
            <option value="STARTER">
              Starter
            </option>

            <option value="PRO">
              Pro
            </option>

            <option value="BUSINESS">
              Premium
            </option>
          </select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="paid-months"
          >
            Duration
          </Label>

          <Input
            id="paid-months"
            type="number"
            min="1"
            max="12"
            step="1"
            required
            value={
              months
            }
            disabled={
              pending
            }
            onChange={(
              event
            ) =>
              setMonths(
                event
                  .target
                  .value
              )
            }
          />

          <p className="text-xs text-muted-foreground">
            If there is still
            valid time remaining,
            these months are added
            after the existing
            expiry date.
          </p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="paid-amount"
          >
            Amount received
            (USD)
          </Label>

          <Input
            id="paid-amount"
            inputMode="decimal"
            required
            value={
              amount
            }
            disabled={
              pending
            }
            placeholder="4.50"
            onChange={(
              event
            ) =>
              setAmount(
                event
                  .target
                  .value
              )
            }
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="paid-method"
          >
            Payment method
          </Label>

          <select
            id="paid-method"
            className="w-full rounded-md border bg-background p-2 text-sm"
            value={
              paymentMethod
            }
            disabled={
              pending
            }
            onChange={(
              event
            ) =>
              setPaymentMethod(
                event
                  .target
                  .value as CardPaymentMethod
              )
            }
          >
            <option value="CASH">
              Cash
            </option>

            <option value="WHISH">
              Whish
            </option>

            <option value="OTHER">
              Other
            </option>
          </select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="paid-receipt"
          >
            Receipt / transaction
            reference
          </Label>

          <Input
            id="paid-receipt"
            minLength={
              3
            }
            maxLength={
              100
            }
            required
            value={
              receiptReference
            }
            disabled={
              pending
            }
            placeholder={
              paymentMethod ===
              "WHISH"
                ? "Whish transaction reference"
                : "Receipt number"
            }
            onChange={(
              event
            ) =>
              setReceiptReference(
                event
                  .target
                  .value
              )
            }
          />

          <p className="text-xs text-muted-foreground">
            This reference must
            be unique across all
            recorded payments.
          </p>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={
            pending ||
            !amount ||
            normalizedReceipt
              .length <
              3
          }
        >
          {activatePaid
            .isPending && (
            <Loader2 className="size-4 animate-spin" />
          )}

          Record payment and activate
        </Button>
      </form>

      {/* Payment history */}
      <section className="space-y-3 border-t pt-5">
        <div>
          <h3 className="font-medium">
            Payment history
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Immutable card and
            subscription payment
            records for this
            business.
          </p>
        </div>

        {paymentHistory
          .isLoading && (
          <p className="text-sm text-muted-foreground">
            Loading payments…
          </p>
        )}

        {paymentHistory
          .isError && (
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              paymentHistory
                .refetch()
            }
          >
            Retry payment history
          </Button>
        )}

        {paymentHistory
          .data
          ?.payments
          .length ===
          0 && (
          <p className="text-sm text-muted-foreground">
            No recorded payments.
          </p>
        )}

        {paymentHistory
          .data
          ?.payments
          .map(
            (
              payment
            ) => (
              <div
                key={
                  payment.id
                }
                className="rounded-lg border p-3 text-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {
                        payment
                          .receiptReference
                      }
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {
                        payment.kind
                      }
                      {" · "}
                      {
                        payment
                          .paymentMethod
                      }
                    </p>
                  </div>

                  <p className="font-medium">
                    {(
                      payment
                        .amountCents /
                      100
                    )
                      .toFixed(
                        2
                      )}{" "}
                    {
                      payment.currency
                    }
                  </p>
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(
                    payment
                      .receivedAt
                  )
                    .toLocaleString()}
                </p>
              </div>
            )
          )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={
              page ===
                1 ||
              paymentHistory
                .isFetching
            }
            onClick={() =>
              setPage(
                (
                  current
                ) =>
                  Math.max(
                    1,
                    current -
                      1
                  )
              )
            }
          >
            Previous
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={
              paymentHistory
                .isFetching ||
              !paymentHistory
                .data ||
              page *
                10 >=
                paymentHistory
                  .data
                  .pagination
                  .total
            }
            onClick={() =>
              setPage(
                (
                  current
                ) =>
                  current +
                  1
              )
            }
          >
            Next
          </Button>
        </div>
      </section>
    </div>
  );
}