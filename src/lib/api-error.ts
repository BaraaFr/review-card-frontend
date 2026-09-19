import axios
  from "axios";

type ApiErrorResponse = {
  success?:
    boolean;

  code?:
    string;

  message?:
    string;

  requestId?:
    string;
};

export function getApiErrorMessage(
  error:
    unknown,

  fallback =
    "Something went wrong"
): string {
  if (
    axios.isAxiosError<
      ApiErrorResponse
    >(
      error
    )
  ) {
    return (
      error.response
        ?.data
        ?.message ??
      fallback
    );
  }

  if (
    error instanceof
    Error
  ) {
    return error.message;
  }

  return fallback;
}

export function getApiErrorRequestId(
  error:
    unknown
): string | null {
  if (
    !axios.isAxiosError<
      ApiErrorResponse
    >(
      error
    )
  ) {
    return null;
  }

  return (
    error.response
      ?.data
      ?.requestId ??
    error.response
      ?.headers?.[
        "x-request-id"
      ] ??
    null
  );
}

export function getApiErrorCode(
  error:
    unknown
): string | null {
  if (
    !axios.isAxiosError<
      ApiErrorResponse
    >(
      error
    )
  ) {
    return null;
  }

  return (
    error.response
      ?.data
      ?.code ??
    null
  );
}