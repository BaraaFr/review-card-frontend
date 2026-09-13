"use client";

import {
  useEffect,
} from "react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  Loader2,
} from "lucide-react";

import {
  z,
} from "zod";

import {
  toast,
} from "sonner";

import type {
  ReviewCard,
} from "@/types/card";

import {
  useUpdateCard,
} from "@/hooks/cards/use-card";

import {
  getApiErrorMessage,
} from "@/lib/api-error";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const schema =
  z.object({
    label: z
      .string()
      .trim()
      .min(
        1,
        "Enter a label"
      )
      .max(100),
  });

type FormValues =
  z.infer<
    typeof schema
  >;

export function EditCardDialog({
  card,
  open,
  onOpenChange,
}: {
  card:
    | ReviewCard
    | null;

  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;
}) {
  const update =
    useUpdateCard();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } =
    useForm<FormValues>({
      resolver:
        zodResolver(
          schema
        ),
    });

  useEffect(() => {
    if (
      open &&
      card
    ) {
      reset({
        label:
          card.label ??
          "",
      });
    }
  }, [
    open,
    card,
    reset,
  ]);

  if (!card) {
    return null;
  }

  const submit = async (
    values: FormValues
  ) => {
    try {
      await update
        .mutateAsync({
          cardId:
            card.id,

          label:
            values.label,
        });

      toast.success(
        "Card updated"
      );

      onOpenChange(
        false
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to update card"
        )
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Rename card
          </DialogTitle>

          <DialogDescription>
            Use a meaningful
            placement name such as
            Cashier, Entrance or
            Table Area.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={
            handleSubmit(
              submit
            )
          }
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="card-label">
              Card label
            </Label>

            <Input
              id="card-label"
              placeholder="Cashier"
              {...register(
                "label"
              )}
            />

            {errors.label && (
              <p className="text-xs text-destructive">
                {
                  errors.label
                    .message
                }
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(
                  false
                )
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                update.isPending
              }
            >
              {update.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}

              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}