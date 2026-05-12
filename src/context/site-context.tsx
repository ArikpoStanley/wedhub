"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { weddingApi } from "@/services/wedding-api";
import type { PublicSite } from "@shared/site-schema";
import { weddingPaletteCssVars } from "@shared/wedding-palette";

type SiteContextValue = {
  tenantSlug: string | null;
  /** Base path for tenant routes, e.g. `/w/marble` or `""` on the global site. */
  pathPrefix: string;
  site: PublicSite | null;
  siteId: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const tenantSlug = useMemo(() => {
    const m = pathname.match(/^\/w\/([^/]+)/);
    return m?.[1] ?? null;
  }, [pathname]);

  const pathPrefix = tenantSlug ? `/w/${tenantSlug}` : "";

  const [site, setSite] = useState<PublicSite | null>(null);
  const [loading, setLoading] = useState(Boolean(tenantSlug));
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!tenantSlug) {
      setSite(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await weddingApi.getPublicSite(tenantSlug);
      if (res.success && res.data) {
        setSite(res.data);
      } else {
        setSite(null);
        setError(res.message || "Could not load wedding site");
      }
    } catch (e) {
      setSite(null);
      setError(e instanceof Error ? e.message : "Could not load wedding site");
    } finally {
      setLoading(false);
    }
  }, [tenantSlug]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const vars = weddingPaletteCssVars(site?.theme);
    for (const [key, val] of Object.entries(vars)) {
      document.documentElement.style.setProperty(key, val);
    }
  }, [site?.theme]);

  const value = useMemo<SiteContextValue>(
    () => ({
      tenantSlug,
      pathPrefix,
      site,
      siteId: site?._id ?? null,
      loading,
      error,
      refresh,
    }),
    [tenantSlug, pathPrefix, site, loading, error, refresh]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useWeddingSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error("useWeddingSite must be used within SiteProvider");
  }
  return ctx;
}

/** Safe variant for components that may render outside `SiteProvider`. */
export function useWeddingSiteOptional(): SiteContextValue | null {
  return useContext(SiteContext);
}
