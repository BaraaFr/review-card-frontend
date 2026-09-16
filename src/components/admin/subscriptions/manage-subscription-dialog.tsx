// "use client";

// import { useEffect } from "react";

// import { useForm } from "react-hook-form";

// import { zodResolver } from "@hookform/resolvers/zod";

// import { CalendarDays, Crown, Loader2, RefreshCw } from "lucide-react";

// import { addMonths, addYears, format } from "date-fns";

// import { toast } from "sonner";

// import type { Subscription } from "@/types/subscription";

// import {
//   manageSubscriptionSchema,
//   type ManageSubscriptionFormValues,
// } from "@/lib/validations/manage-subscription";

// import {
//   useActivatePaidSubscription,
//   useCreateSubscription,
//   useStartTrial,
//   useUpdateSubscription,
// } from "@/hooks/subscriptions/use-subscription";

// import { getApiErrorMessage } from "@/lib/api-error";

// import { Button } from "@/components/ui/button";

// import { Input } from "@/components/ui/input";

// import { Label } from "@/components/ui/label";

// import {
//   NativeSelect,
//   NativeSelectOption,
// } from "@/components/ui/native-select";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// type Props = {
//   businessId: string;

//   businessName: string;

//   subscription: Subscription | null;

//   open: boolean;

//   onOpenChange: (open: boolean) => void;
// };

// export function ManageSubscriptionDialog({
//   businessId,
//   businessName,
//   subscription,
//   open,
//   onOpenChange,
// }: Props) {
//   const create = useCreateSubscription();

//   const update = useUpdateSubscription();

//   const { register, handleSubmit, reset, setValue, watch } =
//     useForm<ManageSubscriptionFormValues>({
//       resolver: zodResolver(manageSubscriptionSchema),
//     });

//   const status = watch("status");

//   const expiresAt = watch("expiresAt");

//   useEffect(() => {
//     if (!open) {
//       return;
//     }

//     reset({
//       plan: subscription?.plan ?? "STARTER",

//       status: subscription?.status ?? "ACTIVE",

//       startsAt: subscription?.startsAt
//         ? format(new Date(subscription.startsAt), "yyyy-MM-dd")
//         : format(new Date(), "yyyy-MM-dd"),

//       expiresAt: subscription?.expiresAt
//         ? format(new Date(subscription.expiresAt), "yyyy-MM-dd")
//         : "",
//     });
//   }, [open, subscription, reset]);

//   const getRenewalBase = () => {
//     if (!expiresAt) {
//       return new Date();
//     }

//     const expiry = new Date(`${expiresAt}T12:00:00`);

//     return expiry > new Date() ? expiry : new Date();
//   };

//   const setOneMonth = () => {
//     setValue("status", "ACTIVE");

//     setValue("expiresAt", format(addMonths(getRenewalBase(), 1), "yyyy-MM-dd"));
//   };

//   const setOneYear = () => {
//     setValue("status", "ACTIVE");
//     setValue("expiresAt", format(addYears(getRenewalBase(), 1), "yyyy-MM-dd"));
//   };
//   const startTrial = useStartTrial();

//   const activatePaid = useActivatePaidSubscription();

//   const activate = () => {
//     setValue("status", "ACTIVE");

//     setValue("startsAt", format(new Date(), "yyyy-MM-dd"));
//   };

//   const submit = async (values: ManageSubscriptionFormValues) => {
//     const payload = {
//       plan: values.plan,

//       status: values.status,

//       startsAt: new Date(`${values.startsAt}T00:00:00`).toISOString(),

//       expiresAt: values.expiresAt
//         ? new Date(`${values.expiresAt}T23:59:59`).toISOString()
//         : null,
//     };

//     try {
//       if (subscription) {
//         await update.mutateAsync({
//           subscriptionId: subscription.id,

//           businessId,

//           payload,
//         });

//         toast.success("Subscription updated");
//       } else {
//         await create.mutateAsync({
//           businessId,

//           payload,
//         });

//         toast.success("Subscription activated");
//       }

