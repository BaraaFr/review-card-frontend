"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  Building2,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
} from "lucide-react";

import type {
  Business,
} from "@/types/business";

import {
  useBusinesses,
} from "@/hooks/business/use-businesses";

import {
  useBusinessStore,
} from "@/stores/business.store";

import {
  BusinessFormDialog,
} from "@/components/businesses/business-form-dialog";

import {
  Button,
  buttonVariants,
} from "@/components/ui/button";

import {
  Skeleton,
} from "@/components/ui/skeleton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Headphones,
} from "lucide-react";

export default function BusinessesPage() {
  const {
    data: businesses = [],
    isLoading,
  } =
    useBusinesses();

  const {
    setBusinessId,
  } =
    useBusinessStore();

  const [
    dialogOpen,
    setDialogOpen,
  ] = useState(false);

  const [
    editingBusiness,
    setEditingBusiness,
  ] =
    useState<
      Business | null
    >(null);

  const openEdit = (
    business: Business
  ) => {
    setEditingBusiness(
      business
    );

    setDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Workspace
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
              Businesses
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Manage the businesses
              connected to your
              review platform.
            </p>
          </div>

        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({
              length: 3,
            }).map(
              (_, index) => (
                <Skeleton
                  key={
                    index
                  }
                  className="h-56 rounded-2xl"
                />
              )
            )}
          </div>
        ) : businesses.length ===
          0 ? (
          <BusinessesEmptyState />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {businesses.map(
              (
                business
              ) => (
                <div
                  key={
                    business.id
                  }
                  className="group rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm transition hover:border-emerald-500/20 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex size-11 items-center justify-center overflow-hidden rounded-xl bg-emerald-500/10">
                      {business.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={
                            business.logoUrl
                          }
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <Building2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                      )}
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
                            onClick={() =>
                              openEdit(
                                business
                              )
                            }
                          >
                            <Pencil className="size-4" />

                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {
                        business.name
                      }
                    </h3>

                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="size-4" />

                      {business
                        ._count
                        ?.stores ??
                        0}{" "}
                      {business
                        ._count
                        ?.stores ===
                      1
                        ? "location"
                        : "locations"}
                    </div>
                  </div>

                  <div className="mt-7 border-t border-border/60 pt-4">
                    <Link
                      href="/locations"
                      onClick={() =>
                        setBusinessId(
                          business.id
                        )
                      }
                      className={buttonVariants(
                        {
                          variant:
                            "outline",

                          className:
                            "w-full",
                        }
                      )}
                    >
                      Manage locations
                    </Link>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <BusinessFormDialog
        open={dialogOpen}
        onOpenChange={
          setDialogOpen
        }
        business={
          editingBusiness
        }
      />
    </>
  );
}

function BusinessesEmptyState() {
  return (
    <div className="flex min-h-[55vh] items-center justify-center rounded-2xl border border-dashed border-border">
      <div className="max-w-md px-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10">
          <Building2 className="size-6 text-emerald-500" />
        </div>

        <h3 className="mt-5 text-xl font-semibold">
          No workspace assigned
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Your ValYou account
          doesn't currently have a
          business workspace
          assigned to it.
        </p>

        <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border/70 bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          <Headphones className="size-4" />

          Contact ValYou if you
          believe this is a mistake.
        </div>
      </div>
    </div>
  );
}