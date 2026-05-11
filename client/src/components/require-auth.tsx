import type { ReactNode } from "react";
import { Redirect, useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";

export function RequireAuth({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center text-[#800000] text-lg">
        Loading…
      </div>
    );
  }

  if (!user) {
    const next = encodeURIComponent(location || "/admin");
    return <Redirect href={`/login?next=${next}`} />;
  }

  return <>{children}</>;
}
