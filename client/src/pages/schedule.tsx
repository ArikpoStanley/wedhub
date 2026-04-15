import { motion } from "framer-motion";
import { Heart, ArrowLeft, MapPin, Clock, Phone, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

import ConfettiBackground from "@/components/confetti-background";
import ConfettiBurst from "@/components/confetti-burst";
import NavigationBar from "@/components/navigation-bar";
import Footer from "@/components/footer";

export default function Schedule() {

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 241, 242, 0.8), rgba(255, 241, 242, 0.8)), url('https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&h=600')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <ConfettiBackground />
      <ConfettiBurst />

      <NavigationBar currentPage="schedule" />

      <div className="container mx-auto px-4 py-8 md:py-12">




        {/* Event Details Section */}
        <section className="mb-20">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl relative overflow-hidden">
              {/* Decorative champagne glasses illustration */}
              <div className="absolute top-4 right-4 opacity-20">
                <svg width="120" height="120" viewBox="0 0 120 120" className="text-rose-300">
                  <path d="M30 40 L30 80 L35 85 L35 95 L25 95 L25 100 L35 100 L35 95 L45 95 L45 85 L50 80 L50 40 Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
                  <path d="M70 40 L70 80 L75 85 L75 95 L65 95 L65 100 L75 100 L75 95 L85 95 L85 85 L90 80 L90 40 Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
                  <path d="M25 35 L55 35" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M65 35 L95 35" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>

              {/* Wedding Ceremony Section */}
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[hsl(342,69%,29%)] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    01
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-[hsl(342,69%,29%)] uppercase tracking-wide">
                    WEDDING CEREMONY
                  </h2>
                </div>

                <p className="text-[hsl(342,69%,29%)] mb-6 text-lg">
                  Join us as we take our vows. Please arrive 15 minutes early to be seated before the ceremony begins
                </p>

                <hr className="border-[hsl(342,69%,29%)] mb-6" />

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border-2 border-[hsl(342,69%,29%)] rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-[hsl(342,69%,29%)]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-rose-400 mb-1">Date</h3>
                      <p className="text-[hsl(342,69%,29%)] font-medium">18th April 2026</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border-2 border-[hsl(342,69%,29%)] rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-[hsl(342,69%,29%)]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-rose-400 mb-1">Time</h3>
                      <p className="text-[hsl(342,69%,29%)] font-medium">09:00AM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border-2 border-[hsl(342,69%,29%)] rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-[hsl(342,69%,29%)]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-rose-400 mb-1">RSVP</h3>
                      <p className="text-[hsl(342,69%,29%)] font-medium">+234 905 896 8649</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border-2 border-[hsl(342,69%,29%)] rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-[hsl(342,69%,29%)]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-rose-400 mb-1">Location</h3>
                      <p className="text-[hsl(342,69%,29%)] font-medium">Aquila Events Hub, No 40 Tos Benson Road</p>
                      <p className="text-[hsl(342,69%,29%)] font-medium">Ikorodu Ikorodu, Lagos 100001</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reception Celebration Section */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[hsl(342,69%,29%)] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    02
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-[hsl(342,69%,29%)] uppercase tracking-wide">
                    RECEPTION CELEBRATION
                  </h2>
                </div>

                <p className="text-[hsl(342,69%,29%)] mb-6 text-lg">
                  Join us as we celebrate our love.
                </p>

                <hr className="border-[hsl(342,69%,29%)] mb-6" />

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border-2 border-[hsl(342,69%,29%)] rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-[hsl(342,69%,29%)]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-rose-400 mb-1">Date</h3>
                      <p className="text-[hsl(342,69%,29%)] font-medium">18th April 2026</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border-2 border-[hsl(342,69%,29%)] rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-[hsl(342,69%,29%)]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-rose-400 mb-1">Time</h3>
                      <p className="text-[hsl(342,69%,29%)] font-medium">01:00PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border-2 border-[hsl(342,69%,29%)] rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-[hsl(342,69%,29%)]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-rose-400 mb-1">RSVP</h3>
                      <p className="text-[hsl(342,69%,29%)] font-medium">+234 905 896 8649</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border-2 border-[hsl(342,69%,29%)] rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-[hsl(342,69%,29%)]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-rose-400 mb-1">Location</h3>
                      <p className="text-[hsl(342,69%,29%)] font-medium">Aquila Events Hub, No 40 Tos Benson Road</p>
                      <p className="text-[hsl(342,69%,29%)] font-medium">Ikorodu Ikorodu, Lagos 100001</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>
      </div>

      <Footer />
    </div>
  );
}