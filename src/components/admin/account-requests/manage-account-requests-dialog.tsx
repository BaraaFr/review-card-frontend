"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Mail,
  Building2,
  Phone,
  Save,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  useUpdateAccountRequest,
} from "@/hooks/account-requests/use-update-account-request";

import type {
  AccountRequest,
  AccountRequestStatus,
} from "@/types/account-request";

const statuses: AccountRequestStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "CLOSED",
];

type Props = {
  request: AccountRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ManageAccountRequestDialog({
  request,
  open,
  onOpenChange,
}: Props) {
  const mutation = useUpdateAccountRequest();

  const [status, setStatus] =
    useState<AccountRequestStatus>("NEW");

  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    if (!request) {
      return;
    }

    setStatus(request.status);
    setAdminNote(request.adminNote ?? "");
  }, [request]);

  if (!request) {
    return null;
  }

  async function handleSave() {
    try {
      await mutation.mutateAsync({
        requestId: request!.id,
        status,
        adminNote: adminNote.trim() || null,
      });

      toast.success("Request updated.");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Unable to update request."
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (mutation.isPending) {
          return;
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Manage request</DialogTitle>

          <DialogDescription>
            Review the business request, contact the owner and
            update its onboarding status.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-2xl border bg-muted/20 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">
                  {request.shopName}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {request.ownerName}
                </p>
              </div>

              <Badge variant="secondary">
                {request.requestedCards} cards requested
              </Badge>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a
                href={`tel:${request.phone}`}
                className="flex items-center gap-3 rounded-xl border bg-background p-3 text-sm transition-colors hover:bg-muted"
              >
                <Phone className="size-4 text-emerald-600" />
                {request.phone}
              </a>

              {request.email ? (
                <a
                  href={`mailto:${request.email}`}
                  className="flex min-w-0 items-center gap-3 rounded-xl border bg-background p-3 text-sm hover:bg-muted"
                >
                  <Mail className="size-4 shrink-0 text-emerald-600" />

                  <span className="break-all">
                    {request.email}
                  </span>
                </a>
              ) : (
                <p className="rounded-xl border bg-background p-3 text-sm text-muted-foreground">
                  Email not provided
                </p>
              )}

              <div className="flex items-center gap-3 rounded-xl border bg-background p-3 text-sm">
                <Building2 className="size-4 text-muted-foreground" />

                {request.businessType ??
                  "Business type not provided"}
              </div>
            </div>

            {request.message && (
              <div className="mt-4 rounded-xl border bg-background p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Customer message
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                  {request.message}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as AccountRequestStatus
                )
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            >
              {statuses.map((value) => (
                <option key={value} value={value}>
                  {formatStatus(value)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Admin notes
            </label>

            <Textarea
              value={adminNote}
              onChange={(event) =>
                setAdminNote(event.target.value)
              }
              rows={5}
              placeholder="Call outcome, pricing discussion, onboarding details..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={mutation.isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={mutation.isPending}
            onClick={handleSave}
          >
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}

            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatStatus(status: AccountRequestStatus) {
  return status
    .toLowerCase()
    .replace("_", " ")
    .replace(
      /^\w/,
      (character) => character.toUpperCase()
    );
}