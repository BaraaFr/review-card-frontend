"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  format,
  parseISO,
} from "date-fns";

import {
  CalendarClock,
  Loader2,
  Mail,
  Phone,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  getApiErrorMessage,
} from "@/lib/api-error";

import {
  useUpdateRenewalFollowUp,
} from "@/hooks/admin/subscriptions/use-renewal-follow-up";

import type {
  AdminSubscriptionRecord,
  RenewalFollowUpStatus,
} from "@/types/admin-subscription";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  Textarea,
} from "@/components/ui/textarea";

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
  record:
    AdminSubscriptionRecord | null;

  onOpenChange:
    (open: boolean) => void;
};

export function RenewalFollowUpDialog({
  record,
  onOpenChange,
}: Props) {
  const mutation =
    useUpdateRenewalFollowUp();

  const [status, setStatus] =
    useState<RenewalFollowUpStatus>(
      "CONTACTED"
    );

  const [note, setNote] =
    useState("");

  const [
    nextFollowUpDate,
    setNextFollowUpDate,
  ] = useState("");

  const open =
    Boolean(record);

  /*
   * Initialize from the saved
   * follow-up whenever a different
   * business or period is selected.
   */

  useEffect(() => {
    if (!record) {
      return;
    }

    setStatus(
      record.renewalFollowUp
        ?.status ??
        "CONTACTED"
    );

    setNote(
      record.renewalFollowUp
        ?.note ??
        ""
    );

    setNextFollowUpDate(
      record.renewalFollowUp
        ?.nextFollowUpAt
        ? format(
            parseISO(
              record.renewalFollowUp.nextFollowUpAt
            ),

            "yyyy-MM-dd"
          )
        : ""
    );
  }, [record]);

  async function save() {
    if (
      !record?.subscription?.expiresAt ||
      mutation.isPending
    ) {
      return;
    }

    try {
      await mutation.mutateAsync({
        subscriptionId:
          record.subscription.id,

        payload: {
          expiresAt:
            record.subscription.expiresAt,

          status,

          note:
            note.trim() ||
            null,

          /*
           * Convert the selected local
           * calendar date to noon in
           * the browser's timezone.
           *
           * This avoids accidentally
           * displaying the previous day
           * after UTC conversion.
           */
          nextFollowUpAt:
            nextFollowUpDate
              ? new Date(
                  `${nextFollowUpDate}T12:00:00`
                ).toISOString()
              : null,
        },
      });

      toast.success(
        "Renewal follow-up saved"
      );

      onOpenChange(
        false
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,

          "Unable to save follow-up"
        )
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Renewal follow-up
          </DialogTitle>

          <DialogDescription>
            Track the renewal conversation
            without changing subscription
            access or recording payment.
          </DialogDescription>
        </DialogHeader>

        {record && (
          <div className="space-y-6">

            {/* Business */}

            <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] p-4">
              <p className="font-semibold">
                {record.business.name}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {record.customer.name}
              </p>

              {record.subscription?.expiresAt && (
                <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarClock className="size-4" />

                  Renewal date:{" "}

                  {format(
                    parseISO(
                      record.subscription.expiresAt
                    ),

                    "MMM d, yyyy"
                  )}
                </p>
              )}
            </div>

            {/* Contact */}

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                nativeButton={false}
                render={
                  <a
                    href={`mailto:${record.customer.email}`}
                  />
                }
              >
                <Mail className="size-4" />

                Email
              </Button>

              {record.customer.phoneNumber && (
                <Button
                  type="button"
                  variant="outline"
                  nativeButton={false}
                  render={
                    <a
                      href={`tel:${record.customer.phoneNumber}`}
                    />
                  }
                >
                  <Phone className="size-4" />

                  Call
                </Button>
              )}
            </div>

            {/* Status */}

            <div className="space-y-2">
              <Label htmlFor="renewal-status">
                Follow-up status
              </Label>

              <NativeSelect
                id="renewal-status"
                value={status}
                disabled={
                  mutation.isPending
                }
                onChange={(event) =>
                  setStatus(
                    event.currentTarget.value as
                      RenewalFollowUpStatus
                  )
                }
              >
                <NativeSelectOption value="CONTACTED">
                  Contacted / awaiting response
                </NativeSelectOption>

                <NativeSelectOption value="INTERESTED">
                  Interested in renewal
                </NativeSelectOption>

                <NativeSelectOption value="DECLINED">
                  Declined renewal
                </NativeSelectOption>
              </NativeSelect>
            </div>

            {/* Next contact */}

            <div className="space-y-2">
              <Label htmlFor="next-renewal-contact">
                Next follow-up date
              </Label>

              <Input
                id="next-renewal-contact"
                type="date"
                value={
                  nextFollowUpDate
                }
                disabled={
                  mutation.isPending
                }
                onChange={(event) =>
                  setNextFollowUpDate(
                    event.target.value
                  )
                }
              />

              <p className="text-xs text-muted-foreground">
                Leave empty when no further
                contact is scheduled.
              </p>
            </div>

            {/* Note */}

            <div className="space-y-2">
              <Label htmlFor="renewal-note">
                Conversation notes
              </Label>

              <Textarea
                id="renewal-note"
                value={note}
                maxLength={1000}
                disabled={
                  mutation.isPending
                }
                placeholder="Example: Customer wants to renew the Pro plan. Call next Tuesday to arrange payment."
                className="min-h-28 resize-y"
                onChange={(event) =>
                  setNote(
                    event.target.value
                  )
                }
              />

              <p className="text-right text-xs text-muted-foreground">
                {note.length}/1000
              </p>
            </div>

            {record.renewalFollowUp?.contactedAt && (
              <p className="text-xs text-muted-foreground">
                First recorded contact:{" "}

                {format(
                  parseISO(
                    record.renewalFollowUp.contactedAt
                  ),

                  "MMM d, yyyy"
                )}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={
                  mutation.isPending
                }
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
                disabled={
                  mutation.isPending
                }
                onClick={() =>
                  void save()
                }
              >
                {mutation.isPending && (
                  <Loader2 className="size-4 animate-spin" />
                )}

                Save follow-up
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}