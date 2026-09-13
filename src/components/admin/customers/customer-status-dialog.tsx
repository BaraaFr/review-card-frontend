"use client";

import {
  Loader2,
  Power,
  PowerOff,
} from "lucide-react";

import {
  toast,
} from "sonner";

import type {
  Customer,
} from "@/types/customer";

import {
  useDisableCustomer,
  useEnableCustomer,
} from "@/hooks/admin/customers/use-customers";

import {
  getApiErrorMessage,
} from "@/lib/api-error";

import {
  Button,
} from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Action =
  | "enable"
  | "disable";

type Props = {
  customer:
    | Customer
    | null;

  action:
    | Action
    | null;

  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;
};

export function CustomerStatusDialog({
  customer,
  action,
  open,
  onOpenChange,
}: Props) {
  const disable =
    useDisableCustomer();

  const enable =
    useEnableCustomer();

  if (
    !customer ||
    !action
  ) {
    return null;
  }

  const pending =
    disable.isPending ||
    enable.isPending;

  const submit =
    async () => {
      try {
        if (
          action ===
          "disable"
        ) {
          await disable
            .mutateAsync(
              customer.id
            );

          toast.success(
            "Customer disabled"
          );
        } else {
          await enable
            .mutateAsync(
              customer.id
            );

          toast.success(
            "Customer enabled"
          );
        }

        onOpenChange(false);
      } catch (error) {
        toast.error(
          getApiErrorMessage(
            error,
            `Unable to ${action} customer`
          )
        );
      }
    };

  return (
    <AlertDialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {action ===
            "disable"
              ? `Disable ${customer.name}?`
              : `Enable ${customer.name}?`}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {action ===
            "disable"
              ? "The customer will immediately lose access to protected ValYou pages, including sessions that are already logged in."
              : customer.status ===
                  "DISABLED"
                ? "The customer's account will become available again. If they never activated it, the account will return to Pending status."
                : "Enable this customer account."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() =>
              onOpenChange(
                false
              )
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant={
              action ===
              "disable"
                ? "destructive"
                : "default"
            }
            disabled={pending}
            onClick={
              submit
            }
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : action ===
              "disable" ? (
              <PowerOff className="size-4" />
            ) : (
              <Power className="size-4" />
            )}

            {action ===
            "disable"
              ? "Disable customer"
              : "Enable customer"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}