import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { useLocation } from "wouter";
import MobileMenu from "@/components/mobile-menu";
import confetti from "canvas-confetti";

interface NavigationBarProps {
  currentPage?: string;
  showBackButton?: boolean;
}

export default function NavigationBar({ currentPage, showBackButton = false }: NavigationBarProps) {
  const [, navigate] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Our Story", href: "/our-story" },
    { label: "Gallery", href: "/gallery" },
    { label: "Registry", href: "/registry" },
    { label: "Schedule", href: "/schedule" },
    { label: "RSVP", href: "/rsvp" }
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
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
      <header className="bg-rose-50/90 backdrop-blur-md py-6 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Left Navigation Items */}
            <nav className="hidden lg:flex space-x-8">
              <button 
                onClick={() => navigate("/")}
                className={`font-script font-medium transition-colors ${
                  isCurrentPage("home") 
                    ? "text-[hsl(342,69%,29%)] border border-[hsl(342,69%,29%)] px-3 py-1 rounded"
                    : "text-[hsl(342,69%,29%)] hover:text-[hsl(342,60%,40%)]"
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => navigate("/our-story")}
                className={`font-script font-medium transition-colors ${
                  isCurrentPage("our-story") 
                    ? "text-[hsl(342,69%,29%)] border border-[hsl(342,69%,29%)] px-3 py-1 rounded"
                    : "text-[hsl(342,69%,29%)] hover:text-[hsl(342,60%,40%)]"
                }`}
              >
                Our Story
              </button>
              <button 
                onClick={() => navigate("/gallery")}
                className={`font-script font-medium transition-colors ${
                  isCurrentPage("gallery") 
                    ? "text-[hsl(342,69%,29%)] border border-[hsl(342,69%,29%)] px-3 py-1 rounded"
                    : "text-[hsl(342,69%,29%)] hover:text-[hsl(342,60%,40%)]"
                }`}
              >
                Gallery
              </button>
            </nav>

            {/* Center Logo */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {/* Floral wreath background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="w-16 h-16 rounded-full border-2 border-[hsl(332,51%,70%)] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                    onClick={handleLogoClick}
                  >
                    <div className="w-12 h-12 rounded-full border border-[hsl(332,51%,70%)] flex items-center justify-center">
                      <span className="text-[hsl(342,69%,29%)] font-script text-2xl font-bold">E&B</span>
                    </div>
                  </div>
                </div>
                {/* Decorative flowers around the logo */}
              </div>
            </div>

            {/* Right Navigation Items */}
            <div className="flex items-center space-x-6">
              <nav className="hidden lg:flex space-x-8">
                <button 
                  onClick={() => navigate("/registry")}
                  className={`font-script font-medium transition-colors ${
                    isCurrentPage("registry") 
                      ? "text-[hsl(342,69%,29%)] border border-[hsl(342,69%,29%)] px-3 py-1 rounded"
                      : "text-[hsl(342,69%,29%)] hover:text-[hsl(342,60%,40%)]"
                  }`}
                >
                  Registry
                </button>
                <button 
                  onClick={() => navigate("/schedule")}
                  className={`font-script font-medium transition-colors ${
                    isCurrentPage("schedule") 
                      ? "text-[hsl(342,69%,29%)] border border-[hsl(342,69%,29%)] px-3 py-1 rounded"
                      : "text-[hsl(342,69%,29%)] hover:text-[hsl(342,60%,40%)]"
                  }`}
                >
                  Schedule
                </button>
                <button 
                  onClick={() => navigate("/rsvp")}
                  className={`font-script font-medium transition-colors ${
                    isCurrentPage("rsvp") 
                      ? "text-[hsl(342,69%,29%)] border border-[hsl(342,69%,29%)] px-3 py-1 rounded"
                      : "text-[hsl(342,69%,29%)] hover:text-[hsl(342,60%,40%)]"
                  }`}
                >
                  RSVP
                </button>
              </nav>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-[hsl(342,69%,29%)] hover:text-[hsl(342,60%,40%)]"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative line below navigation */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[hsl(342,69%,29%)] to-transparent mt-4"></div>
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