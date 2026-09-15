"use client";

import {
  useEffect,
} from "react";

import {
  supportService,
} from "@/services/support.service";
declare global {
  interface Window {
    Tawk_API?: {
      onLoad?: () => void;

      login?: (
        data: {
          userId: string;
          name: string;
          email: string;
          hash: string;
        },
        callback?: (
          error?: unknown
        ) => void
      ) => void;

      logout?: (
        callback?: (
          error?: unknown
        ) => void
      ) => void;

      showWidget?: () => void;
      hideWidget?: () => void;
    };

    Tawk_LoadStart?: Date;

    /*
     * ValYou guards.
     */
    __VALYOU_TAWK_USER_ID?: string;

    __VALYOU_TAWK_LOGIN_PENDING_USER_ID?: string;
  }
}

const TAWK_SCRIPT_ID =
  "valyou-tawk-chat";

  function identifyTawkVisitor(
    identity: {
      userId: string;
      name: string;
      email: string;
      hash: string;
    }
  ) {
    /*
     * Already identified.
     */
    if (
      window.__VALYOU_TAWK_USER_ID ===
      identity.userId
    ) {
      return;
    }
  
    /*
     * Identification for this user is
     * already in progress.
     *
     * This protects against React Strict
     * Mode and repeated Tawk onLoad calls.
     */
    if (
      window.__VALYOU_TAWK_LOGIN_PENDING_USER_ID ===
      identity.userId
    ) {
      return;
    }
  
    if (!window.Tawk_API?.login) {
      return;
    }
  
    window.__VALYOU_TAWK_LOGIN_PENDING_USER_ID =
      identity.userId;
  
    window.Tawk_API.login(
      {
        userId:
          identity.userId,
  
        name:
          identity.name,
  
        email:
          identity.email,
  
        hash:
          identity.hash,
      },
  
      (
        error
      ) => {
        /*
         * Login finished.
         */
        window.__VALYOU_TAWK_LOGIN_PENDING_USER_ID =
          undefined;
  
        if (error) {
          console.error(
            "Unable to identify Tawk visitor",
            error
          );
  
          return;
        }
  
        /*
         * Remember this user for the lifetime
         * of the browser page.
         */
        window.__VALYOU_TAWK_USER_ID =
          identity.userId;
  
        console.log(
          "Tawk visitor identified"
        );
      }
    );
  }

export function TawkChat() {
  useEffect(() => {
    let mounted =
      true;

    async function initializeTawk() {
      try {
        /*
         * Get authenticated identity
         * from ValYou backend.
         */
        const identity =
          await supportService
            .getTawkIdentity();

        if (!mounted) {
          return;
        }

        window.Tawk_API =
          window.Tawk_API ||
          {};

        window.Tawk_LoadStart =
          new Date();

        /*
         * Called once the widget
         * finishes loading.
         */
        window.Tawk_API.onLoad =
          () => {
            identifyTawkVisitor(
              identity
            );
          };

        /*
         * Avoid loading the script twice.
         */
        const existing =
          document.getElementById(
            TAWK_SCRIPT_ID
          );

        if (!existing) {
          const script =
            document.createElement(
              "script"
            );

          script.id =
            TAWK_SCRIPT_ID;

          script.async =
            true;

          script.src =
            "https://embed.tawk.to/6aa7ec86063f973441102362/1k2fv7rl3";

          script.charset =
            "UTF-8";

          script.setAttribute(
            "crossorigin",
            "*"
          );

          document.body
            .appendChild(
              script
            );
        }
      } catch (
        error
      ) {
        console.error(
          "Unable to initialize ValYou support chat",
          error
        );
      }
    }

    void initializeTawk();

    return () => {
      mounted =
        false;

      window.Tawk_API
        ?.hideWidget?.();
    };
  }, []);

  return null;
}