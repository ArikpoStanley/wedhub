import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import MobileMenu from "@/components/mobile-menu";
import CountdownTimer from "@/components/countdown-timer";
import ConfettiBackground from "@/components/confetti-background";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, navigate] = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'our-story') {
      navigate('/our-story');
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { label: "Home", href: "home" },
    { label: "Our Story", href: "our-story" },
    { label: "Gallery", href: "gallery" },
    { label: "Registry", href: "registry" },
    { label: "RSVP", href: "rsvp" },
    { label: "Schedule", href: "schedule" }
  ];

  const weddingPhotos = [
    {
      src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000",
      alt: "Elegant wedding couple portrait"
    },
    {
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000",
      alt: "Bride and groom dancing"
    },
    {
      src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000",
      alt: "Wedding couple in white formal wear"
    },
    {
      src: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000",
      alt: "Couple sharing romantic moment"
    },
    {
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000",
      alt: "Wedding rings on floral background"
    },
    {
      src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000",
      alt: "Wedding bouquet with roses"
    },
    {
      src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000",
      alt: "Wedding ceremony setup"
    },
    {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000",
      alt: "Groom in formal suit"
    }
  ];

  return (
    <div className="min-h-screen bg-rose-50 relative">
      <ConfettiBackground />
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigationItems={navigationItems}
        onNavigate={scrollToSection}
      />

      {/* Header Navigation */}
      <header className="fixed top-0 w-full bg-rose-50/90 backdrop-blur-md z-40 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo/Monogram */}
            <div className="w-12 h-12 bg-[hsl(342,69%,29%)] rounded-full flex items-center justify-center">
              <span className="text-white font-script text-xl font-bold">O&J</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-[hsl(342,69%,29%)] hover:text-[hsl(342,60%,40%)] font-serif font-medium transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => navigate('/our-story')}
                className="text-[hsl(342,69%,29%)] hover:text-[hsl(342,60%,40%)] font-serif font-medium transition-colors"
              >
                Our Story
              </button>
              <button 
                onClick={() => scrollToSection('gallery')}
                className="text-[hsl(342,69%,29%)] hover:text-[hsl(342,60%,40%)] font-serif font-medium transition-colors"
              >
                Gallery
              </button>
            </nav>

            {/* Right Navigation */}
            <div className="hidden lg:flex space-x-6">
              <button 
                onClick={() => scrollToSection('registry')}
                className="text-[hsl(342,69%,29%)] hover:text-[hsl(342,60%,40%)] font-serif font-medium transition-colors"
              >
                Registry
              </button>
              <button 
                onClick={() => scrollToSection('schedule')}
                className="text-[hsl(342,69%,29%)] hover:text-[hsl(342,60%,40%)] font-serif font-medium transition-colors"
              >
                Schedule
              </button>
              <button 
                onClick={() => scrollToSection('rsvp')}
                className="text-[hsl(342,69%,29%)] hover:text-[hsl(342,60%,40%)] font-serif font-medium transition-colors"
              >
                RSVP
              </button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-[hsl(342,69%,29%)]"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20 relative">
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
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: -2 }}
          >
            💖
          </motion.div>
          <motion.div 
            className="absolute bottom-1/3 left-1/3 text-[hsl(332,51%,70%)] text-lg"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: -4 }}
          >
            💝
          </motion.div>
        </div>

        {/* Countdown Timer */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <CountdownTimer targetDate="2025-08-02T00:00:00" />
        </motion.div>

        {/* Main Heading */}
        <motion.div 
          className="max-w-4xl mx-auto mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-4">
            <span className="text-[hsl(332,51%,70%)]">CELEBRATE</span>
            <span className="text-[hsl(342,69%,29%)]"> LOVE</span><span className="text-[hsl(332,51%,70%)]">,</span>
            <br />
            <span className="text-[hsl(342,69%,29%)]">CELEBRATE LIFE</span>
            <br />
            <span className="text-[hsl(332,51%,70%)]">WITH GRATITUDE</span>
          </h1>
          
          {/* Couple Names */}
          <div className="text-6xl md:text-8xl font-script text-[hsl(342,69%,29%)] mt-8">
            Olufunbi <span className="text-[hsl(332,51%,70%)]">&</span> Joseph
          </div>
        </motion.div>

        {/* Decorative Heart */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="w-12 h-12 bg-[hsl(342,69%,29%)] rounded-full flex items-center justify-center">
            <Heart className="text-white text-xl fill-current" />
          </div>
        </motion.div>
      </section>

      {/* Stripe Decoration */}
      <div className="stripe-pattern w-full"></div>

      {/* Photo Gallery Section */}
      <section id="gallery" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {weddingPhotos.slice(0, 3).map((photo, index) => (
              <motion.div 
                key={index}
                className="group overflow-hidden rounded-xl shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img 
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="our-story" className="py-20 bg-rose-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile Image */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300" 
                alt="Beautiful wedding couple portrait" 
                className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg border-4 border-white" 
              />
            </motion.div>

            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-serif text-[hsl(342,69%,29%)] mb-6">
                Our journey is a beautiful tapestry, carefully woven by God
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                Every beautiful moment, every step from the start, His hand has guided us, His grace has sustained us, 
                and His love has brought us here. What began as a simple connection has grown into a love filled with 
                purpose, joy, and countless blessings. As we step into forever, we celebrate all that He has done and 
                all that is yet to come.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-script text-[hsl(342,69%,29%)]">Olufunbi & Joseph</h3>
                <h4 className="text-xl font-serif text-gray-800">Two hearts. One divine journey.</h4>
                <p className="text-gray-700 leading-relaxed">
                  Joseph and Tireni are proof that when love is led by faith, it becomes something extraordinary. 
                  From the moment their paths crossed, it was clear that God was writing a story bigger than either of them imagined.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Individually, they are driven, passionate, and full of purpose. Together, they are a reflection of grace, 
                  laughter, deep friendship, and unwavering love — partners in life, faith, and the beautiful future ahead.
                </p>
                <Button 
                  onClick={() => scrollToSection('schedule')}
                  className="bg-[hsl(342,69%,29%)] text-white px-8 py-3 rounded-full font-medium hover:bg-[hsl(342,60%,40%)] transition-colors"
                >
                  Read Our Story
                </Button>
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                {weddingPhotos.slice(3, 7).map((photo, index) => (
                  <img 
                    key={index}
                    src={photo.src}
                    alt={photo.alt}
                    className="rounded-xl shadow-lg w-full h-40 object-cover hover:scale-105 transition-transform duration-300" 
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Invitation Section */}
      <section id="registry" className="py-20 bg-white">
        <motion.div 
          className="container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-serif text-[hsl(342,69%,29%)] mb-8">
            We want to share this precious moment with you
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Join us as we say "I do" and begin this beautiful new chapter together. 
            We can't wait for you to celebrate with us on August 2nd, 2025!
          </p>
          <Button 
            onClick={() => scrollToSection('schedule')}
            className="bg-[hsl(332,51%,70%)] text-white px-12 py-4 rounded-full text-lg font-medium hover:bg-[hsl(332,60%,50%)] transition-colors shadow-lg"
          >
            Wedding Info
          </Button>
        </motion.div>
      </section>

      {/* Additional Photo Gallery */}
      <section id="schedule" className="py-16 bg-rose-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-5 gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="col-span-2 row-span-2">
              <img 
                src={weddingPhotos[2].src}
                alt={weddingPhotos[2].alt}
                className="w-full h-full object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300" 
              />
            </div>
            {weddingPhotos.slice(0, 3).map((photo, index) => (
              <img 
                key={index}
                src={photo.src}
                alt={photo.alt}
                className="w-full h-32 md:h-40 object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300" 
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Hashtag Section */}
      <section id="rsvp" className="py-12 bg-[hsl(342,69%,29%)] text-white overflow-hidden">
        <div className="relative">
          <motion.div 
            className="flex space-x-8 whitespace-nowrap text-2xl font-script"
            animate={{ x: [0, -100] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 20 }, (_, i) => (
              <span key={i} className="inline-block">
                ● Love like this ● #lovelikethis ● #FJO2025 ●
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[hsl(342,69%,29%)] text-white py-3 z-30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center space-x-2 text-sm md:text-base">
            <button 
              onClick={() => scrollToSection('schedule')}
              className="hover:text-[hsl(332,51%,70%)] transition-colors"
            >
              Programme
            </button>
            <span className="text-[hsl(332,51%,70%)]">|</span>
            <button 
              onClick={() => scrollToSection('schedule')}
              className="hover:text-[hsl(332,51%,70%)] transition-colors"
            >
              Calendar
            </button>
            <span className="text-[hsl(332,51%,70%)]">|</span>
            <button 
              onClick={() => scrollToSection('rsvp')}
              className="hover:text-[hsl(332,51%,70%)] transition-colors"
            >
              Get Direction
            </button>
            <span className="text-[hsl(332,51%,70%)]">|</span>
            <button 
              onClick={() => scrollToSection('rsvp')}
              className="hover:text-[hsl(332,51%,70%)] transition-colors"
            >
              Check Table No.
            </button>
          </div>
        </div>
      </div>

      {/* Padding for bottom bar */}
      <div className="h-16"></div>
    </div>
  );
}
