import {
  z,
} from "zod";

/*
 * =========================================================
 * Login
 * =========================================================
 */

export const loginSchema =
  z.object({
    email: z
      .string()
      .trim()
      .email(
        "Enter a valid email"
      ),

    password: z
      .string()
      .min(
        1,
        "Password is required"
      ),
  });

/*
 * =========================================================
 * Register
 * =========================================================
 */

export const registerSchema =
  z
    .object({
      name: z
        .string()
        .trim()
        .min(
          2,
          "Name must be at least 2 characters"
        ),

      email: z
        .string()
        .trim()
        .email(
          "Enter a valid email"
        ),

      password: z
        .string()
        .min(
          8,
          "Password must be at least 8 characters"
        ),

      confirmPassword:
        z.string(),
    })
    .refine(
      (data) =>
        data.password ===
        data.confirmPassword,
      {
        message:
          "Passwords do not match",

        path: [
          "confirmPassword",
        ],
      }
    );

/*
 * =========================================================
 * Forgot password
 * =========================================================
 */

export const forgotPasswordSchema =
  z.object({
    email: z
      .string()
      .trim()
      .email(
        "Enter a valid email"
      ),
  });

/*
 * =========================================================
 * Reset password
 * =========================================================
 */

export const resetPasswordSchema =
  z
    .object({
      password: z
        .string()
        .min(
          8,
          "Password must be at least 8 characters"
        )
        .max(
          72,
          "Password must not exceed 72 characters"
        ),

      confirmPassword: z
        .string()
        .min(
          1,
          "Please confirm your password"
        ),
    })
    .refine(
      (data) =>
        data.password ===
        data.confirmPassword,
      {
        message:
          "Passwords do not match",

        path: [
          "confirmPassword",
        ],
      }
    );

/*
 * =========================================================
 * Types
 * =========================================================
 */

export type LoginFormValues =
  z.infer<
    typeof loginSchema
  >;

export type RegisterFormValues =
  z.infer<
    typeof registerSchema
  >;

export type ForgotPasswordFormValues =
  z.infer<
    typeof forgotPasswordSchema
  >;

export type ResetPasswordFormValues =
  z.infer<
    typeof resetPasswordSchema
  >;