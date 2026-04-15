import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import MobileMenu from "@/components/mobile-menu";
import CountdownTimer from "@/components/countdown-timer";
import ConfettiBackground from "@/components/confetti-background";
import ConfettiBurst from "@/components/confetti-burst";
import NavigationBar from "@/components/navigation-bar";
import Footer from "@/components/footer";
import ActionModal from "@/components/action-modal";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isModalDisabled, setIsModalDisabled] = useState(false);
  const [, navigate] = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (sectionId === "our-story") {
      navigate("/our-story");
    } else if (sectionId === "gallery") {
      navigate("/gallery");
    } else if (sectionId === "registry") {
      navigate("/registry");
    } else if (sectionId === "schedule") {
      navigate("/schedule");
    } else if (sectionId === "rsvp") {
      navigate("/schedule#rsvp");
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { label: "Home", href: "home" },
    // { label: "Our Story", href: "our-story" },
    { label: "Gallery", href: "gallery" },
    { label: "Registry", href: "registry" },
    { label: "Schedule", href: "schedule" },
  ];

  const weddingPhotos = [
    {
      src: "https://res.cloudinary.com/dycukxm7r/image/upload/v1776227725/DSC_8787_wrwgc9.jpg",
      alt: "Mymee in traditional attire",
    },
    {
      src: "https://res.cloudinary.com/dycukxm7r/image/upload/v1776227700/DSC_8764_vvhtp1.jpg",
      alt: "David in traditional attire",
    },
    {
      src: "https://res.cloudinary.com/dycukxm7r/image/upload/v1776227687/DSC_8756_bbieof.jpg",
      alt: "Mymee and David together",
    },
    {
      src: "https://res.cloudinary.com/dycukxm7r/image/upload/v1776227680/DSC_8775_ta3pbs.jpg",
      alt: "Couple portrait",
    },
    {
      src: "https://res.cloudinary.com/dycukxm7r/image/upload/v1776227664/DSC_8782_bqdxop.jpg",
      alt: "Mymee smiling",
    },
    {
      src: "https://res.cloudinary.com/dycukxm7r/image/upload/v1776227671/PreweddingPictures_odczgq.jpg",
      alt: "Pre-wedding pictures",
    },
  ];

  return (
    <div className="min-h-screen bg-rose-50 relative">
      <ConfettiBackground />
      <ConfettiBurst />

      <NavigationBar currentPage="home" />

      {/* Hero Section */}
      <section
        id="home"
        className="h-auto flex flex-col justify-start items-center text-center px-4 pt-6 md:pt-10 relative"
      >
        {/* Floating hearts decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 text-[hsl(332,51%,70%)] text-2xl"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            💕
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-1/4 text-[hsl(332,60%,50%)] text-xl"
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: -2,
            }}
          >
            💖
          </motion.div>
          <motion.div
            className="absolute bottom-1/3 left-1/3 text-[hsl(332,51%,70%)] text-lg"
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: -4,
            }}
          >
            💝
          </motion.div>
        </div>

        {/* Countdown Timer */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <CountdownTimer targetDate="2026-04-18T00:00:00" />
        </motion.div>

        {/* Heart Icon */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="w-8 h-8 bg-[#800000] rounded-full flex items-center justify-center border-2 border-[hsl(332,51%,70%)]">
            <Heart className="text-white text-sm fill-current" />
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl lg:text-5xl font-serif mb-2 leading-tight">
            <span className="text-[hsl(332,51%,70%)]">CELEBRATE LOVE,</span>
            <span className="text-[#800000]"> CELEBRATE</span>
            <br />
            <span className="text-[#800000]">LIFE </span>
            <span className="text-[hsl(332,51%,70%)]">WITH GRATITUDE</span>
          </h1>

          {/* Couple Names */}
          <div className="text-3xl sm:text-4xl md:text-5xl font-script text-[#800000] mt-4 mb-8">
            Mymee & David
          </div>
        </motion.div>
      </section>

      {/* Stripe Decoration */}
      <div className="stripe-pattern w-full"></div>

      {/* Photo Gallery Section */}
      <section id="gallery" className="bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex space-x-6 animate-scroll"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Duplicate photos for infinite scroll effect */}
            {[...weddingPhotos, ...weddingPhotos].map((photo, index) => (
              <motion.div
                key={index}
                className="group flex-shrink-0 w-80 h-96 overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stripe Decoration */}
      <div className="stripe-pattern w-full"></div>

      {/* Our Story Section */}
      <section id="our-story" className="py-20 bg-rose-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile Image */}

            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-[#800000] leading-tight uppercase tracking-wide">
                OUR JOURNEY IS A{" "}
                <span className="text-[hsl(332,51%,70%)]">
                  BEAUTIFUL TAPESTRY,
                </span>{" "}
                CAREFULLY{" "}
                <span className="text-[hsl(332,51%,70%)]">WOVEN BY GOD</span>
              </h2>
              <p className="text-base md:text-xl lg:text-2xl text-[#800000] leading-relaxed max-w-4xl mx-auto uppercase tracking-wide font-medium mt-6">
                — EVERY BEAUTIFUL MOMENT, EVERY STEP FROM THE START, HIS HAND
                HAS GUIDED US,{" "}
                <span className="text-[hsl(332,51%,70%)]">
                  HIS GRACE HAS SUSTAINED US, AND HIS LOVE HAS BROUGHT US HERE.
                </span>{" "}
                WHAT BEGAN AS A SIMPLE CONNECTION HAS GROWN INTO{" "}
                <span className="text-[hsl(332,51%,70%)]">
                  A LOVE FILLED WITH PURPOSE, JOY, AND COUNTLESS BLESSINGS.
                </span>{" "}
                AS WE STEP INTO FOREVER, WE CELEBRATE ALL THAT HE HAS DONE AND
                ALL THAT IS YET TO COME.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left side - Couple photo with arched frame */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="relative">
                  {/* Arched frame with hearts */}
                  <div className="relative w-80 h-96 mx-auto">
                    {/* Main arched border - semi-circular top, straight sides, rounded bottom */}
                    <div className="absolute inset-0 border-4 border-pink-200 rounded-t-[10rem] rounded-b-lg"></div>

                    {/* Heart decorations */}
                    <div className="absolute -top-2 -right-2 text-[#800000] text-2xl">
                      ❤️
                    </div>
                    <div className="absolute -bottom-2 -left-2 text-[#800000] text-2xl">
                      ❤️
                    </div>

                    {/* Couple photo */}
                    <div className="absolute inset-8 bg-amber-50 rounded-t-[8rem] rounded-b-md overflow-hidden">
                      <img
                        src={weddingPhotos[0].src}
                        alt="Mymee & David"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right side - Text content */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                {/* Ring icon */}
                <div className="text-[#800000] text-2xl mb-4">💍</div>

                <h3 className="text-3xl font-script text-[#800000]">
                  Mymee & David
                </h3>
                <h4 className="text-xl font-serif text-gray-800">
                  Two hearts. One divine journey.
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  Mymee and David are proof that when love is led by faith, it
                  becomes something extraordinary. From the moment their paths
                  crossed, it was clear that God was writing a story bigger than
                  either of them imagined.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Individually, they are driven, passionate, and full of
                  purpose. Together, they are a reflection of grace, laughter,
                  deep friendship, and unwavering love — partners in life,
                  faith, and the beautiful future ahead.
                </p>

                {/* Couple Story button */}
                <div className="relative">
                  {/* <Button
                    onClick={() => (window.location.href = "/our-story")}
                    className="bg-[#800000] text-white px-6 py-2 rounded-full font-medium hover:bg-[hsl(342,60%,40%)] transition-colors transform rotate-3"
                  >
                    COUPLE STORY
                  </Button> */}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Photo Gallery */}
      <section id="schedule" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="relative w-full max-w-sm mx-auto h-80 md:hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Top left image */}
            <div className="absolute top-0 left-0 w-20 h-24 border-4 border-pink-200 rounded-t-[2.5rem] rounded-b-lg overflow-hidden">
              <div className="absolute inset-1 bg-amber-50 rounded-t-[2.25rem] rounded-b-md overflow-hidden">
                <img
                  src={weddingPhotos[0].src}
                  alt={weddingPhotos[0].alt}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Top right image */}
            <div className="absolute top-0 right-0 w-20 h-24 border-4 border-pink-200 rounded-t-[2.5rem] rounded-b-lg overflow-hidden">
              <div className="absolute inset-1 bg-amber-50 rounded-t-[2.25rem] rounded-b-md overflow-hidden">
                <img
                  src={weddingPhotos[1].src}
                  alt={weddingPhotos[1].alt}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Center large oval image */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-40 border-4 border-pink-200 rounded-[50%] overflow-hidden shadow-xl">
              <img
                src={weddingPhotos[2].src}
                alt={weddingPhotos[2].alt}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Bottom left image */}
            <div className="absolute bottom-0 left-0 w-20 h-24 border-4 border-pink-200 rounded-t-lg rounded-b-[2.5rem] overflow-hidden">
              <div className="absolute inset-1 bg-amber-50 rounded-t-md rounded-b-[2.25rem] overflow-hidden">
                <img
                  src={weddingPhotos[3].src}
                  alt={weddingPhotos[3].alt}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Bottom right image */}
            <div className="absolute bottom-0 right-0 w-20 h-24 border-4 border-pink-200 rounded-t-lg rounded-b-[2.5rem] overflow-hidden">
              <div className="absolute inset-1 bg-amber-50 rounded-t-md rounded-b-[2.25rem] overflow-hidden">
                <img
                  src={weddingPhotos[4].src}
                  alt={weddingPhotos[4].alt}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </motion.div>

          {/* Desktop layout - horizontal row */}
          <motion.div
            className="hidden md:flex justify-center items-center space-x-6 md:space-x-8 lg:space-x-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* First image - arched frame */}
            <div className="w-32 h-32 lg:w-40 lg:h-40 relative">
              {/* Outer div: Creates the arched border frame */}
              <div className="absolute inset-0 border-4 border-pink-200 rounded-t-[4rem] lg:rounded-t-[5rem] rounded-b-lg"></div>

              {/* Inner div: Creates the curved image container */}
              <div className="absolute inset-2 bg-amber-50 rounded-t-[3.5rem] lg:rounded-t-[4.5rem] rounded-b-md overflow-hidden">
                <img
                  src={weddingPhotos[0].src}
                  alt={weddingPhotos[0].alt}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Second image - arched frame */}
            <div className="w-32 h-32 lg:w-40 lg:h-40 relative transform rotate-180">
              {/* Outer div: Creates the arched border frame */}
              <div className="absolute inset-0 border-4 border-pink-200 rounded-t-[4rem] lg:rounded-t-[5rem] rounded-b-lg"></div>

              {/* Inner div: Creates the curved image container */}
              <div className="absolute inset-2 bg-amber-50 rounded-t-[3.5rem] lg:rounded-t-[4.5rem] rounded-b-md overflow-hidden">
                <img
                  src={weddingPhotos[1].src}
                  alt={weddingPhotos[1].alt}
                  className="w-full h-full object-cover object-top transform -rotate-180"
                />
              </div>
            </div>

            {/* Middle image - larger and centered */}
            <div className="w-32 h-32 lg:w-36 lg:h-36 rounded-full border-3 border-pink-200 overflow-hidden shadow-xl">
              <img
                src={weddingPhotos[2].src}
                alt={weddingPhotos[2].alt}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Fourth image - arched frame */}
            <div className="w-32 h-32 lg:w-40 lg:h-40 relative transform rotate-180">
              {/* Outer div: Creates the arched border frame */}
              <div className="absolute inset-0 border-4 border-pink-200 rounded-t-[4rem] lg:rounded-t-[5rem] rounded-b-lg"></div>

              {/* Inner div: Creates the curved image container */}
              <div className="absolute inset-2 bg-amber-50 rounded-t-[3.5rem] lg:rounded-t-[4.5rem] rounded-b-md overflow-hidden">
                <img
                  src={weddingPhotos[3].src}
                  alt={weddingPhotos[3].alt}
                  className="w-full h-full object-cover object-top transform -rotate-180"
                />
              </div>
            </div>

            {/* Fifth image - arched frame */}
            <div className="w-32 h-32 lg:w-40 lg:h-40 relative">
              {/* Outer div: Creates the arched border frame */}
              <div className="absolute inset-0 border-4 border-pink-200 rounded-t-[4rem] lg:rounded-t-[5rem] rounded-b-lg"></div>

              {/* Inner div: Creates the curved image container */}
              <div className="absolute inset-2 bg-amber-50 rounded-t-[3.5rem] lg:rounded-t-[4.5rem] rounded-b-md overflow-hidden">
                <img
                  src={weddingPhotos[4].src}
                  alt={weddingPhotos[4].alt}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom Action Bar with Modal */}
      <div
        className="fixed bottom-12 md:bottom-4 lg:bottom-10 left-1/2 transform -translate-x-1/2 z-30 w-full px-4"
        onMouseEnter={() => {
          if (!isModalDisabled && hoverTimeout) clearTimeout(hoverTimeout);
          if (!isModalDisabled) setIsActionModalOpen(true);
        }}
        onMouseLeave={() => {
          if (!isModalDisabled) {
            const timeout = setTimeout(() => setIsActionModalOpen(false), 300);
            setHoverTimeout(timeout);
          }
        }}
      >
        {/* Action Bar */}
        <div
          className="bg-[#800000] text-white py-2 md:py-3 px-4 md:px-6 rounded-full shadow-lg cursor-pointer max-w-md mx-auto"
          onClick={() => {
            setIsActionModalOpen(true);
            setIsModalDisabled(false);
          }}
        >
          <div className="flex justify-center space-x-1 md:space-x-2 text-xs md:text-sm">
            <span className="hidden sm:inline">Programme</span>
            <span className="sm:hidden">Prog</span>
            <span className="text-[hsl(332,51%,70%)]">|</span>
            <span className="hidden sm:inline">Calendar</span>
            <span className="sm:hidden">Cal</span>
            <span className="text-[hsl(332,51%,70%)]">|</span>
            <span className="hidden md:inline">Get Direction</span>
            <span className="sm:inline md:hidden">Direction</span>
          </div>
        </div>

        {/* Modal */}
        <ActionModal
          isOpen={isActionModalOpen}
          onClose={() => {
            if (hoverTimeout) clearTimeout(hoverTimeout);
            setIsActionModalOpen(false);
          }}
          onItemClicked={() => {
            setIsModalDisabled(true);
          }}
        />
      </div>

      <Footer />
    </div>
  );
}
