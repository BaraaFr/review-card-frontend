import { z } from "zod";

export const businessFormSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Business name must be at least 2 characters"
      )
      .max(150),

    logoUrl: z
      .union([
        z.literal(""),
        z
          .string()
          .url(
            "Enter a valid logo URL"
          ),
      ])
      .optional(),
  });

export type BusinessFormValues =
  z.infer<
    typeof businessFormSchema
  >;