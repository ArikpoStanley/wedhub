"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import MobileMenu from "@/components/mobile-menu";
import confetti from "canvas-confetti";
import { useWeddingSiteOptional } from "@/context/site-context";
import { resolveHomeHeroBackgroundImageUrl } from "@shared/resolve-home-hero";

/** Decorative wedding rings (from `client/public/`); flanks the centre avatar. */
const NAV_RING_DECORATION_SRC = "/s-l1600-removebg-preview.png";

function resolveNavPath(pathPrefix: string, href: string): string {
  if (!pathPrefix) return href;
  if (href === "/") return pathPrefix;
  return `${pathPrefix}${href}`;
}

interface NavigationBarProps {
  currentPage?: string;
  showBackButton?: boolean;
}

export default function NavigationBar({ currentPage, showBackButton = false }: NavigationBarProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const siteCtx = useWeddingSiteOptional();
  const pathPrefix = siteCtx?.pathPrefix ?? "";
  const logoUrl = resolveHomeHeroBackgroundImageUrl(siteCtx?.site?.content) ?? null;

  const navigationItems = [
    { label: "Home", href: "/" },
    // { label: "Our Story", href: "/our-story" },
    { label: "Gallery", href: "/gallery" },
    { label: "Registry", href: "/registry" },
    { label: "Schedule", href: "/schedule" }
  ];

  const handleNavigation = (href: string) => {
    router.push(resolveNavPath(pathPrefix, href));
    setIsMobileMenuOpen(false);
  };

  const isCurrentPage = (page: string) => {
    return currentPage === page;
  };

  const handleLogoClick = () => {
    // Fire confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [
        '#f472b6', '#ec4899', '#db2777', '#be185d', '#fbbf24',
        '#f59e0b', '#10b981', '#059669', '#3b82f6', '#1d4ed8',
        '#8b5cf6', '#7c3aed', '#ef4444', '#dc2626', '#ffffff',
      ],
      shapes: ['circle', 'square'],
      gravity: 0.8,
      ticks: 200,
      startVelocity: 30,
      decay: 0.95,
    });
  };

  return (
    <>
      <header className="bg-[var(--w-bg)]/90 backdrop-blur-md py-6 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex w-full items-center gap-2">
            {/* Left: nav (desktop) — flex-1 keeps the centre cluster visually centred */}
            <div className="flex min-w-0 flex-1 justify-start">
            <nav className="hidden lg:flex space-x-8">
              <button
                onClick={() => router.push(resolveNavPath(pathPrefix, "/"))}
                className={`font-script font-medium transition-colors text-lg ${isCurrentPage("home")
                    ? "text-[var(--w-primary)] border border-[var(--w-primary)] px-3 py-1 rounded"
                    : "text-[var(--w-primary)] hover:text-[var(--w-primary-hover)]"
                  }`}
              >
                Home
              </button>
              {/* Our Story hidden
              <button 
                onClick={() => router.push("/our-story")}
                className={`font-script font-medium transition-colors text-xl ${
                  isCurrentPage("our-story") 
                    ? "text-[var(--w-primary)] border border-[var(--w-primary)] px-3 py-1 rounded"
                    : "text-[var(--w-primary)] hover:text-[var(--w-primary-hover)]"
                }`}
              >
                Our Story
              </button>
              */}
              <button
                onClick={() => router.push(resolveNavPath(pathPrefix, "/gallery"))}
                className={`font-script font-medium transition-colors text-xl ${isCurrentPage("gallery")
                    ? "text-[var(--w-primary)] border border-[var(--w-primary)] px-3 py-1 rounded"
                    : "text-[var(--w-primary)] hover:text-[var(--w-primary-hover)]"
                  }`}
              >
                Gallery
              </button>
            </nav>
            </div>

            {/* Centre: rings + logo + rings (rings hidden on very narrow screens) */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-2.5">
              <img
                src={NAV_RING_DECORATION_SRC}
                alt=""
                width={56}
                height={56}
                decoding="async"
                className="pointer-events-none hidden h-8 w-8 select-none object-contain opacity-90 sm:block sm:h-9 sm:w-9 md:h-12 md:w-12"
                aria-hidden
              />
              <div className="flex flex-col items-center">
                <div className="relative">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt=""
                      className="h-8 w-8 cursor-pointer rounded-full object-contain transition-transform duration-700 hover:scale-105 hover:rotate-360 md:h-16 md:w-16"
                      onClick={handleLogoClick}
                    />
                  ) : (
                    <button
                      type="button"
                      aria-label="Celebration"
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-[var(--w-border-soft)] bg-[var(--w-primary)] text-white transition-transform duration-300 hover:scale-105 md:h-16 md:w-16"
                      onClick={handleLogoClick}
                    >
                      <Heart className="h-4 w-4 fill-current md:h-8 md:w-8" />
                    </button>
                  )}
                </div>
              </div>
              <img
                src={NAV_RING_DECORATION_SRC}
                alt=""
                width={56}
                height={56}
                decoding="async"
                className="pointer-events-none hidden h-8 w-8 select-none object-contain opacity-90 sm:block sm:h-9 sm:w-9 md:h-12 md:w-12 [transform:scaleX(-1)]"
                aria-hidden
              />
            </div>

            {/* Right: nav + menu */}
            <div className="flex min-w-0 flex-1 items-center justify-end space-x-6">
              <nav className="hidden lg:flex space-x-8">
                <button
                  onClick={() => router.push(resolveNavPath(pathPrefix, "/registry"))}
                  className={`font-script font-medium transition-colors text-xl ${isCurrentPage("registry")
                      ? "text-[var(--w-primary)] border border-[var(--w-primary)] px-3 py-1 rounded"
                      : "text-[var(--w-primary)] hover:text-[var(--w-primary-hover)]"
                    }`}
                >
                  Registry
                </button>
                <button
                  onClick={() => router.push(resolveNavPath(pathPrefix, "/schedule"))}
                  className={`font-script font-medium transition-colors text-xl ${isCurrentPage("schedule")
                      ? "text-[var(--w-primary)] border border-[var(--w-primary)] px-3 py-1 rounded"
                      : "text-[var(--w-primary)] hover:text-[var(--w-primary-hover)]"
                    }`}
                >
                  Schedule
                </button>

              </nav>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-[var(--w-primary)] hover:text-[var(--w-primary-hover)] p-3 bg-[var(--w-border-soft)] hover:opacity-90 rounded-lg"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-8 w-8" />
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative line below navigation */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--w-primary)] to-transparent mt-4"></div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigationItems={navigationItems}
        onNavigate={handleNavigation}
      />
    </>
  );
}