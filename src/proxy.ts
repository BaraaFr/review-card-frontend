import {
  NextRequest,
  NextResponse,
} from "next/server";

const AUTH_COOKIE =
  "auth_token";

const REFRESH_COOKIE =
  "refresh_token";

const protectedPrefixes = [
  "/dashboard",
  "/locations",
  "/cards",
  "/analytics",
  "/subscription",
  "/settings",
  "/profile",
  "/admin",
];

function isProtectedPath(
  pathname: string
) {
  return protectedPrefixes.some(
    (
      prefix
    ) =>
      pathname ===
        prefix ||
      pathname.startsWith(
        `${prefix}/`
      )
  );
}

export function proxy(
  request:
    NextRequest
) {
  const pathname =
    request.nextUrl.pathname;

  const accessToken =
    request.cookies.get(
      AUTH_COOKIE
    )?.value;

  const refreshToken =
    request.cookies.get(
      REFRESH_COOKIE
    )?.value;

  const hasPossibleSession =
    Boolean(
      accessToken ||
        refreshToken
    );

  if (
    isProtectedPath(
      pathname
    ) &&
    !hasPossibleSession
  ) {
    const loginUrl =
      new URL(
        "/login",
        request.url
      );

    loginUrl.searchParams.set(
      "from",
      pathname
    );

    return NextResponse.redirect(
      loginUrl
    );
  }

  /*
   * "/" is public.
   *
   * Also do not automatically
   * redirect /login because
   * cookie existence does not
   * prove validity.
   */
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};