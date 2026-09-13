import type { Metadata } from "next";

import { ValYouLandingPage } from "@/components/landing/valyou-landing-page";
import { hasPossibleSession } from "@/lib/has-session";

export const metadata: Metadata = {
  title: "ValYou | Get More Google Reviews",

  description:
    "ValYou provides NFC and QR Google review cards with simple analytics for restaurants, cafés, shops, clinics and other businesses.",
};

export default async function HomePage() {
  const isAuth = await hasPossibleSession();

  return <ValYouLandingPage isAuth={isAuth} />;
}
