"use client";

import { useMemo, useState } from "react";

import {
  Building2,
  Clock3,
  MoreHorizontal,
  Plus,
  Power,
  PowerOff,
  RefreshCw,
  Search,
  UsersRound,
  UserRoundCheck,
} from "lucide-react";

import { format, parseISO } from "date-fns";

import { toast } from "sonner";

import type {
  ActivationResult,
  Customer,
  CustomerCreationResult,
  CustomerStatus,
} from "@/types/customer";

import {
  useCustomers,
  useResendActivation,
} from "@/hooks/admin/customers/use-customers";

import { getApiErrorMessage } from "@/lib/api-error";

import { CustomerStatusBadge } from "@/components/admin/customers/customer-status-badge";

import { CustomerStatCard } from "@/components/admin/customers/customer-stat-card";

import { CreateCustomerDialog } from "@/components/admin/customers/create-customer-dialog";

import { ActivationLinkDialog } from "@/components/admin/customers/activation-link-dialog";

import { CustomerStatusDialog } from "@/components/admin/customers/customer-status-dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Skeleton } from "@/components/ui/skeleton";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";

type StatusAction = "enable" | "disable";

export default function AdminCustomersPage() {
  const { data: customers = [], isLoading, isError, refetch } = useCustomers();

  const resend = useResendActivation();

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<"" | CustomerStatus>("");

  const [createOpen, setCreateOpen] = useState(false);

  const [activationResult, setActivationResult] =
    useState<ActivationResult | null>(null);

  const [activationCustomer, setActivationCustomer] = useState("");

  const [statusCustomer, setStatusCustomer] = useState<Customer | null>(null);

  const [statusAction, setStatusAction] = useState<StatusAction | null>(null);

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return customers.filter((customer) => {
      if (status && customer.status !== status) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const businesses = customer.businesses
        .map((business) => business.name)
        .join(" ");

      return [customer.name, customer.email, businesses]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [customers, search, status]);

  const stats = useMemo(
    () => ({
      total: customers.length,

      active: customers.filter((customer) => customer.status === "ACTIVE")
        .length,

      pending: customers.filter((customer) => customer.status === "PENDING")
        .length,
    }),
    [customers]
  );

  const created = (result: CustomerCreationResult) => {
    setActivationCustomer(result.user.name);

    setActivationResult({
      activationUrl: result.activationUrl,

      activationExpiresAt: result.activationExpiresAt,
    });
  };

  const resendActivation = async (customer: Customer) => {
    try {
      const result = await resend.mutateAsync(customer.id);

      setActivationCustomer(customer.name);

      setActivationResult(result);

      toast.success("New activation link generated");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to resend activation"));
    }
  };

  const openStatusAction = (customer: Customer, action: StatusAction) => {
    setStatusCustomer(customer);

    setStatusAction(action);
  };

  return (
    <>
      <div className="space-y-7">
        {/* Heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Customer management
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
              Customers
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Create ValYou accounts, control customer access and manage
              account activation.
            </p>
          </div>

          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Add customer
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <CustomerStatCard
            title="Customers"
            value={stats.total}
            icon={UsersRound}
          />

          <CustomerStatCard
            title="Active"
            value={stats.active}
            icon={UserRoundCheck}
          />

          <CustomerStatCard
            title="Pending activation"
            value={stats.pending}
            icon={Clock3}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/70 p-3 shadow-sm md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email or business..."
              className="pl-9"
            />
          </div>

          <div className="md:w-52">
            <NativeSelect
              value={status}
              onChange={(event) =>
                setStatus(event.currentTarget.value as "" | CustomerStatus)
              }
            >
              <NativeSelectOption value="">All statuses</NativeSelectOption>

              <NativeSelectOption value="ACTIVE">Active</NativeSelectOption>

              <NativeSelectOption value="PENDING">
                Pending activation
              </NativeSelectOption>

              <NativeSelectOption value="DISABLED">Disabled</NativeSelectOption>
            </NativeSelect>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-sm">
          {isLoading ? (
            <CustomerTableSkeleton />
          ) : isError ? (
            <div className="flex min-h-72 items-center justify-center text-center">
              <div>
                <p className="font-medium">Unable to load customers</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Something went wrong while loading customer accounts.
                </p>

                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={() => refetch()}
                >
                  <RefreshCw className="size-4" />
                  Try again
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>

                    <TableHead>Status</TableHead>

                    <TableHead>Businesses</TableHead>

                    <TableHead>Subscription</TableHead>

                    <TableHead>Created</TableHead>

                    <TableHead className="w-14" />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-52 text-center">
                        <div>
                          <UsersRound className="mx-auto size-8 text-muted-foreground/50" />

                          <p className="mt-3 text-sm font-medium">
                            No customers found
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {search || status
                              ? "Try adjusting your filters."
                              : "Create your first ValYou customer."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <CustomerRow
                        key={customer.id}
                        customer={customer}
                        resendPending={resend.isPending}
                        onResend={() => resendActivation(customer)}
                        onDisable={() => openStatusAction(customer, "disable")}
                        onEnable={() => openStatusAction(customer, "enable")}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <CreateCustomerDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={created}
      />

      <ActivationLinkDialog
        result={activationResult}
        customerName={activationCustomer}
        open={Boolean(activationResult)}
        onOpenChange={(open) => {
          if (!open) {
            setActivationResult(null);

            setActivationCustomer("");
          }
        }}
      />

      <CustomerStatusDialog
        customer={statusCustomer}
        action={statusAction}
        open={Boolean(statusCustomer && statusAction)}
        onOpenChange={(open) => {
          if (!open) {
            setStatusCustomer(null);

            setStatusAction(null);
          }
        }}
      />
    </>
  );
}

function CustomerRow({
  customer,
  resendPending,
  onResend,
  onDisable,
  onEnable,
}: {
  customer: Customer;

  resendPending: boolean;

  onResend: () => void;

  onDisable: () => void;

  onEnable: () => void;
}) {
  const firstBusiness = customer.businesses[0];

  const subscription = firstBusiness?.subscriptions?.[0];

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            {customer.name.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <Link
              href={`/admin/customers/${customer.id}`}
              className="truncate font-medium transition hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              {customer.name}
            </Link>

            <p className="truncate text-xs text-muted-foreground">
              {customer.email}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <CustomerStatusBadge status={customer.status} />
      </TableCell>

      <TableCell>
        {customer.businesses.length === 0 ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          <div>
            <div className="flex items-center gap-1.5">
              <Building2 className="size-3.5 text-muted-foreground" />

              <span className="text-sm font-medium">{firstBusiness?.name}</span>
            </div>

            {customer.businesses.length > 1 && (
              <p className="mt-1 text-xs text-muted-foreground">
                +{customer.businesses.length - 1} more
              </p>
            )}
          </div>
        )}
      </TableCell>

      <TableCell>
        {!subscription ? (
          <span className="text-sm text-muted-foreground">No subscription</span>
        ) : (
          <div>
            <p className="text-sm font-medium">{subscription.plan}</p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              {subscription.status}
            </p>
          </div>
        )}
      </TableCell>

      <TableCell className="text-sm text-muted-foreground">
        {format(parseISO(customer.createdAt), "MMM d, yyyy")}
      </TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {customer.status === "PENDING" && (
                <DropdownMenuItem disabled={resendPending} onClick={onResend}>
                  <RefreshCw className="size-4" />
                  Generate new activation link
                </DropdownMenuItem>
              )}

              {customer.status === "ACTIVE" && (
                <DropdownMenuItem variant="destructive" onClick={onDisable}>
                  <PowerOff className="size-4" />
                  Disable customer
                </DropdownMenuItem>
              )}

              {customer.status === "DISABLED" && (
                <DropdownMenuItem onClick={onEnable}>
                  <Power className="size-4" />
                  Enable customer
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function CustomerTableSkeleton() {
  return (
    <div className="space-y-3 p-5">
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <Skeleton key={index} className="h-14 w-full" />
      ))}
    </div>
  );
}
