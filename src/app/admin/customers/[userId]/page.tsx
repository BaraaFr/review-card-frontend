"use client";

import { useState } from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Building2,
  KeyRound,
  Plus,
  Power,
  PowerOff,
  RefreshCw,
} from "lucide-react";

import { useParams } from "next/navigation";

import { toast } from "sonner";

import {
  useCustomer,
  useResendActivation,
} from "@/hooks/admin/customers/use-customers";

import { getApiErrorMessage } from "@/lib/api-error";

import type { ActivationResult, CustomerBusiness } from "@/types/customer";

import { CustomerAccountCard } from "@/components/admin/customers/customer-account-card";

import { CustomerBusinessCard } from "@/components/admin/customers/customer-business-card";

import { AddBusinessDialog } from "@/components/admin/customers/add-business-dialog";

import { ActivationLinkDialog } from "@/components/admin/customers/activation-link-dialog";

import { CustomerStatusDialog } from "@/components/admin/customers/customer-status-dialog";

import { Button, buttonVariants } from "@/components/ui/button";
import { BusinessSubscriptionDialog } from "@/components/admin/subscriptions/business-subscription-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AddLocationDialog } from "@/components/admin/customers/add-location-dialog";
import { ManageLocationsDialog } from "@/components/admin/customers/manage-locations-dialog";

export default function CustomerDetailPage() {
  const params = useParams<{
    userId: string;
  }>();

  const userId = params.userId;

  const { data: customer, isLoading, isError, refetch } = useCustomer(userId);

  const resend = useResendActivation();

  const [addBusinessOpen, setAddBusinessOpen] = useState(false);

  const [locationBusiness, setLocationBusiness] =
    useState<CustomerBusiness | null>(null);

  const [subscriptionBusiness, setSubscriptionBusiness] =
    useState<CustomerBusiness | null>(null);

  const [activationResult, setActivationResult] =
    useState<ActivationResult | null>(null);

  const [statusAction, setStatusAction] = useState<"enable" | "disable" | null>(
    null
  );

  const resendActivation = async () => {
    if (!customer) {
      return;
    }

    try {
      const result = await resend.mutateAsync(customer.id);

      setActivationResult(result);

      toast.success("New activation link generated");
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Unable to generate activation link")
      );
    }
  };

  if (isLoading) {
    return <CustomerDetailSkeleton />;
  }

  if (isError || !customer) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-center">
        <div>
          <p className="text-lg font-semibold">Unable to load customer</p>

          <p className="mt-2 text-sm text-muted-foreground">
            The customer may not exist or couldn't be loaded.
          </p>

          <Button variant="outline" className="mt-5" onClick={() => refetch()}>
            <RefreshCw className="size-4" />
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-7">
        {/* Back */}
        <Link
          href="/admin/customers"
          className={buttonVariants({
            variant: "ghost",

            size: "sm",

            className: "-ml-2",
          })}
        >
          <ArrowLeft data-icon="inline-start" className="size-4" />
          Customers
        </Link>

        {/* Heading */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Customer
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
              {customer.name}
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {customer.email}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {customer.status === "PENDING" && (
              <Button
                variant="outline"
                disabled={resend.isPending}
                onClick={resendActivation}
              >
                <KeyRound className="size-4" />
                Generate activation
              </Button>
            )}

            {customer.status === "ACTIVE" && (
              <Button
                variant="outline"
                onClick={() => setStatusAction("disable")}
              >
                <PowerOff className="size-4" />
                Disable
              </Button>
            )}

            {customer.status === "DISABLED" && (
              <Button
                variant="outline"
                onClick={() => setStatusAction("enable")}
              >
                <Power className="size-4" />
                Enable
              </Button>
            )}

            <Button onClick={() => setAddBusinessOpen(true)}>
              <Plus className="size-4" />
              Add business
            </Button>
          </div>
        </div>

        {/* Account summary */}
        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <CustomerAccountCard customer={customer} />

          <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-6 shadow-sm">
            <div className="pointer-events-none absolute -right-24 -top-24 size-60 rounded-full bg-emerald-500/[0.07] blur-[80px]" />

            <div className="relative">
              <p className="text-sm text-muted-foreground">
                Managed businesses
              </p>

              <p className="mt-2 text-4xl font-semibold tracking-[-0.045em]">
                {customer.businesses.length}
              </p>

              <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
                Each business is an independent ValYou workspace with its own
                subscription, locations, physical cards and analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Businesses */}
        <section className="space-y-4 pt-2">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Businesses
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Workspaces owned by this customer.
              </p>
            </div>
          </div>

          {customer.businesses.length === 0 ? (
            <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-border">
              <div className="text-center">
                <Building2 className="mx-auto size-8 text-muted-foreground/50" />

                <p className="mt-4 font-medium">No businesses</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Add a business workspace for this customer.
                </p>

                <Button
                  className="mt-5"
                  onClick={() => setAddBusinessOpen(true)}
                >
                  <Plus className="size-4" />
                  Add business
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {customer.businesses.map((business) => (
                <CustomerBusinessCard
                  key={business.id}
                  business={business}
                  onManageLocations={setLocationBusiness}
                  onManageSubscription={setSubscriptionBusiness}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <AddBusinessDialog
        userId={customer.id}
        customerName={customer.name}
        open={addBusinessOpen}
        onOpenChange={setAddBusinessOpen}
      />

      <ActivationLinkDialog
        result={activationResult}
        customerName={customer.name}
        open={Boolean(activationResult)}
        onOpenChange={(open) => {
          if (!open) {
            setActivationResult(null);
          }
        }}
      />

      {locationBusiness && (
        <ManageLocationsDialog
          businessId={locationBusiness.id}
          businessName={locationBusiness.name}
          open={Boolean(locationBusiness)}
          onOpenChange={(open) => {
            if (!open) {
              setLocationBusiness(null);
            }
          }}
        />
      )}

      {subscriptionBusiness && (
        <BusinessSubscriptionDialog
          businessId={subscriptionBusiness.id}
          businessName={subscriptionBusiness.name}
          open={Boolean(subscriptionBusiness)}
          onOpenChange={(open) => {
            if (!open) {
              setSubscriptionBusiness(null);
            }
          }}
        />
      )}

      <CustomerStatusDialog
        customer={customer}
        action={statusAction}
        open={Boolean(statusAction)}
        onOpenChange={(open) => {
          if (!open) {
            setStatusAction(null);
          }
        }}
      />
    </>
  );
}

function CustomerDetailSkeleton() {
  return (
    <div className="space-y-7">
      <Skeleton className="h-9 w-28" />

      <div>
        <Skeleton className="h-10 w-72" />

        <Skeleton className="mt-3 h-4 w-48" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <Skeleton className="h-64 rounded-2xl" />

        <Skeleton className="h-64 rounded-2xl" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Skeleton className="h-72 rounded-2xl" />

        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}
