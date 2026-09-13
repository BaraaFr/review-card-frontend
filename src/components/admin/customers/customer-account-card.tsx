import {
    CalendarDays,
    Mail,
    UserRound,
  } from "lucide-react";
  
  import {
    format,
    parseISO,
  } from "date-fns";
  
  import type {
    CustomerDetail,
  } from "@/types/customer";
  
  import {
    CustomerStatusBadge,
  } from "./customer-status-badge";
  
  export function CustomerAccountCard({
    customer,
  }: {
    customer:
      CustomerDetail;
  }) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold">
            Account
          </h3>
  
          <CustomerStatusBadge
            status={
              customer.status
            }
          />
        </div>
  
        <div className="mt-6 space-y-4">
          <AccountRow
            icon={UserRound}
            label="Customer"
            value={
              customer.name
            }
          />
  
          <AccountRow
            icon={Mail}
            label="Email"
            value={
              customer.email
            }
          />
  
          <AccountRow
            icon={
              CalendarDays
            }
            label="Customer since"
            value={format(
              parseISO(
                customer.createdAt
              ),
              "MMM d, yyyy"
            )}
          />
        </div>
      </div>
    );
  }
  
  function AccountRow({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
  
    label: string;
  
    value: string;
  }) {
    return (
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted">
          <Icon className="size-4 text-muted-foreground" />
        </div>
  
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">
            {label}
          </p>
  
          <p className="mt-0.5 break-all text-sm font-medium">
            {value}
          </p>
        </div>
      </div>
    );
  }