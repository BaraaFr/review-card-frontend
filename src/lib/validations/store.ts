import { z } from "zod";

export const storeFormSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Location name must be at least 2 characters"
      )
      .max(150),

    address: z
      .string()
      .trim()
      .max(500)
      .optional(),

    googleReviewUrl: z
      .union([
        z.literal(""),
        z
          .string()
          .url(
            "Enter a valid Google Review URL"
          ),
      ])
      .optional(),
  });

export type StoreFormValues =
  z.infer<
    typeof storeFormSchema
  >;