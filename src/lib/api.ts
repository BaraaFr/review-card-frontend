import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

const baseURL ="http://localhost:4000/api";

export const api =
  axios.create({
    baseURL,

    withCredentials:
      true,

    headers: {
      "Content-Type":
        "application/json",
    },
  });

/*
 * Separate client so refresh requests
 * don't recursively trigger the main
 * Axios interceptor.
 */
const refreshClient =
  axios.create({
    baseURL,

    withCredentials:
      true,

    headers: {
      "Content-Type":
        "application/json",
    },
  });

type RetryRequestConfig =
  InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

/*
 * One refresh promise per browser tab.
 *
 * If 10 API requests fail at once,
 * they all wait for the same refresh.
 */
let refreshPromise:
  | Promise<void>
  | null =
  null;

function sleep(
  milliseconds: number
) {
  return new Promise(
    (
      resolve
    ) => {
      window.setTimeout(
        resolve,
        milliseconds
      );
    }
  );
}

async function performRefresh() {
  try {
    await refreshClient.post(
      "/auth/refresh"
    );

    return;
  } catch (
    firstError: any
  ) {
    /*
     * Another browser tab may have
     * rotated the shared refresh cookie
     * while this request was in-flight.
     *
     * Browser cookies are shared across
     * tabs, so retry once using the
     * newest cookie.
     */
    if (
      firstError?.response
        ?.status === 401 &&
      firstError?.response
        ?.data?.code ===
        "REFRESH_TOKEN_STALE"
    ) {
      await sleep(
        200
      );

      await refreshClient.post(
        "/auth/refresh"
      );

      return;
    }

    throw firstError;
  }
}

async function refreshSession() {
  if (!refreshPromise) {
    refreshPromise =
      performRefresh()
        .finally(
          () => {
            refreshPromise =
              null;
          }
        );
  }

  return refreshPromise;
}

function redirectToLogin(
  reason?: string
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  const pathname =
    window.location.pathname;

  if (
    pathname ===
      "/login" ||
    pathname ===
      "/activate-account"
  ) {
    return;
  }

  const loginUrl =
    reason
      ? `/login?reason=${encodeURIComponent(
          reason
        )}`
      : "/login";

  window.location.replace(
    loginUrl
  );
}

async function terminateBrowserSession() {
  try {
    await refreshClient.post(
      "/auth/logout"
    );
  } catch {
    /*
     * Logout is best-effort here.
     */
  }
}

api.interceptors.response.use(
  (
    response
  ) =>
    response,

  async (
    error:
      AxiosError<any>
  ) => {
    const response =
      error.response;

    const originalRequest =
      error.config as
        | RetryRequestConfig
        | undefined;

    if (
      !response ||
      !originalRequest
    ) {
      return Promise.reject(
        error
      );
    }

    const code =
      response.data?.code;

    /*
     * Disabled account:
     *
     * don't attempt refresh.
     */
    if (
      response.status ===
        403 &&
      code ===
        "ACCOUNT_DISABLED"
    ) {
      await terminateBrowserSession();

      redirectToLogin(
        "disabled"
      );

      return Promise.reject(
        error
      );
    }
    const isRefreshableAuthError =
    response.status ===
      401 &&
    [
      "ACCESS_TOKEN_EXPIRED",
      "AUTHENTICATION_REQUIRED",
      "INVALID_ACCESS_TOKEN",
  
      /*
       * Password changes and password recovery
       * revoke the corresponding DB session.
       */
      "SESSION_REVOKED",
    ].includes(
      code
    );

    const url =
      originalRequest.url ??
      "";

    const isAuthEndpoint =
      url.includes(
        "/auth/login"
      ) ||
      url.includes(
        "/auth/refresh"
      ) ||
      url.includes(
        "/auth/logout"
      ) ||
      url.includes(
        "/auth/activate-account"
      );

    if (
      isRefreshableAuthError &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry =
        true;

      try {
        /*
         * Refresh cookies silently.
         */
        await refreshSession();

        /*
         * Retry the exact request
         * that originally failed.
         */
        return api(
          originalRequest
        );
      } catch (
        refreshError
      ) {
        await terminateBrowserSession();

        redirectToLogin();

        return Promise.reject(
          refreshError
        );
      }
    }

    return Promise.reject(
      error
    );
  }
);

export const publicApi =
  axios.create({
    baseURL,

    headers: {
      "Content-Type":
        "application/json",
    },
  });