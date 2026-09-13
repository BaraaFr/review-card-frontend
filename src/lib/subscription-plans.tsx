import type {
    SubscriptionPlan,
  } from "@/types/subscription";
  
  export type PlanDefinition = {
    id: SubscriptionPlan;
  
    name: string;
  
    description: string;
  
    stores: number;
  
    cards: number;
  
    recommended?: boolean;
  };
  
  export const SUBSCRIPTION_PLANS: PlanDefinition[] =
    [
      {
        id: "STARTER",
  
        name: "Starter",
  
        description:
          "For a single location getting started with smart review cards.",
  
        stores: 1,
  
        cards: 2,
      },
  
      {
        id: "PRO",
  
        name: "Pro",
  
        description:
          "For growing businesses with multiple locations and more card placements.",
  
        stores: 3,
  
        cards: 10,
  
        recommended: true,
      },
  
      {
        id: "BUSINESS",
  
        name: "Business",
  
        description:
          "For established brands managing larger location and card networks.",
  
        stores: 10,
  
        cards: 50,
      },
    ];