import axios, {
    type AxiosResponse,
  } from "axios";
  
  import {
    api,
  } from "./api";
  
  const inFlight =
    new Map<
      string,
      Promise<
        AxiosResponse<unknown>
      >
    >();
  
  const pendingKeys =
    new Map<
      string,
      string
    >();
  
  function stable(
    value: unknown
  ): string {
    if (
      value === undefined
    ) {
      return "null";
    }
  
    if (
      Array.isArray(
        value
      )
    ) {
      return `[${value
        .map(stable)
        .join(",")}]`;
    }
  
    if (
      value !== null &&
      typeof value ===
        "object"
    ) {
      return `{${Object.entries(
        value
      )
        .filter(
          ([, v]) =>
            v !==
            undefined
        )
        .sort(
          ([a], [b]) =>
            a.localeCompare(
              b
            )
        )
        .map(
          ([k, v]) =>
            `${JSON.stringify(
              k
            )}:${stable(
              v
            )}`
        )
        .join(",")}}`;
    }
  
    return JSON.stringify(
      value
    );
  }
  
  export async function idempotentRequest<T>(
    method:
      | "POST"
      | "DELETE"
      | "PATCH",
  
    url: string,
  
    data:
      unknown = {}
  ) {
    /*
     * Build a deterministic fingerprint
     * for this logical operation.
     */
    const bytes =
      await crypto.subtle.digest(
        "SHA-256",
  
        new TextEncoder().encode(
          stable({
            method,
            url,
            data,
          })
        )
      );
  
    const fingerprint =
      `valyou-request:${Array.from(
        new Uint8Array(
          bytes
        ),
        (
          value
        ) =>
          value
            .toString(16)
            .padStart(
              2,
              "0"
            )
      ).join("")}`;
  
    /*
     * Prevent repeated clicks in the
     * same browser tab from sending
     * another request.
     */
    const existing =
      inFlight.get(
        fingerprint
      );
  
    if (existing) {
      return existing as Promise<
        AxiosResponse<T>
      >;
    }
  
    /*
     * Reuse the same idempotency key
     * if the previous response may
     * have been lost.
     */
    let key =
      pendingKeys.get(
        fingerprint
      );
  
    try {
      key ??=
        sessionStorage.getItem(
          fingerprint
        ) ??
        undefined;
    } catch {
      /*
       * sessionStorage may be unavailable.
       */
    }
  
    key ??=
      crypto.randomUUID();
  
    pendingKeys.set(
      fingerprint,
      key
    );
  
    try {
      sessionStorage.setItem(
        fingerprint,
        key
      );
    } catch {
      /*
       * Keep the in-memory key.
       */
    }
  
    const clearKey =
      () => {
        pendingKeys.delete(
          fingerprint
        );
  
        try {
          sessionStorage.removeItem(
            fingerprint
          );
        } catch {
          /*
           * Ignore storage errors.
           */
        }
      };
  
    const request =
      api
        .request<T>({
          method,
          url,
          data,
  
          headers: {
            "Idempotency-Key":
              key,
          },
        })
        .then(
          (
            response
          ) => {
            /*
             * Successful response:
             * operation is definitely done.
             */
            clearKey();
  
            return response;
          }
        )
        .catch(
          (
            error:
              unknown
          ) => {
            /*
             * These responses tell us the
             * server definitely responded.
             *
             * A new attempt is therefore
             * allowed to receive a new key.
             *
             * For connection interruption,
             * timeout, or uncertain 5xx,
             * keep the same key.
             */
            if (
              axios.isAxiosError(
                error
              ) &&
              error.response &&
              [
                400,
                403,
                404,
                409,
                410,
                422,
              ].includes(
                error.response
                  .status
              )
            ) {
              clearKey();
            }
  
            throw error;
          }
        )
        .finally(
          () => {
            inFlight.delete(
              fingerprint
            );
          }
        );
  
    inFlight.set(
      fingerprint,
      request
    );
  
    return request;
  }