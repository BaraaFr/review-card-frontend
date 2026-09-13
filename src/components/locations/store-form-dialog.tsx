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
  Link2,
  Loader2,
  MapPin,
  Store as StoreIcon,
} from "lucide-react";

import {
  toast,
} from "sonner";

import type {
  Store,
} from "@/types/business";

import {
  storeFormSchema,
  type StoreFormValues,
} from "@/lib/validations/store";

import {
  useCreateStore,
  useUpdateStore,
} from "@/hooks/stores/use-store";

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

type Props = {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  businessId: string;

  store?: Store | null;
};

export function StoreFormDialog({
  open,
  onOpenChange,
  businessId,
  store,
}: Props) {
  const createStore =
    useCreateStore();

  const updateStore =
    useUpdateStore();

  const editing =
    Boolean(store);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } =
    useForm<StoreFormValues>({
      resolver:
        zodResolver(
          storeFormSchema
        ),

      defaultValues: {
        name: "",
        address: "",
        googleReviewUrl:
          "",
      },
    });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      name:
        store?.name ??
        "",

      address:
        store?.address ??
        "",

      googleReviewUrl:
        store
          ?.googleReviewUrl ??
        "",
    });
  }, [
    open,
    store,
    reset,
  ]);

  const pending =
    createStore.isPending ||
    updateStore.isPending;

  const onSubmit = async (
    values: StoreFormValues
  ) => {
    try {
      const payload = {
        name:
          values.name,

        address:
          values.address ||
          null,

        googleReviewUrl:
          values.googleReviewUrl ||
          null,
      };

      if (store) {
        await updateStore
          .mutateAsync({
            storeId:
              store.id,

            payload,
          });

        toast.success(
          "Location updated"
        );
      } else {
        await createStore
          .mutateAsync({
            businessId,
            payload,
          });

        toast.success(
          "Location created"
        );
      }

      onOpenChange(false);
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          editing
            ? "Unable to update location"
            : "Unable to create location"
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editing
              ? "Edit location"
              : "Add location"}
          </DialogTitle>

          <DialogDescription>
            Add the branch details
            and its Google Review
            destination.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-5"
          onSubmit={
            handleSubmit(
              onSubmit
            )
          }
        >
          <FormField
            label="Location name"
            id="location-name"
            error={
              errors.name
                ?.message
            }
            icon={
              <StoreIcon className="size-4" />
            }
          >
            <Input
              id="location-name"
              className="pl-9"
              placeholder="Hamra Branch"
              {...register(
                "name"
              )}
            />
          </FormField>

          <FormField
            label="Address"
            id="location-address"
            error={
              errors.address
                ?.message
            }
            icon={
              <MapPin className="size-4" />
            }
          >
            <Input
              id="location-address"
              className="pl-9"
              placeholder="Hamra, Beirut"
              {...register(
                "address"
              )}
            />
          </FormField>

          <FormField
            label="Google Review URL"
            id="review-url"
            error={
              errors
                .googleReviewUrl
                ?.message
            }
            icon={
              <Link2 className="size-4" />
            }
          >
            <Input
              id="review-url"
              className="pl-9"
              placeholder="https://g.page/r/..."
              {...register(
                "googleReviewUrl"
              )}
            />
          </FormField>

          <div className="rounded-xl border border-border/60 bg-muted/40 p-3 text-xs leading-5 text-muted-foreground">
            Cards assigned to this
            location will redirect
            customers to this Google
            Review URL.
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
              disabled={pending}
            >
              {pending && (
                <Loader2 className="size-4 animate-spin" />
              )}

              {editing
                ? "Save changes"
                : "Add location"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  label,
  id,
  error,
  icon,
  children,
}: {
  label: string;

  id: string;

  error?: string;

  icon: React.ReactNode;

  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
      </Label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>

        {children}
      </div>

      {error && (
        <p className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}