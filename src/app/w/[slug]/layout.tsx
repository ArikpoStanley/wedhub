"use client";

import type { ReactNode } from "react";
import { SiteProvider } from "@/context/site-context";

export default function WeddingSiteLayout({ children }: { children: ReactNode }) {
  return <SiteProvider>{children}</SiteProvider>;
}
