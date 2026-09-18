import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

/*
 * Never hardcode production API URLs
 * into application source.
 */
const baseURL =
  process.env
    .NEXT_PUBLIC_API_URL ??
  "http://localhost:4000/api";

const options = {
  baseURL,

  timeout:
    15_000,

  withCredentials:
    true,

  headers: {
    "Content-Type":
      "application/json",
  },
};

export const api =
  axios.create(
    options
  );

/*
 * Refresh client must NOT use
 * the main interceptor or it would
 * recursively refresh itself.
 */
const refreshClient =
  axios.create(
    options
  );

/*
 * Public endpoints do not need
 * authentication cookies.
 *
 * The browser still sends its Origin
 * header, so trusted-origin protection
 * remains effective.
 */
export const publicApi =
  axios.create({
    ...options,

    withCredentials:
      false,
  });

type AuthError = {
  code?:
    string;

  message?:
    string;
};

type RetriedRequest =
  InternalAxiosRequestConfig & {
    _retry?:
      boolean;
  };

/*
 * One refresh promise for all failed
 * requests inside this browser tab.
 */
let refreshPromise:
  Promise<void> |
  null =
  null;

/*
 * =========================================================
 * Terminal session errors
 * =========================================================
 *
 * Network errors / 429 / 5xx are NOT terminal.
 *
 * We must not throw away a user's valid session
 * just because Redis/API temporarily failed.
 */
export function isTerminalAuthError(
  error:
    unknown
): boolean {
  if (
    !axios.isAxiosError<AuthError>(
      error
    )
  ) {
    return false;
  }

  const status =
    error.response
      ?.status;

  const code =
    error.response
      ?.data
      ?.code;

  return (
    (
      status ===
        401 &&
      code !==
        "REFRESH_TOKEN_STALE"
    ) ||
    (
      status ===
        403 &&
      code ===
        "ACCOUNT_DISABLED"
    )
  );
}

/*
 * =========================================================
 * Login redirect
 * =========================================================
 */

function redirectToLogin() {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  const pathname =
    window.location
      .pathname;

  /*
   * Avoid redirect loops.
   */
  if (
    [
      "/login",
      "/activate-account",
      "/reset-password",
    ].includes(
      pathname
    )
  ) {
    return;
  }

  window.location.replace(
    `/login?next=${encodeURIComponent(
      pathname
    )}`
  );
}

/*
 * =========================================================
 * Refresh
 * =========================================================
 */

async function performRefresh() {
  try {
    await refreshClient
      .post(
        "/auth/refresh"
      );
  } catch (
    error
  ) {
    /*
     * Another tab may have rotated the
     * refresh cookie just before us.
     *
     * Browser cookies are shared between
     * tabs, so retry once using whatever
     * cookie is newest now.
     */
    if (
      !axios.isAxiosError<AuthError>(
        error
      ) ||
      error.response
        ?.data
        ?.code !==
        "REFRESH_TOKEN_STALE"
    ) {
      throw error;
    }

    await new Promise(
      (
        resolve
      ) =>
        setTimeout(
          resolve,
          250
        )
    );

    await refreshClient
      .post(
        "/auth/refresh"
      );
  }
}

/*
 * =========================================================
 * Cross-tab refresh lock
 * =========================================================
 */

function refreshSession() {
  if (
    !refreshPromise
  ) {
    const run =
      async () => {
        /*
         * navigator.locks coordinates
         * refreshes between browser tabs.
         *
         * Without this:
         *
         * Tab A refreshes
         * Tab B refreshes old cookie
         * Tab B gets STALE
         *
         * The backend still handles that,
         * but avoiding the race entirely
         * is cleaner.
         */
        if (
          typeof navigator !==
            "undefined" &&
          "locks" in
            navigator
        ) {
          await navigator
            .locks
            .request(
              "valyou-session-refresh",

              performRefresh
            );

          return;
        }

        /*
         * Browser fallback.
         */
        await performRefresh();
      };

    refreshPromise =
      run()
        .finally(
          () => {
            refreshPromise =
              null;
          }
        );
  }

  return refreshPromise;
}

/*
 * =========================================================
 * Main response interceptor
 * =========================================================
 */

api.interceptors
  .response
  .use(
    (
      response
    ) =>
      response,

    async (
      error:
        AxiosError<AuthError>
    ) => {
      const original =
        error.config as
          | RetriedRequest
          | undefined;

      /*
       * Network errors do not prove the
       * authentication session is invalid.
       */
      if (
        !original ||
        !error.response
      ) {
        throw error;
      }

      const code =
        error.response
          .data
          ?.code;

      /*
       * Disabled account:
       *
       * Refreshing cannot repair it.
       */
      if (
        error.response
          .status ===
          403 &&
        code ===
          "ACCOUNT_DISABLED"
      ) {
        redirectToLogin();

        throw error;
      }

      const url =
        original.url ??
        "";

      /*
       * Never intercept auth endpoints
       * themselves.
       */
      const authEndpoint =
        [
          "/auth/login",
          "/auth/refresh",
          "/auth/logout",
          "/auth/activate-account",
          "/auth/reset-password",
        ].some(
          (
            path
          ) =>
            url.includes(
              path
            )
        );

      /*
       * Errors that may be repaired by
       * refreshing the access JWT.
       */
      const refreshable =
        error.response
          .status ===
          401 &&
        [
          "ACCESS_TOKEN_EXPIRED",
          "AUTHENTICATION_REQUIRED",
          "INVALID_ACCESS_TOKEN",
          "SESSION_REVOKED",
        ].includes(
          code ??
            ""
        );

      if (
        !authEndpoint &&
        refreshable &&
        !original._retry
      ) {
        original._retry =
          true;

        try {
          await refreshSession();
        } catch (
          refreshError
        ) {
          /*
           * VERY IMPORTANT:
           *
           * Don't redirect/logout for:
           *
           * - network failure
           * - Redis outage
           * - API 500
           * - rate-limit 429
           * - stale-token race
           *
           * Those do not prove the user's
           * refresh session is invalid.
           */
          if (
            isTerminalAuthError(
              refreshError
            )
          ) {
            redirectToLogin();
          }

          throw refreshError;
        }

        /*
         * Retry exactly once using the
         * newly issued access cookie.
         */
        return api(
          original
        );
      }

      /*
       * A genuine terminal auth failure
       * outside auth endpoints means the
       * user needs to authenticate again.
       */
      if (
        !authEndpoint &&
        isTerminalAuthError(
          error
        )
      ) {
        redirectToLogin();
      }

      throw error;
    }
  );