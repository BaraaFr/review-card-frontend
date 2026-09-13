"use client";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  ExternalLink,
  Loader2,
  MapPin,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  z,
} from "zod";

import {
  useCreateStore,
} from "@/hooks/stores/use-store";

import {
  getApiErrorMessage,
} from "@/lib/api-error";

import {
  Button,
} from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

const schema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Location name is required"
      ),

    address: z
      .string()
      .optional(),

    googleReviewUrl: z
      .string()
      .url(
        "Enter a valid Google Review URL"
      ),
  });

type Values =
  z.infer<typeof schema>;

type Props = {
  businessId: string;

  businessName: string;

  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;
};

export function AddLocationDialog({
  businessId,
  businessName,
  open,
  onOpenChange,
}: Props) {
  const createStore =
    useCreateStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } =
    useForm<Values>({
      resolver:
        zodResolver(
          schema
        ),

      defaultValues: {
        name: "",
        address: "",
        googleReviewUrl:
          "",
      },
    });

  const submit =
    async (
      values: Values
    ) => {
      try {
        await createStore
          .mutateAsync({
            businessId,

            payload: {
              name:
                values.name,

              address:
                values.address ||
                null,

              googleReviewUrl:
                values.googleReviewUrl,
            },
          });

        toast.success(
          "Location added"
        );

        reset();

        onOpenChange(
          false
        );
      } catch (error) {
        toast.error(
          getApiErrorMessage(
            error,
            "Unable to add location"
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
            Add location
          </DialogTitle>

          <DialogDescription>
            Add another location
            to {businessName}.
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
            <Label htmlFor="location-name">
              Location name
            </Label>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="location-name"
                className="pl-9"
                placeholder="Jounieh Branch"
                {...register(
                  "name"
                )}
              />
            </div>

            {errors.name && (
              <p className="text-xs text-destructive">
                {
                  errors.name
                    .message
                }
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location-address">
              Address
            </Label>

            <Input
              id="location-address"
              placeholder="Jounieh, Lebanon"
              {...register(
                "address"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location-review-url">
              Google Review URL
            </Label>

            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="location-review-url"
                className="pl-9"
                placeholder="https://g.page/r/..."
                {...register(
                  "googleReviewUrl"
                )}
              />
            </div>

            {errors.googleReviewUrl && (
              <p className="text-xs text-destructive">
                {
                  errors
                    .googleReviewUrl
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
                createStore
                  .isPending
              }
            >
              {createStore
                .isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}

              Add location
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}