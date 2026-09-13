"use client";

import {
  create,
} from "zustand";

import {
  createJSONStorage,
  persist,
} from "zustand/middleware";

type BusinessState = {
  businessId:
    | string
    | null;

  hasHydrated:
    boolean;

  setBusinessId: (
    businessId:
      | string
      | null
  ) => void;

  clearBusinessId:
    () => void;

  setHasHydrated: (
    value: boolean
  ) => void;
};

export const useBusinessStore =
  create<BusinessState>()(
    persist(
      (set) => ({
        businessId:
          null,

        hasHydrated:
          false,

        setBusinessId:
          (
            businessId
          ) =>
            set({
              businessId,
            }),

        clearBusinessId:
          () =>
            set({
              businessId:
                null,
            }),

        setHasHydrated:
          (
            value
          ) =>
            set({
              hasHydrated:
                value,
            }),
      }),

      {
        name:
          "valyou-selected-business",

        storage:
          createJSONStorage(
            () =>
              localStorage
          ),

        /*
         * Only persist the business ID.
         */
        partialize:
          (
            state
          ) => ({
            businessId:
              state.businessId,
          }),

        /*
         * Tells us when Zustand has
         * finished restoring localStorage.
         */
        onRehydrateStorage:
          () =>
          (
            state
          ) => {
            state?.setHasHydrated(
              true
            );
          },
      }
    )
  );