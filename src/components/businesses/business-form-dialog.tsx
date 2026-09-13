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
  Building2,
  Image,
  Loader2,
} from "lucide-react";

import {
  toast,
} from "sonner";

import type {
  Business,
} from "@/types/business";

import {
  businessFormSchema,
  type BusinessFormValues,
} from "@/lib/validations/business";

import {
  useCreateBusiness,
  useUpdateBusiness,
} from "@/hooks/business/use-businesses";

import {
  useBusinessStore,
} from "@/stores/business.store";

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

  business?: Business | null;
};

export function BusinessFormDialog({
  open,
  onOpenChange,
  business,
}: Props) {
  const createBusiness =
    useCreateBusiness();

  const updateBusiness =
    useUpdateBusiness();

  const {
    setBusinessId,
  } =
    useBusinessStore();

  const editing =
    Boolean(business);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } =
    useForm<BusinessFormValues>({
      resolver:
        zodResolver(
          businessFormSchema
        ),

      defaultValues: {
        name: "",
        logoUrl: "",
      },
    });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      name:
        business?.name ??
        "",

      logoUrl:
        business?.logoUrl ??
        "",
    });
  }, [
    open,
    business,
    reset,
  ]);

  const pending =
    createBusiness.isPending ||
    updateBusiness.isPending;

  const onSubmit = async (
    values: BusinessFormValues
  ) => {
    try {
      if (business) {
        await updateBusiness
          .mutateAsync({
            businessId:
              business.id,

            payload: {
              name:
                values.name,

              logoUrl:
                values.logoUrl ||
                null,
            },
          });

        toast.success(
          "Business updated"
        );
      } else {
        const created =
          await createBusiness
            .mutateAsync({
              name:
                values.name,

              logoUrl:
                values.logoUrl ||
                null,
            });

        setBusinessId(
          created.id
        );

        toast.success(
          "Business created"
        );
      }

      onOpenChange(false);
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          editing
            ? "Unable to update business"
            : "Unable to create business"
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
              ? "Edit business"
              : "Create business"}
          </DialogTitle>

          <DialogDescription>
            {editing
              ? "Update your business information."
              : "Create a workspace for your business and locations."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={
            handleSubmit(
              onSubmit
            )
          }
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="business-name">
              Business name
            </Label>

            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="business-name"
                placeholder="Burger House"
                className="pl-9"
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
            <Label htmlFor="logo-url">
              Logo URL
              <span className="ml-1 text-muted-foreground">
                optional
              </span>
            </Label>

            <div className="relative">
              <Image className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="logo-url"
                placeholder="https://..."
                className="pl-9"
                {...register(
                  "logoUrl"
                )}
              />
            </div>

            {errors.logoUrl && (
              <p className="text-xs text-destructive">
                {
                  errors.logoUrl
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
              disabled={pending}
            >
              {pending && (
                <Loader2 className="size-4 animate-spin" />
              )}

              {editing
                ? "Save changes"
                : "Create business"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}