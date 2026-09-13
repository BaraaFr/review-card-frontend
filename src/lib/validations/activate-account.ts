import { z } from "zod";

export const activateAccountSchema = z
  .object({
    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters"
      ),

    confirmPassword: z
      .string()
      .min(
        8,
        "Please confirm your password"
      ),
  })
  .refine(
    (values) =>
      values.password ===
      values.confirmPassword,
    {
      path: ["confirmPassword"],
      message:
        "Passwords do not match",
    }
  );

export type ActivateAccountFormValues =
  z.infer<
    typeof activateAccountSchema
  >;