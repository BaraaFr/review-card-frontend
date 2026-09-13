import {
  z,
} from "zod";

export const createCustomerFormSchema =
  z
    .object({
      name: z
        .string()
        .trim()
        .min(
          2,
          "Customer name is required"
        )
        .max(100),

      email: z
        .string()
        .trim()
        .email(
          "Enter a valid email"
        ),

      businessName: z
        .string()
        .trim()
        .min(
          2,
          "Business name is required"
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

      subscriptionMode:
        z.enum([
          "TRIAL",
          "ACTIVE",
          "NONE",
        ]),

      plan: z.enum([
        "STARTER",
        "PRO",
        "BUSINESS",
      ]),

      trialDays: z.coerce
        .number()
        .int()
        .min(1)
        .max(90),

      expiresAt: z
        .string()
        .optional(),
    });

export type CreateCustomerFormValues =
  z.infer<
    typeof createCustomerFormSchema
  >;

  export const additionalBusinessFormSchema =
  z.object({
    /*
     * Business
     */
    name: z
      .string()
      .trim()
      .min(
        2,
        "Business name is required"
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

    /*
     * First location
     */
    locationName: z
      .string()
      .trim()
      .min(
        2,
        "Location name is required"
      )
      .max(150),

    address: z
      .string()
      .trim()
      .max(255)
      .optional(),

    googleReviewUrl: z
      .string()
      .trim()
      .url(
        "Enter a valid Google review URL"
      ),

    /*
     * Subscription
     */
    subscriptionMode:
      z.enum([
        "TRIAL",
        "ACTIVE",
        "NONE",
      ]),

    plan: z.enum([
      "STARTER",
      "PRO",
      "BUSINESS",
    ]),

    trialDays: z.coerce
      .number()
      .int()
      .min(1)
      .max(90),

    expiresAt: z
      .string()
      .optional(),
  });

export type AdditionalBusinessFormValues =
  z.infer<
    typeof additionalBusinessFormSchema
  >;