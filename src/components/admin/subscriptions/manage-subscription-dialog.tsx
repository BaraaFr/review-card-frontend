"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { CalendarDays, Crown, Loader2, RefreshCw } from "lucide-react";

import { addMonths, addYears, format } from "date-fns";

import { toast } from "sonner";

import type { Subscription } from "@/types/subscription";

import {
  manageSubscriptionSchema,
  type ManageSubscriptionFormValues,
} from "@/lib/validations/manage-subscription";

import {
  useCreateSubscription,
  useUpdateSubscription,
} from "@/hooks/subscriptions/use-subscription";

import { getApiErrorMessage } from "@/lib/api-error";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  businessId: string;

  businessName: string;

  subscription: Subscription | null;

  open: boolean;

  onOpenChange: (open: boolean) => void;
};

export function ManageSubscriptionDialog({
  businessId,
  businessName,
  subscription,
  open,
  onOpenChange,
}: Props) {
  const create = useCreateSubscription();

  const update = useUpdateSubscription();

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<ManageSubscriptionFormValues>({
      resolver: zodResolver(manageSubscriptionSchema),
    });

  const status = watch("status");

  const expiresAt = watch("expiresAt");

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      plan: subscription?.plan ?? "STARTER",

      status: subscription?.status ?? "ACTIVE",

      startsAt: subscription?.startsAt
        ? format(new Date(subscription.startsAt), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),

      expiresAt: subscription?.expiresAt
        ? format(new Date(subscription.expiresAt), "yyyy-MM-dd")
        : "",
    });
  }, [open, subscription, reset]);

  const getRenewalBase = () => {
    if (!expiresAt) {
      return new Date();
    }

    const expiry = new Date(`${expiresAt}T12:00:00`);

    return expiry > new Date() ? expiry : new Date();
  };

  const setOneMonth = () => {
    setValue("status", "ACTIVE");

    setValue("expiresAt", format(addMonths(getRenewalBase(), 1), "yyyy-MM-dd"));
  };

  const setOneYear = () => {
    setValue("status", "ACTIVE");
    setValue("expiresAt", format(addYears(getRenewalBase(), 1), "yyyy-MM-dd"));
  };

  const startTrial = () => {
    const now = new Date();

    setValue("status", "TRIAL");

    setValue("plan", "STARTER");

    setValue("startsAt", format(now, "yyyy-MM-dd"));

    setValue("expiresAt", format(addMonths(now, 0), "yyyy-MM-dd"));

    const trialEnd = new Date(now);

    trialEnd.setDate(trialEnd.getDate() + 14);

    setValue("expiresAt", format(trialEnd, "yyyy-MM-dd"));
  };

  const activate = () => {
    setValue("status", "ACTIVE");

    setValue("startsAt", format(new Date(), "yyyy-MM-dd"));
  };

  const submit = async (values: ManageSubscriptionFormValues) => {
    const payload = {
      plan: values.plan,

      status: values.status,

      startsAt: new Date(`${values.startsAt}T00:00:00`).toISOString(),

      expiresAt: values.expiresAt
        ? new Date(`${values.expiresAt}T23:59:59`).toISOString()
        : null,
    };

    try {
      if (subscription) {
        await update.mutateAsync({
          subscriptionId: subscription.id,

          businessId,

          payload,
        });

        toast.success("Subscription updated");
      } else {
        await create.mutateAsync({
          businessId,

          payload,
        });

        toast.success("Subscription activated");
      }

      onOpenChange(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to update subscription"));
    }
  };

  const pending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-emerald-500/10">
            <Crown className="size-5 text-emerald-600 dark:text-emerald-400" />
          </div>

          <DialogTitle>Manage subscription</DialogTitle>

          <DialogDescription>
            Manage the plan and subscription status for {businessName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          {/* Current */}
          <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Current subscription
            </p>

            <div className="mt-2">
              {subscription ? (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{subscription.plan}</span>

                  <span className="text-sm text-muted-foreground">/</span>

                  <span className="text-sm">{subscription.status}</span>
                </div>
              ) : (
                <span className="text-sm text-amber-600 dark:text-amber-400">
                  No subscription
                </span>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <Label>Quick actions</Label>

            <div className="mt-2 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={activate}
              >
                Activate
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={startTrial}
              >
                Start 14-day trial
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={setOneMonth}
              >
                <RefreshCw className="size-3.5" />
                +1 month
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={setOneYear}
              >
                <RefreshCw className="size-3.5" />
                +1 year
              </Button>
            </div>
          </div>

          {/* Plan + status */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Plan</Label>

              <NativeSelect {...register("plan")}>
                <NativeSelectOption value="STARTER">Starter</NativeSelectOption>

                <NativeSelectOption value="PRO">Pro</NativeSelectOption>

                <NativeSelectOption value="BUSINESS">
                  Business
                </NativeSelectOption>
              </NativeSelect>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>

              <NativeSelect {...register("status")}>
                <NativeSelectOption value="TRIAL">Trial</NativeSelectOption>

                <NativeSelectOption value="ACTIVE">Active</NativeSelectOption>

                <NativeSelectOption value="PAST_DUE">
                  Past due
                </NativeSelectOption>

                <NativeSelectOption value="CANCELED">
                  Canceled
                </NativeSelectOption>

                <NativeSelectOption value="EXPIRED">Expired</NativeSelectOption>
              </NativeSelect>
            </div>
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subscription-start">Start date</Label>

              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="subscription-start"
                  type="date"
                  className="pl-9"
                  {...register("startsAt")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscription-expiry">Expiry date</Label>

              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="subscription-expiry"
                  type="date"
                  className="pl-9"
                  {...register("expiresAt")}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Leave empty for no expiration date.
              </p>
            </div>
          </div>

          {/* Warning */}
          {status === "EXPIRED" ||
          status === "CANCELED" ||
          status === "PAST_DUE" ? (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4 text-xs leading-5 text-muted-foreground">
              Existing NFC and QR cards will continue redirecting and
              interactions will continue being recorded, but analytics and
              subscription-locked features will be unavailable.
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />}

              {subscription ? "Save changes" : "Activate subscription"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
