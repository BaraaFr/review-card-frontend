"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Building2,
  CalendarDays,
  Image,
  Loader2,
  Mail,
  UserRound,
} from "lucide-react";

import { toast } from "sonner";

import {
  createCustomerFormSchema,
  type CreateCustomerFormValues,
} from "@/lib/validations/customer";

import { getApiErrorMessage } from "@/lib/api-error";

import { useCreateCustomer } from "@/hooks/admin/customers/use-customers";

import type { CustomerCreationResult } from "@/types/customer";

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
  open: boolean;

  onOpenChange: (open: boolean) => void;

  onCreated: (result: CustomerCreationResult) => void;
};

export function CreateCustomerDialog({ open, onOpenChange, onCreated }: Props) {
  const createCustomer = useCreateCustomer();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateCustomerFormValues>({
    resolver: zodResolver(createCustomerFormSchema),

    defaultValues: {
      name: "",
      email: "",

      businessName: "",

      logoUrl: "",

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
      email: "",

      businessName: "",

      logoUrl: "",

      subscriptionMode: "NONE",

      plan: "STARTER",

      trialDays: 14,

      expiresAt: "",
    });
  }, [open, reset]);

  const submit = async (values: CreateCustomerFormValues) => {
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

      const result = await createCustomer.mutateAsync({
        name: values.name,

        email: values.email,

        business: {
          name: values.businessName,

          logoUrl: values.logoUrl || null,
        },

        subscription,
      });

      toast.success("Customer created");

      onOpenChange(false);

      onCreated(result);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to create customer"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add customer</DialogTitle>

          <DialogDescription>
            Create the customer&apos;s account and first business workspace.
            Subscription access is activated separately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-7">
          {/* Customer */}
          <section className="space-y-4">
            <SectionTitle
              title="Customer"
              description="Who will own this ValYou account?"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                id="customer-name"
                label="Full name"
                icon={UserRound}
                error={errors.name?.message}
              >
                <Input
                  id="customer-name"
                  className="pl-9"
                  placeholder="Ahmad Khalil"
                  {...register("name")}
                />
              </InputField>

              <InputField
                id="customer-email"
                label="Email"
                icon={Mail}
                error={errors.email?.message}
              >
                <Input
                  id="customer-email"
                  className="pl-9"
                  placeholder="ahmad@burgero.com"
                  {...register("email")}
                />
              </InputField>
            </div>
          </section>

          <div className="border-t border-border/60" />

          {/* Business */}
          <section className="space-y-4">
            <SectionTitle
              title="Business workspace"
              description="The customer's first business in ValYou."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                id="business-name"
                label="Business name"
                icon={Building2}
                error={errors.businessName?.message}
              >
                <Input
                  id="business-name"
                  className="pl-9"
                  placeholder="Burgero"
                  {...register("businessName")}
                />
              </InputField>

              <InputField
                id="business-logo"
                label="Logo URL"
                icon={Image}
                error={errors.logoUrl?.message}
              >
                <Input
                  id="business-logo"
                  className="pl-9"
                  placeholder="Optional"
                  {...register("logoUrl")}
                />
              </InputField>
            </div>
          </section>

          <div className="border-t border-border/60" />

          {/* Subscription */}
          <section className="space-y-4">
            <SectionTitle
              title="Subscription"
              description="Choose how this workspace starts."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Access mode</Label>

                <NativeSelect {...register("subscriptionMode")}>
                  <NativeSelectOption value="NONE">
                    No subscription
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
                <Label htmlFor="trial-days">Trial duration</Label>

                <div className="relative max-w-xs">
                  <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="trial-days"
                    type="number"
                    min={1}
                    max={90}
                    className="pl-9"
                    {...register("trialDays")}
                  />
                </div>

                {errors.trialDays && (
                  <p className="text-xs text-destructive">
                    {errors.trialDays.message}
                  </p>
                )}
              </div>
            )}

            {mode === "ACTIVE" && (
              <div className="space-y-2">
                <Label htmlFor="subscription-expiry">Expiry date</Label>

                <Input
                  id="subscription-expiry"
                  type="date"
                  className="max-w-xs"
                  {...register("expiresAt")}
                />

                <p className="text-xs text-muted-foreground">
                  Leave empty if you don&apos;t want to set an expiry yet.
                </p>
              </div>
            )}

            {mode === "NONE" && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4 text-xs leading-5 text-muted-foreground">
                The customer can activate their account, but subscription-locked
                functionality such as analytics will remain unavailable.
              </div>
            )}
          </section>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={createCustomer.isPending}>
              {createCustomer.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Create customer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>

      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function InputField({
  id,
  label,
  icon: Icon,
  error,
  children,
}: {
  id: string;

  label: string;

  icon: React.ElementType;

  error?: string;

  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

        {children}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