//       onOpenChange(false);
//     } catch (error) {
//       toast.error(getApiErrorMessage(error, "Unable to update subscription"));
//     }
//   };

//   const pending = create.isPending || update.isPending;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-xl">
//         <DialogHeader>
//           <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-emerald-500/10">
//             <Crown className="size-5 text-emerald-600 dark:text-emerald-400" />
//           </div>

//           <DialogTitle>Manage subscription</DialogTitle>

//           <DialogDescription>
//             Manage the plan and subscription status for {businessName}.
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit(submit)} className="space-y-6">
//           {/* Current */}
//           <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
//             <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
//               Current subscription
//             </p>

//             <div className="mt-2">
//               {subscription ? (
//                 <div className="flex items-center gap-2">
//                   <span className="font-semibold">{subscription.plan}</span>

//                   <span className="text-sm text-muted-foreground">/</span>

//                   <span className="text-sm">{subscription.status}</span>
//                 </div>
//               ) : (
//                 <span className="text-sm text-amber-600 dark:text-amber-400">
//                   No subscription
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Quick actions */}
//           <div>
//             <Label>Quick actions</Label>

//             <div className="mt-2 flex flex-wrap gap-2">
//               <Button
//                 type="button"
//                 disabled={activatePaid.isPending}
//                 onClick={async () => {
//                   try {
//                     await activatePaid.mutateAsync({
//                       businessId,

//                       plan,

//                       months: 1,
//                     });

//                     toast.success("Subscription activated for one month");

//                     onOpenChange(false);
//                   } catch (error) {
//                     console.error(error);

//                     toast.error("Unable to activate subscription");
//                   }
//                 }}
//               >
//                 {activatePaid.isPending && (
//                   <Loader2 className="size-4 animate-spin" />
//                 )}
//                 Activate / renew 1 month
//               </Button>
//               <Button
//                 type="button"
//                 variant="outline"
//                 disabled={!trial.eligible || startTrial.isPending}
//                 onClick={async () => {
//                   try {
//                     await startTrial.mutateAsync(businessId);

//                     toast.success("30-day free trial started");

//                     onOpenChange(false);
//                   } catch (error) {
//                     console.error(error);

//                     toast.error("Unable to start trial");
//                   }
//                 }}
//               >
//                 {startTrial.isPending && (
//                   <Loader2 className="size-4 animate-spin" />
//                 )}
//                 Start 30-day trial
//               </Button>

//               {!trial.eligible && (
//                 <p className="text-xs text-muted-foreground">
//                   This business has already used its free trial.
//                 </p>
//               )}

//               <Button
//                 type="button"
//                 size="sm"
//                 variant="outline"
//                 onClick={setOneYear}
//               >
//                 <RefreshCw className="size-3.5" />
//                 +1 year
//               </Button>
//             </div>
//           </div>

//           {/* Plan + status */}
//           <div className="grid gap-4 sm:grid-cols-2">
//             <div className="space-y-2">
//               <Label>Plan</Label>

//               <NativeSelect {...register("plan")}>
//                 <NativeSelectOption value="STARTER">Starter</NativeSelectOption>

//                 <NativeSelectOption value="PRO">Pro</NativeSelectOption>

//                 <NativeSelectOption value="BUSINESS">
//                   Business
//                 </NativeSelectOption>
//               </NativeSelect>
//             </div>

//             <div className="space-y-2">
//               <Label>Status</Label>

//               <NativeSelect {...register("status")}>
//                 <NativeSelectOption value="TRIAL">Trial</NativeSelectOption>

//                 <NativeSelectOption value="ACTIVE">Active</NativeSelectOption>

//                 <NativeSelectOption value="PAST_DUE">
//                   Past due
//                 </NativeSelectOption>

//                 <NativeSelectOption value="CANCELED">
//                   Canceled
//                 </NativeSelectOption>

//                 <NativeSelectOption value="EXPIRED">Expired</NativeSelectOption>
//               </NativeSelect>
//             </div>
//           </div>

//           {/* Dates */}
//           <div className="grid gap-4 sm:grid-cols-2">
//             <div className="space-y-2">
//               <Label htmlFor="subscription-start">Start date</Label>

