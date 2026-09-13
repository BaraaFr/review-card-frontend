import {
    z,
  } from "zod";
  
  export const manageSubscriptionSchema =
    z.object({
      plan: z.enum([
        "STARTER",
        "PRO",
        "BUSINESS",
      ]),
  
      status: z.enum([
        "TRIAL",
        "ACTIVE",
        "PAST_DUE",
        "CANCELED",
        "EXPIRED",
      ]),
  
      startsAt: z
        .string()
        .min(
          1,
          "Start date is required"
        ),
  
      expiresAt: z
        .string()
        .optional(),
    });
  
  export type ManageSubscriptionFormValues =
    z.infer<
      typeof manageSubscriptionSchema
    >;