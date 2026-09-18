"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Building2, CalendarDays, Image, Loader2, Plus } from "lucide-react";

import { toast } from "sonner";

import {
  additionalBusinessFormSchema,
  type AdditionalBusinessFormValues,
} from "@/lib/validations/customer";

import { useCreateAdditionalBusiness } from "@/hooks/admin/customers/use-customers";

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

import { ExternalLink, MapPin, MapPinned } from "lucide-react";

type Props = {
  userId: string;

  customerName: string;

  open: boolean;

  onOpenChange: (open: boolean) => void;
};

export function AddBusinessDialog({
  userId,
  customerName,
  open,
  onOpenChange,
}: Props) {
  const create = useCreateAdditionalBusiness();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AdditionalBusinessFormValues>({
    resolver: zodResolver(additionalBusinessFormSchema),

    defaultValues: {
      name: "",
      logoUrl: "",

      locationName: "",
      address: "",
      googleReviewUrl: "",

      subscriptionMode: "NONE",

      plan: "STARTER",

      trialDays: 14,

      expiresAt: "",
    },
  });

  const mode = watch("subscriptionMode");

  useEffect(() => {
    if (!open) {
      return;
    }
    reset({
      name: "",
      logoUrl: "",

      locationName: "",
      address: "",
      googleReviewUrl: "",

      subscriptionMode: "NONE",

      plan: "STARTER",

      trialDays: 14,

      expiresAt: "",
    });
  }, [open, reset]);

  const submit = async (values: AdditionalBusinessFormValues) => {
    try {
      const subscription =
        values.subscriptionMode === "NONE"
          ? {
              mode: "NONE" as const,
            }
          : values.subscriptionMode === "TRIAL"
          ? {
              mode: "TRIAL" as const,

              plan: values.plan,

              days: values.trialDays,
            }
          : {
              mode: "ACTIVE" as const,

              plan: values.plan,

              expiresAt: values.expiresAt
                ? new Date(`${values.expiresAt}T23:59:59`).toISOString()
                : null,
            };

      await create.mutateAsync({
        userId,

        payload: {
          name: values.name,

          logoUrl: values.logoUrl || null,

          subscription,
          location: {
            name: values.locationName,

            address: values.address || null,

            googleReviewUrl: values.googleReviewUrl,
          },
        },
      });

      toast.success("Business added");

      onOpenChange(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to add business"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add business</DialogTitle>

          <DialogDescription>
            Create another independent ValYou workspace for {customerName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Business</h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Each business has its own subscription, locations and cards.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-business-name">Business name</Label>

              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="new-business-name"
                  className="pl-9"
                  placeholder="Coffee Lab"
                  {...register("name")}
                />
              </div>

              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-business-logo">Logo URL</Label>

              <div className="relative">
                <Image className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="new-business-logo"
                  className="pl-9"
                  placeholder="Optional"
                  {...register("logoUrl")}
                />
              </div>

              {errors.logoUrl && (
                <p className="text-xs text-destructive">
                  {errors.logoUrl.message}
                </p>
              )}
            </div>
          </section>

          <div className="border-t border-border/60" />

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">First location</h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Every physical ValYou card must be assigned to a location, so
                create the first location now.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-name">Location name</Label>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="location-name"
                  className="pl-9"
                  placeholder="Hamra Branch"
                  {...register("locationName")}
                />
              </div>

              {errors.locationName && (
                <p className="text-xs text-destructive">
                  {errors.locationName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-address">Address</Label>

              <div className="relative">
                <MapPinned className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="location-address"
                  className="pl-9"
                  placeholder="Hamra, Beirut"
                  {...register("address")}
                />
              </div>

              {errors.address && (
                <p className="text-xs text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="google-review-url">Google Review URL</Label>

              <div className="relative">
                <ExternalLink className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="google-review-url"
                  className="pl-9"
                  placeholder="https://g.page/r/..."
                  {...register("googleReviewUrl")}
                />
              </div>

              {errors.googleReviewUrl && (
                <p className="text-xs text-destructive">
                  {errors.googleReviewUrl.message}
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                NFC and QR interactions for cards assigned to this location will
                redirect to this Google Review URL.
              </p>
            </div>
          </section>

          <div className="border-t border-border/60" />

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Initial subscription</h3>

              <p className="mt-1 text-xs text-muted-foreground">
                This is independent from the customer&apos;s other businesses.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Access mode</Label>

                <NativeSelect {...register("subscriptionMode")}>
                  <NativeSelectOption value="NONE">
                    No subscription
                  </NativeSelectOption>

                  <NativeSelectOption value="TRIAL">
                    Free trial
                  </NativeSelectOption>

                  <NativeSelectOption value="ACTIVE">
                    Active subscription
                  </NativeSelectOption>
                </NativeSelect>
              </div>

              {mode !== "NONE" && (
                <div className="space-y-2">
                  <Label>Plan</Label>

                  <NativeSelect {...register("plan")}>
                    <NativeSelectOption value="STARTER">
                      Starter
                    </NativeSelectOption>

                    <NativeSelectOption value="PRO">Pro</NativeSelectOption>

                    <NativeSelectOption value="BUSINESS">
                      Business
                    </NativeSelectOption>
                  </NativeSelect>
                </div>
              )}
            </div>

            {mode === "TRIAL" && (
              <div className="space-y-2">
                <Label htmlFor="additional-trial-days">Trial duration</Label>

                <div className="relative max-w-xs">
                  <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="additional-trial-days"
                    type="number"
                    min={1}
                    max={90}
                    className="pl-9"
                    {...register("trialDays")}
                  />
                </div>
              </div>
            )}

            {mode === "ACTIVE" && (
              <div className="space-y-2">
                <Label htmlFor="additional-expiry">Expiry date</Label>

                <Input
                  id="additional-expiry"
                  type="date"
                  className="max-w-xs"
                  {...register("expiresAt")}
                />
              </div>
            )}

            {mode === "NONE" && (
              <div className="rounded-xl border border-border/70 bg-muted/40 p-4 text-xs leading-5 text-muted-foreground">
                The workspace will exist, but analytics, new locations and new
                card assignments will remain locked until you activate a
                subscription.
              </div>
            )}
          </section>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={create.isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Add business
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