//               <div className="relative">
//                 <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

//                 <Input
//                   id="subscription-start"
//                   type="date"
//                   className="pl-9"
//                   {...register("startsAt")}
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="subscription-expiry">Expiry date</Label>

//               <div className="relative">
//                 <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

//                 <Input
//                   id="subscription-expiry"
//                   type="date"
//                   className="pl-9"
//                   {...register("expiresAt")}
//                 />
//               </div>

//               <p className="text-xs text-muted-foreground">
//                 Leave empty for no expiration date.
//               </p>
//             </div>
//           </div>

//           {/* Warning */}
//           {status === "EXPIRED" ||
//           status === "CANCELED" ||
//           status === "PAST_DUE" ? (
//             <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4 text-xs leading-5 text-muted-foreground">
//               Existing NFC and QR cards will stop redirecting, analytics and
//               subscription-locked features will be unavailable.
//             </div>
//           ) : null}

//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               disabled={pending}
//               onClick={() => onOpenChange(false)}
//             >
//               Cancel
//             </Button>

//             <Button type="submit" disabled={pending}>
//               {pending && <Loader2 className="size-4 animate-spin" />}

//               {subscription ? "Save changes" : "Activate subscription"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Crown,
  Loader2,
  RefreshCw,
  Sparkles,
  Zap,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  Button,
} from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Label,
} from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useActivatePaidSubscription,
  useStartTrial,
  useSubscriptionUsage,
} from "@/hooks/subscriptions/use-subscription";

import type {
  SubscriptionPlan,
} from "@/types/subscription";

interface ManageSubscriptionDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  businessId: string;

  businessName?: string | null;
}

const PLAN_OPTIONS: Array<{
  value: SubscriptionPlan;
  name: string;
  price: string;
  locations: number;
  cards: number;
  icon:
    typeof Zap;
}> = [
  {
    value: "STARTER",
    name: "Starter",
    price: "$4.50 / month",
    locations: 1,
    cards: 2,
    icon: Zap,
  },

  {
    value: "PRO",
    name: "Pro",
    price: "$8 / month",
    locations: 3,
    cards: 10,
    icon: Sparkles,
  },

  {
    /*
     * Backend enum stays BUSINESS.
     * Public/admin display name is Premium.
     */
    value: "BUSINESS",
    name: "Premium",
    price: "$12 / month",
    locations: 10,
    cards: 50,
    icon: Crown,
  },
];

function formatDate(
  value?: string | Date | null
) {
  if (!value) {
    return "—";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  ).format(date);
}

function getPlanName(
  plan?: string | null
) {
  switch (plan) {
    case "STARTER":
      return "Starter";

    case "PRO":
      return "Pro";

    case "BUSINESS":
      return "Premium";

    default:
      return "—";
  }
}

function getStatusLabel(
  status?: string | null
) {
  switch (status) {
    case "TRIAL":
      return "Free trial";

    case "ACTIVE":
      return "Active";

    case "EXPIRED":
      return "Expired";

    case "CANCELED":
      return "Canceled";

    case "PAST_DUE":
      return "Past due";

    default:
      return "No subscription";
  }
}

function getStatusClassName(
  status?: string | null
) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";

    case "TRIAL":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400";

    case "EXPIRED":
      return "bg-red-500/10 text-red-700 dark:text-red-400";

    case "CANCELED":
      return "bg-muted text-muted-foreground";

    case "PAST_DUE":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400";

    default:
      return "bg-muted text-muted-foreground";
  }
}

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response =
      (
        error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        }
      ).response;

    if (
      response?.data
        ?.message
    ) {
      return response
        .data.message;
    }
  }

  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }

  return fallback;
}

