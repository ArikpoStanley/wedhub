"use client";

import { ScrollFade } from "@/components/scroll-fade";
import { Clock, MapPin, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";

import ConfettiBackground from "@/components/confetti-background";
import ConfettiBurst from "@/components/confetti-burst";
import NavigationBar from "@/components/navigation-bar";
import Footer from "@/components/footer";
import { useWeddingSite } from "@/context/site-context";

function EventBlock({
  indexLabel,
  title,
  description,
  dateDisplay,
  time,
  rsvpPhone,
  location,
}: {
  indexLabel: string;
  title: string;
  description?: string;
  dateDisplay?: string;
  time?: string;
  rsvpPhone?: string;
  location?: string;
}) {
  return (
    <div className="mb-12 last:mb-0">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-[var(--w-primary)] rounded-full flex items-center justify-center text-white font-bold text-lg">
          {indexLabel}
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-[var(--w-primary)] uppercase tracking-wide">{title}</h2>
      </div>

      {description ? (
        <p className="text-[var(--w-primary)] mb-6 text-lg whitespace-pre-line">{description}</p>
      ) : (
        <p className="text-gray-400 mb-6 text-sm">Add a description in Admin → Setup (Schedule & quick links).</p>
      )}

      <hr className="border-[var(--w-primary)] mb-6" />

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 border-2 border-[var(--w-primary)] rounded-full flex items-center justify-center flex-shrink-0">
            <Clock className="h-5 w-5 text-[var(--w-primary)]" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-[var(--w-accent)] mb-1">Date</h3>
            <p className="text-[var(--w-primary)] font-medium">{dateDisplay?.trim() || "—"}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 border-2 border-[var(--w-primary)] rounded-full flex items-center justify-center flex-shrink-0">
            <Clock className="h-5 w-5 text-[var(--w-primary)]" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-[var(--w-accent)] mb-1">Time</h3>
            <p className="text-[var(--w-primary)] font-medium">{time?.trim() || "—"}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 border-2 border-[var(--w-primary)] rounded-full flex items-center justify-center flex-shrink-0">
            <Phone className="h-5 w-5 text-[var(--w-primary)]" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-[var(--w-accent)] mb-1">RSVP</h3>
            <p className="text-[var(--w-primary)] font-medium whitespace-pre-line">{rsvpPhone?.trim() || "—"}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 border-2 border-[var(--w-primary)] rounded-full flex items-center justify-center flex-shrink-0">
            <MapPin className="h-5 w-5 text-[var(--w-primary)]" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-[var(--w-accent)] mb-1">Location</h3>
            <p className="text-[var(--w-primary)] font-medium whitespace-pre-line">{location?.trim() || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Schedule() {
  const ws = useWeddingSite();
  const c = ws.site?.content;
  const bgUrl = c?.schedulePageBackgroundImageUrl?.trim();

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-no-repeat bg-[var(--w-bg)]"
      style={
        bgUrl
          ? {
              backgroundImage: `linear-gradient(color-mix(in srgb, var(--w-bg) 82%, transparent), color-mix(in srgb, var(--w-bg) 88%, transparent)), url('${bgUrl}')`,
            }
          : undefined
      }
    >
      <ConfettiBackground />
      <ConfettiBurst />

      <NavigationBar currentPage="schedule" />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <section className="mb-20">
          <ScrollFade className="mx-auto max-w-4xl" y={28} duration={0.72}>
            <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-20">
                <svg width="120" height="120" viewBox="0 0 120 120" className="text-[var(--w-accent)] opacity-40">
                  <path
                    d="M30 40 L30 80 L35 85 L35 95 L25 95 L25 100 L35 100 L35 95 L45 95 L45 85 L50 80 L50 40 Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <path
                    d="M70 40 L70 80 L75 85 L75 95 L65 95 L65 100 L75 100 L75 95 L85 95 L85 85 L90 80 L90 40 Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <path d="M25 35 L55 35" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M65 35 L95 35" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>

              <EventBlock
                indexLabel="01"
                title={c?.ceremonyTitle?.trim() || "Wedding ceremony"}
                description={c?.ceremonyDescription}
                dateDisplay={c?.ceremonyDateDisplay}
                time={c?.ceremonyTime}
                rsvpPhone={c?.ceremonyRsvpPhone}
                location={c?.ceremonyLocation}
              />

              <EventBlock
                indexLabel="02"
                title={c?.receptionTitle?.trim() || "Reception"}
                description={c?.receptionDescription}
                dateDisplay={c?.receptionDateDisplay}
                time={c?.receptionTime}
                rsvpPhone={c?.receptionRsvpPhone}
                location={c?.receptionLocation}
              />
            </Card>
          </ScrollFade>
        </section>
      </div>

      <Footer />
    </div>
  );
}
