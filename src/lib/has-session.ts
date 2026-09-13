// src/lib/auth/has-session.ts

import {
    cookies,
  } from "next/headers";
  
  const AUTH_COOKIE =
    "auth_token";
  
  const REFRESH_COOKIE =
    "refresh_token";
  
  export async function hasPossibleSession() {
    const cookieStore =
      await cookies();
  
    const accessToken =
      cookieStore.get(
        AUTH_COOKIE
      )?.value;
  
    const refreshToken =
      cookieStore.get(
        REFRESH_COOKIE
      )?.value;
  
    return Boolean(
      accessToken ||
        refreshToken
    );
  }