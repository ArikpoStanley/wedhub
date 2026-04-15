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
    // { label: "Our Story", href: "/our-story" },
    { label: "Gallery", href: "/gallery" },
    { label: "Registry", href: "/registry" },
    { label: "Schedule", href: "/schedule" }
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
                className={`font-script font-medium transition-colors text-lg ${
                  isCurrentPage("home") 
                    ? "text-[#800000] border border-[#800000] px-3 py-1 rounded"
                    : "text-[#800000] hover:text-[hsl(342,60%,40%)]"
                }`}
              >
                Home
              </button>
              {/* Our Story hidden
              <button 
                onClick={() => navigate("/our-story")}
                className={`font-script font-medium transition-colors text-xl ${
                  isCurrentPage("our-story") 
                    ? "text-[#800000] border border-[#800000] px-3 py-1 rounded"
                    : "text-[#800000] hover:text-[hsl(342,60%,40%)]"
                }`}
              >
                Our Story
              </button>
              */}
              <button 
                onClick={() => navigate("/gallery")}
                className={`font-script font-medium transition-colors text-xl ${
                  isCurrentPage("gallery") 
                    ? "text-[#800000] border border-[#800000] px-3 py-1 rounded"
                    : "text-[#800000] hover:text-[hsl(342,60%,40%)]"
                }`}
              >
                Gallery
              </button>
            </nav>

            {/* Center Logo */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src="https://res.cloudinary.com/dycukxm7r/image/upload/v1755525560/EBLogo-removebg-preview_cskhkd.png"
                  alt="E&B Wedding Logo"
                  className="w-8 h-8 md:w-16 md:h-16 object-contain cursor-pointer hover:scale-105 hover:rotate-360 transition-transform duration-700"
                  onClick={handleLogoClick}
                />
              </div>
            </div>

            {/* Right Navigation Items */}
            <div className="flex items-center space-x-6">
              <nav className="hidden lg:flex space-x-8">
                <button 
                  onClick={() => navigate("/registry")}
                  className={`font-script font-medium transition-colors text-xl ${
                    isCurrentPage("registry") 
                      ? "text-[#800000] border border-[#800000] px-3 py-1 rounded"
                      : "text-[#800000] hover:text-[hsl(342,60%,40%)]"
                  }`}
                >
                  Registry
                </button>
                <button 
                  onClick={() => navigate("/schedule")}
                  className={`font-script font-medium transition-colors text-xl ${
                    isCurrentPage("schedule") 
                      ? "text-[#800000] border border-[#800000] px-3 py-1 rounded"
                      : "text-[#800000] hover:text-[hsl(342,60%,40%)]"
                  }`}
                >
                  Schedule
                </button>

              </nav>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-[#800000] hover:text-[hsl(342,60%,40%)] p-3 bg-pink-200 hover:bg-pink-300 rounded-lg"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-8 w-8" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative line below navigation */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#800000] to-transparent mt-4"></div>
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