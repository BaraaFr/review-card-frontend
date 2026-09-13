"use client";

import {
  useState,
} from "react";

import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
} from "lucide-react";

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
  useChangePassword,
} from "@/hooks/account/use-profile";

/*
 * =========================================================
 * Component
 * =========================================================
 */

export function ChangePasswordForm({
  onCancel,
}: {
  onCancel?: () => void;
}) {
  const mutation =
    useChangePassword();

  const [
    currentPassword,
    setCurrentPassword,
  ] =
    useState(
      ""
    );

  const [
    newPassword,
    setNewPassword,
  ] =
    useState(
      ""
    );

  const [
    confirmPassword,
    setConfirmPassword,
  ] =
    useState(
      ""
    );

  const [
    showCurrent,
    setShowCurrent,
  ] =
    useState(
      false
    );

  const [
    showNew,
    setShowNew,
  ] =
    useState(
      false
    );

  const [
    showConfirm,
    setShowConfirm,
  ] =
    useState(
      false
    );

  const [
    success,
    setSuccess,
  ] =
    useState(
      false
    );

  /*
   * =======================================================
   * Validation
   * =======================================================
   */

  const newPasswordTooShort =
    newPassword.length >
      0 &&
    newPassword.length <
      8;

  const passwordsDoNotMatch =
    confirmPassword.length >
      0 &&
    newPassword !==
      confirmPassword;

  const samePassword =
    currentPassword.length >
      0 &&
    newPassword.length >
      0 &&
    currentPassword ===
      newPassword;

  const canSubmit =
    currentPassword.length >
      0 &&
    newPassword.length >=
      8 &&
    confirmPassword.length >
      0 &&
    newPassword ===
      confirmPassword &&
    currentPassword !==
      newPassword &&
    !mutation.isPending;

  /*
   * =======================================================
   * Submit
   * =======================================================
   */

  const handleSubmit =
    async (
      event:
        React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      if (
        !canSubmit
      ) {
        return;
      }

      setSuccess(
        false
      );

      try {
        await mutation.mutateAsync({
          currentPassword,

          newPassword,

          confirmPassword,
        });

        /*
         * Clear sensitive inputs immediately.
         */

        setCurrentPassword(
          ""
        );

        setNewPassword(
          ""
        );

        setConfirmPassword(
          ""
        );

        setSuccess(
          true
        );
      } catch (
        error
      ) {
        console.error(
          "Failed to change password:",
          error
        );
      }
    };

  /*
   * =======================================================
   * Error message
   * =======================================================
   */

  let serverError =
    "We couldn't change your password. Please try again.";

  const apiError =
    mutation.error as
      | {
          response?: {
            data?: {
              message?:
                string;

              code?:
                string;
            };
          };
        }
      | null;

  if (
    apiError?.response
      ?.data
      ?.message
  ) {
    serverError =
      apiError.response.data.message;
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-5"
    >
      {/* =================================================
          Current password
      ================================================= */}

      <div className="space-y-2">
        <Label
          htmlFor="current-password"
        >
          Current password
        </Label>

        <div className="relative">
          <LockKeyhole
            className="
              absolute
              left-3
              top-1/2
              size-4
              -translate-y-1/2
              text-muted-foreground
            "
          />

          <Input
            id="current-password"
            type={
              showCurrent
                ? "text"
                : "password"
            }
            value={
              currentPassword
            }
            onChange={
              (
                event
              ) => {
                setCurrentPassword(
                  event.target.value
                );

                setSuccess(
                  false
                );

                mutation.reset();
              }
            }
            autoComplete="current-password"
            className="pl-9 pr-10"
            placeholder="Enter current password"
          />

          <button
            type="button"
            onClick={
              () =>
                setShowCurrent(
                  (
                    current
                  ) =>
                    !current
                )
            }
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-muted-foreground
              transition-colors
              hover:text-foreground
            "
            aria-label={
              showCurrent
                ? "Hide password"
                : "Show password"
            }
          >
            {showCurrent ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* =================================================
          New password
      ================================================= */}

      <div className="space-y-2">
        <Label
          htmlFor="new-password"
        >
          New password
        </Label>

        <div className="relative">
          <LockKeyhole
            className="
              absolute
              left-3
              top-1/2
              size-4
              -translate-y-1/2
              text-muted-foreground
            "
          />

          <Input
            id="new-password"
            type={
              showNew
                ? "text"
                : "password"
            }
            value={
              newPassword
            }
            onChange={
              (
                event
              ) => {
                setNewPassword(
                  event.target.value
                );

                setSuccess(
                  false
                );

                mutation.reset();
              }
            }
            autoComplete="new-password"
            className="pl-9 pr-10"
            placeholder="At least 8 characters"
          />

          <button
            type="button"
            onClick={
              () =>
                setShowNew(
                  (
                    current
                  ) =>
                    !current
                )
            }
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-muted-foreground
              transition-colors
              hover:text-foreground
            "
            aria-label={
              showNew
                ? "Hide password"
                : "Show password"
            }
          >
            {showNew ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

        {newPasswordTooShort && (
          <p className="text-xs text-destructive">
            Password must contain at least 8 characters.
          </p>
        )}

        {samePassword && (
          <p className="text-xs text-destructive">
            Your new password must be different from your current password.
          </p>
        )}
      </div>

      {/* =================================================
          Confirm password
      ================================================= */}

      <div className="space-y-2">
        <Label
          htmlFor="confirm-password"
        >
          Confirm new password
        </Label>

        <div className="relative">
          <LockKeyhole
            className="
              absolute
              left-3
              top-1/2
              size-4
              -translate-y-1/2
              text-muted-foreground
            "
          />

          <Input
            id="confirm-password"
            type={
              showConfirm
                ? "text"
                : "password"
            }
            value={
              confirmPassword
            }
            onChange={
              (
                event
              ) => {
                setConfirmPassword(
                  event.target.value
                );

                setSuccess(
                  false
                );

                mutation.reset();
              }
            }
            autoComplete="new-password"
            className="pl-9 pr-10"
            placeholder="Repeat new password"
          />

          <button
            type="button"
            onClick={
              () =>
                setShowConfirm(
                  (
                    current
                  ) =>
                    !current
                )
            }
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-muted-foreground
              transition-colors
              hover:text-foreground
            "
            aria-label={
              showConfirm
                ? "Hide password"
                : "Show password"
            }
          >
            {showConfirm ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

        {passwordsDoNotMatch && (
          <p className="text-xs text-destructive">
            Passwords do not match.
          </p>
        )}
      </div>

      {/* =================================================
          Server error
      ================================================= */}

      {mutation.isError && (
        <div
          className="
            rounded-lg
            border
            border-destructive/20
            bg-destructive/5
            px-4
            py-3
            text-sm
            text-destructive
          "
        >
          {serverError}
        </div>
      )}

      {/* =================================================
          Success
      ================================================= */}

      {success && (
        <div
          className="
            flex
            items-center
            gap-2
            rounded-lg
            border
            border-emerald-200
            bg-emerald-50
            px-4
            py-3
            text-sm
            text-emerald-700

            dark:border-emerald-900/50
            dark:bg-emerald-950/20
            dark:text-emerald-400
          "
        >
          <Check className="size-4" />

          Password changed successfully.
        </div>
      )}

      {/* =================================================
          Actions
      ================================================= */}

      <div
        className="
          flex
          items-center
          justify-end
          gap-2
          border-t
          border-border/60
          pt-5
        "
      >
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={
              onCancel
            }
            disabled={
              mutation.isPending
            }
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          disabled={
            !canSubmit
          }
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />

              Updating...
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </div>
    </form>
  );
}