export function ManageSubscriptionDialog({
  open,
  onOpenChange,
  businessId,
  businessName,
}: ManageSubscriptionDialogProps) {
  const [
    selectedPlan,
    setSelectedPlan,
  ] =
    useState<SubscriptionPlan>(
      "STARTER"
    );

  const [
    months,
    setMonths,
  ] =
    useState("1");

  /*
   * Current subscription,
   * trial eligibility and usage.
   */
  const {
    data: usageData,
    isLoading:
      isLoadingUsage,
    refetch:
      refetchUsage,
  } =
    useSubscriptionUsage(
      businessId
    );

  const startTrial =
    useStartTrial();

  const activatePaid =
    useActivatePaidSubscription();

  const subscription =
    usageData
      ?.subscription ??
    null;

  const trial =
    usageData?.trial ?? {
      eligible: false,
      startedAt: null,
    };

  /*
   * Whenever the dialog opens,
   * default the selected plan to
   * the current plan if one exists.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    if (
      subscription?.plan
    ) {
      setSelectedPlan(
        subscription.plan
      );
    } else {
      setSelectedPlan(
        "STARTER"
      );
    }

    setMonths("1");
  }, [
    open,
    subscription?.plan,
  ]);

  const selectedPlanInfo =
    useMemo(
      () =>
        PLAN_OPTIONS.find(
          (plan) =>
            plan.value ===
            selectedPlan
        ) ??
        PLAN_OPTIONS[0],
      [selectedPlan]
    );

  const isMutationPending =
    startTrial.isPending ||
    activatePaid.isPending;

  /*
   * Trial is intentionally
   * controlled by the backend.
   *
   * No date is calculated here.
   */
  const handleStartTrial =
    async () => {
      try {
        await startTrial.mutateAsync(
          businessId
        );

        toast.success(
          "30-day free trial started successfully"
        );

        await refetchUsage();

        onOpenChange(false);
      } catch (error) {
        toast.error(
          getErrorMessage(
            error,
            "Unable to start the free trial"
          )
        );
      }
    };

  /*
   * Paid subscription dates are
   * also calculated by the backend.
   *
   * If the customer still has
   * trial/paid time remaining, the
   * backend preserves it.
   */
  const handleActivatePaid =
    async () => {
      const parsedMonths =
        Number(months);

      if (
        !Number.isInteger(
          parsedMonths
        ) ||
        parsedMonths < 1
      ) {
        toast.error(
          "Choose a valid subscription duration"
        );

        return;
      }

      try {
        await activatePaid
          .mutateAsync({
            businessId,

            plan:
              selectedPlan,

            months:
              parsedMonths,
          });

        toast.success(
          subscription
            ? "Subscription renewed successfully"
            : "Subscription activated successfully"
        );

        await refetchUsage();

        onOpenChange(false);
      } catch (error) {
        toast.error(
          getErrorMessage(
            error,
            "Unable to activate the subscription"
          )
        );
      }
    };

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Manage subscription
          </DialogTitle>

          <DialogDescription>
            Manage the free trial
            or paid ValYou
            subscription for{" "}
            <span className="font-medium text-foreground">
              {businessName ??
                "this business"}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        {isLoadingUsage ? (
          <div className="flex min-h-56 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6 py-2">
            {/* Current subscription */}
            <section className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold">
                  Current status
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Current subscription
                  information for this
                  business.
                </p>
              </div>

              <div className="rounded-xl border bg-muted/20 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Plan
                    </p>

                    <p className="mt-1 font-semibold">
                      {getPlanName(
                        subscription
                          ?.plan
                      )}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClassName(
                      subscription
                        ?.status
                    )}`}
                  >
                    {getStatusLabel(
                      subscription
                        ?.status
                    )}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Started
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {formatDate(
                        subscription
                          ?.startsAt
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Expires
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {formatDate(
                        subscription
                          ?.expiresAt
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Trial */}
            <section className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold">
                  Free trial
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Each business can
                  receive one 30-day
                  ValYou trial.
                </p>
              </div>

              {trial.eligible ? (
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <div className="flex gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                      <Sparkles className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-medium">
                        30-day free
                        trial available
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Start the trial
                        only after the
                        physical card
                        has been paid for
                        and delivered.
                      </p>

                      <p className="mt-2 text-xs text-muted-foreground">
                        The backend
                        verifies that at
                        least one $10
                        card has been
                        delivered before
                        activating the
                        trial.
                      </p>

                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        disabled={
                          isMutationPending
                        }
                        onClick={
                          handleStartTrial
                        }
                      >
                        {startTrial
                          .isPending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Sparkles className="size-4" />
                        )}

                        Start 30-day
                        trial
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border bg-muted/20 p-4">
                  <div className="flex gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Sparkles className="size-5 text-muted-foreground" />
                    </div>

                    <div>
                      <p className="font-medium">
                        Free trial
                        already used
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        This business
                        has already
                        started its
                        one-time free
                        trial.
                      </p>

                      {trial.startedAt && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Trial started{" "}
                          {formatDate(
                            trial.startedAt
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Paid subscription */}
            <section className="space-y-4 border-t pt-6">
              <div>
                <h3 className="text-sm font-semibold">
                  Paid subscription
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Activate or renew a
                  paid ValYou plan.
                  Remaining valid trial
                  or subscription time
                  is preserved
                  automatically.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subscription-plan">
                  Plan
                </Label>

                <Select
                  value={
                    selectedPlan
                  }
                  onValueChange={(
                    value
                  ) =>
                    setSelectedPlan(
                      value as SubscriptionPlan
                    )
                  }
                >
                  <SelectTrigger id="subscription-plan">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {PLAN_OPTIONS.map(
                      (plan) => {
                        const Icon =
                          plan.icon;

                        return (
                          <SelectItem
                            key={
                              plan.value
                            }
                            value={
                              plan.value
                            }
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="size-4" />

                              <span>
                                {
                                  plan.name
                                }{" "}
                                —{" "}
                                {
                                  plan.price
                                }
                              </span>
                            </div>
                          </SelectItem>
                        );
                      }
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-xl border bg-muted/20 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <selectedPlanInfo.icon className="size-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">
                        {
                          selectedPlanInfo.name
                        }
                      </p>

                      <span className="text-sm font-medium text-muted-foreground">
                        {
                          selectedPlanInfo.price
                        }
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <p>
                        Up to{" "}
                        {
                          selectedPlanInfo.locations
                        }{" "}
                        {selectedPlanInfo.locations ===
                        1
                          ? "location"
                          : "locations"}
                      </p>

                      <p>
                        Up to{" "}
                        {
                          selectedPlanInfo.cards
                        }{" "}
                        review cards
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subscription-months">
                  Duration
                </Label>

                <Select
                  value={months}
                
                  onValueChange={(value) => {
                    if (value !== null) {
                      setMonths(value);
                    }
                  }}
                >
                  <SelectTrigger id="subscription-months w-[250px]">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent className={"w-[250px]"}>
                    <SelectItem value="1">
                      1 month
                    </SelectItem>

                    <SelectItem value="2">
                      2 months
                    </SelectItem>

                    <SelectItem value="3">
                      3 months
                    </SelectItem>

                    <SelectItem value="6">
                      6 months
                    </SelectItem>

                    <SelectItem value="12">
                      12 months
                    </SelectItem>
                  </SelectContent>
                </Select>

                <p className="text-xs text-muted-foreground">
                  If the business
                  still has remaining
                  trial or paid time,
                  the selected months
                  are added after the
                  current expiry date.
                </p>
              </div>

              <Button
                type="button"
                className="w-full"
                disabled={
                  isMutationPending
                }
                onClick={
                  handleActivatePaid
                }
              >
                {activatePaid
                  .isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RefreshCw className="size-4" />
                )}

                {subscription
                  ? "Activate / renew subscription"
                  : "Activate paid subscription"}
              </Button>
            </section>

            {/* Commercial note */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-sm font-medium">
                ValYou commercial
                model
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Physical cards are
                sold separately for{" "}
                <span className="font-medium text-foreground">
                  $10 one-time per
                  card
                </span>
                . The first month of
                ValYou is provided as
                the business&apos;s
                one-time free trial.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={
              isMutationPending
            }
            onClick={() =>
              onOpenChange(
                false
              )
            }
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}