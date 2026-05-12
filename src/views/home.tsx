"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import CountdownTimer from "@/components/countdown-timer";
import ConfettiBackground from "@/components/confetti-background";
import ConfettiBurst from "@/components/confetti-burst";
import NavigationBar from "@/components/navigation-bar";
import Footer from "@/components/footer";
import ActionModal from "@/components/action-modal";
import { useWeddingSite } from "@/context/site-context";
import { paletteFromTheme } from "@shared/wedding-palette";
import { DressCodeChips } from "@/components/dress-code-chips";
import { LiquidGlassCoverFlow } from "@/components/liquid-glass-cover-flow";
import { ScrollFade } from "@/components/scroll-fade";
import { SectionWaveDivider } from "@/components/section-wave";
import { resolveHomeHeroBackgroundImageUrl } from "@shared/resolve-home-hero";

/** First sentence or short lead for editorial pull-quote + remainder. */
function splitStoryLead(body: string): { storyLead: string; storyRest: string } {
  const t = body.trim();
  if (!t) return { storyLead: "", storyRest: "" };
  const sentence = t.match(/^(.{10,280}?[.!?])(?:\s+)([\s\S]+)$/);
  if (sentence?.[1] && sentence[2]) {
    return { storyLead: sentence[1].trim(), storyRest: sentence[2].trim() };
  }
  if (t.length <= 160) return { storyLead: t, storyRest: "" };
  return { storyLead: `${t.slice(0, 140).trim()}…`, storyRest: t.slice(140).trim() };
}

export default function Home() {
  const ws = useWeddingSite();
  const reducedMotion = useReducedMotion();
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isModalDisabled, setIsModalDisabled] = useState(false);
  const [heroParallax, setHeroParallax] = useState({ x: 0, y: 0 });

  const weddingPhotos = useMemo(() => {
    const urls = ws.site?.content?.galleryImageUrls?.filter(Boolean) ?? [];
    const label =
      ws.site?.content?.coupleDisplayName ||
      [ws.site?.partnerOneName, ws.site?.partnerTwoName].filter(Boolean).join(" & ") ||
      "Wedding gallery";
    return urls.map((src, i) => ({ src, alt: `${label} — photo ${i + 1}` }));
  }, [ws.site]);

  const coupleDisplayName =
    ws.site?.content?.coupleDisplayName ||
    [ws.site?.partnerOneName, ws.site?.partnerTwoName].filter(Boolean).join(" & ") ||
    "";

  const heroLine1 = ws.site?.content?.heroHeadingLine1?.trim() ?? "";
  const heroLine2 = ws.site?.content?.heroHeadingLine2?.trim() ?? "";
  const storyHeading = ws.site?.content?.storyHeading?.trim() ?? "";
  const storyBody = ws.site?.content?.storyBody?.trim() ?? "";

  const firstHeroUrl = ws.site?.content?.heroImageUrls?.find(Boolean) ?? weddingPhotos[0]?.src ?? null;
  const heroBgUrl = useMemo(
    () => resolveHomeHeroBackgroundImageUrl(ws.site?.content) ?? null,
    [ws.site?.content?.homeHeroBackgroundImageUrl, ws.site?.content?.heroImageUrls, ws.site?.content?.galleryImageUrls]
  );

  const heroWatermarkText = useMemo(() => {
    const t = ws.site?.tagline?.trim();
    if (t && t.length >= 8 && t.length <= 48) return t.toUpperCase();
    return "We're getting married";
  }, [ws.site?.tagline]);

  const onHeroPointer = useCallback(
    (clientX: number, clientY: number, rect: DOMRect) => {
      if (reducedMotion) return;
      const px = (clientX - rect.left) / rect.width - 0.5;
      const py = (clientY - rect.top) / rect.height - 0.5;
      setHeroParallax({ x: px * 20, y: py * 14 });
    },
    [reducedMotion]
  );

  const weddingDateLabel = useMemo(() => {
    if (!ws.site?.weddingDate) return null;
    const d = new Date(ws.site.weddingDate);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [ws.site?.weddingDate]);

  const { storyLead, storyRest } = useMemo(() => splitStoryLead(storyBody), [storyBody]);

  const countdownTarget = useMemo(() => {
    if (!ws.site?.weddingDate) return null;
    const d = new Date(ws.site.weddingDate);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 19);
  }, [ws.site?.weddingDate]);

  const carouselPhotos =
    weddingPhotos.length >= 2
      ? [...weddingPhotos.slice(2), ...weddingPhotos.slice(0, 2)]
      : [...weddingPhotos];
  /** Long enough strip to fill wide screens, then duplicated for translateX(-50%) marquee. */
  const loopingCarouselPhotos = useMemo(() => {
    if (carouselPhotos.length === 0) return [];
    const single: (typeof carouselPhotos)[number][] = [];
    const targetMin = Math.max(16, carouselPhotos.length * 4);
    for (let i = 0; i < targetMin; i++) {
      single.push(carouselPhotos[i % carouselPhotos.length]);
    }
    return [...single, ...single];
  }, [carouselPhotos]);

  const palette = useMemo(() => paletteFromTheme(ws.site?.theme), [ws.site?.theme]);
  const content = ws.site?.content;
  const actionBarProgramme = content?.actionBarProgrammeLabel?.trim() || "Programme";
  const actionBarCalendar = content?.actionBarCalendarLabel?.trim() || "Calendar";
  const actionBarDirections = content?.actionBarDirectionsLabel?.trim() || "Get Direction";
  const actionBarDirectionsShort = content?.actionBarDirectionsLabel?.trim() || "Direction";

  const actionLinks = useMemo(
    () => ({
      mapsDirectionsUrl: content?.mapsDirectionsUrl?.trim() || content?.ceremonyDirectionsUrl?.trim(),
      calendarGoogleUrlOverride: content?.calendarGoogleUrlOverride,
      calendarEventTitle: content?.calendarEventTitle,
      calendarEventDescription: content?.calendarEventDescription,
      calendarEventLocation: content?.calendarEventLocation,
      calendarStartIso: content?.calendarStartIso,
      calendarEndIso: content?.calendarEndIso,
      orderOfServiceUrl: content?.orderOfServiceUrl,
      weddingDate: ws.site?.weddingDate ? new Date(ws.site.weddingDate) : null,
    }),
    [content, ws.site?.weddingDate]
  );

  const venueName = ws.site?.content?.venueName?.trim() ?? "";
  const venueAddress = ws.site?.content?.venueAddress?.trim() ?? "";
  const showVenueOrColours =
    Boolean(venueName || venueAddress) || palette.dressCode.length > 0;

  return (
    <div className="min-h-screen relative bg-[var(--w-bg)]">
      <ConfettiBackground />
      <ConfettiBurst />

      {ws.loading && ws.tenantSlug ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--w-bg)]/90 text-[var(--w-primary)] text-xl">
          Loading your celebration…
        </div>
      ) : null}
      {ws.error && ws.tenantSlug ? (
        <div className="bg-[color-mix(in_srgb,var(--w-accent)_28%,var(--w-bg))] text-[var(--w-primary)] text-center py-3 px-4 text-sm">
          {ws.error}
        </div>
      ) : null}

      <NavigationBar currentPage="home" />

      {/* Full-bleed photography hero */}
      <section
        id="home"
        className="relative flex min-h-[88vh] min-h-[90dvh] flex-col"
        onMouseMove={(e) => onHeroPointer(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect())}
        onMouseLeave={() => {
          if (!reducedMotion) setHeroParallax({ x: 0, y: 0 });
        }}
      >
        {heroBgUrl ? (
          <div
            className={cn("absolute inset-0 overflow-hidden", !reducedMotion && "animate-ken-burns")}
            aria-hidden
          >
            <img
              src={heroBgUrl}
              alt=""
              className="pointer-events-none h-full w-full object-cover object-[center_24%]"
            />
          </div>
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-[var(--w-bg)] via-[color-mix(in_srgb,var(--w-accent)_14%,var(--w-bg))] to-[var(--w-bg)]"
            aria-hidden
          />
        )}
        {/* Single dark scrim only (no cream / page-bg mix) so the photo stays sharp — text still reads on top. */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/50"
          aria-hidden
        />

        <div className="relative z-10 flex flex-1 flex-col px-4 pb-10 pt-20 md:pt-24">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <p
              className="absolute left-1/2 top-[34%] max-w-[min(100vw,56rem)] px-4 text-center font-sans text-[clamp(1.75rem,9.5vw,5.25rem)] font-semibold uppercase leading-[1.05] tracking-[-0.02em] text-white/35 antialiased motion-reduce:transform-none md:top-[36%] md:text-white/40 [text-shadow:0_3px_28px_rgba(0,0,0,0.75),0_0_2px_rgba(0,0,0,0.35)]"
              style={{
                transform: reducedMotion
                  ? "translate(-50%, -50%)"
                  : `translate(calc(-50% + ${heroParallax.x * 0.4}px), calc(-50% + ${heroParallax.y * 0.35}px))`,
              }}
            >
              {heroWatermarkText}
            </p>
          </div>

          <div className="relative z-[1] mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-2 text-center">
            <motion.p
              className="mb-3 text-[10px] font-medium uppercase tracking-[0.4em] text-white/90 antialiased [text-shadow:0_2px_14px_rgba(0,0,0,0.65)]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.6 }}
            >
              Save the date
            </motion.p>
            {weddingDateLabel ? (
              <motion.p
                className="mb-8 font-serif text-lg leading-snug text-white antialiased [text-shadow:0_2px_18px_rgba(0,0,0,0.6)] md:text-2xl"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : 0.08 }}
              >
                {weddingDateLabel}
              </motion.p>
            ) : null}

            <motion.div
              className="mb-6 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : 0.12 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-[var(--w-primary)]/90 shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
                <Heart className="h-4 w-4 fill-current text-white" aria-hidden />
              </div>
            </motion.div>

            <motion.div
              className="max-w-3xl space-y-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : 0.18 }}
            >
              {heroLine1 || heroLine2 ? (
                <h1 className="flex flex-col gap-2 font-serif text-3xl leading-[1.18] tracking-tight text-white antialiased md:gap-3 md:text-5xl md:leading-[1.15] lg:text-6xl [text-shadow:0_2px_24px_rgba(0,0,0,0.72)]">
                  {heroLine1 ? <span className="text-[var(--w-accent)]">{heroLine1}</span> : null}
                  {heroLine2 ? <span className="text-white">{heroLine2}</span> : null}
                </h1>
              ) : (
                <p className="text-base text-white/85 md:text-lg [text-shadow:0_2px_16px_rgba(0,0,0,0.55)]">
                  Add hero lines in <strong className="text-white">Admin → Setup</strong> (Date &amp; hero).
                </p>
              )}
            </motion.div>

            <motion.div
              className="mt-9 max-w-[min(100%,28rem)] font-script text-4xl leading-tight text-white antialiased sm:text-5xl md:mt-10 md:text-6xl [text-shadow:0_2px_18px_rgba(0,0,0,0.65)]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.85, delay: reducedMotion ? 0 : 0.28 }}
            >
              {coupleDisplayName || (
                <span className="font-sans text-xl font-normal text-white/70 md:text-2xl">
                  Your names will appear after setup
                </span>
              )}
            </motion.div>
          </div>

          <motion.div
            className="relative z-10 mx-auto mt-auto flex w-full max-w-3xl justify-center px-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : 0.35 }}
          >
            <CountdownTimer targetDate={countdownTarget} variant="hero" />
          </motion.div>
        </div>

        <SectionWaveDivider
          className="relative z-20 -mb-px shrink-0"
          fillClassName="text-[color-mix(in_srgb,var(--w-bg)_92%,white)]"
        />
      </section>

      <nav
        className="relative z-20 border-b border-[var(--w-border-soft)] bg-[color-mix(in_srgb,var(--w-bg)_92%,white)]/95 py-2.5 backdrop-blur-md"
        aria-label="On this page"
      >
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-2 px-3 text-xs font-medium uppercase tracking-widest text-[var(--w-primary)] sm:gap-4 sm:text-[11px]">
          <button
            type="button"
            className="rounded-full px-3 py-1.5 transition hover:bg-[var(--w-border-soft)]"
            onClick={() => document.getElementById("our-story")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" })}
          >
            Story
          </button>
          <span className="text-[var(--w-accent)] opacity-50">·</span>
          <button
            type="button"
            className="rounded-full px-3 py-1.5 transition hover:bg-[var(--w-border-soft)]"
            onClick={() => document.getElementById("gallery-strip")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" })}
          >
            Filmstrip
          </button>
          <span className="text-[var(--w-accent)] opacity-50">·</span>
          <button
            type="button"
            className="rounded-full px-3 py-1.5 transition hover:bg-[var(--w-border-soft)]"
            onClick={() => document.getElementById("gallery-editorial")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" })}
          >
            Moments
          </button>
          <span className="text-[var(--w-accent)] opacity-50">·</span>
          <button
            type="button"
            className="rounded-full px-3 py-1.5 transition hover:bg-[var(--w-border-soft)]"
            onClick={() => document.getElementById("details")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" })}
          >
            Details
          </button>
        </div>
      </nav>

      <div className="stripe-pattern w-full" />

      {/* Filmstrip gallery */}
      <section
        id="gallery-strip"
        className="overflow-hidden bg-[color-mix(in_srgb,white_94%,var(--w-bg))] py-12 md:py-16"
      >
        <ScrollFade y={22} duration={0.62} className="space-y-8 md:space-y-10">
          <div className="container mx-auto mb-8 max-w-3xl px-4 text-center md:mb-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--w-primary)]">In motion</p>
            <h2 className="mt-2 font-serif text-2xl text-[var(--w-primary)] md:text-4xl">Our celebration</h2>
            <p className="mt-2 text-sm text-gray-600">
              Swipe or scroll sideways — each frame is a different crop and rhythm.
            </p>
          </div>
          <div className="relative overflow-x-hidden">
            {loopingCarouselPhotos.length > 0 ? (
              <div
                className={cn(
                  "flex gap-5 md:gap-8",
                  reducedMotion ? "flex-wrap justify-center px-4 pb-2" : "w-max animate-scroll will-change-transform"
                )}
              >
                {loopingCarouselPhotos.map((photo, index) => {
                  const sizes = [
                    "w-[17.5rem] h-[26rem] md:w-[20rem] md:h-[28rem]",
                    "w-[12.5rem] h-[26rem] md:w-[14rem] md:h-[28rem]",
                    "w-[22rem] h-[22rem] md:w-[26rem] md:h-[24rem]",
                    "w-[15rem] h-[26rem] md:w-[17rem] md:h-[28rem]",
                  ];
                  return (
                    <div
                      key={`filmstrip-${index}`}
                      className={cn(
                        "group relative flex-shrink-0 overflow-hidden rounded-lg shadow-xl ring-1 ring-black/5",
                        sizes[index % sizes.length]
                      )}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading="lazy"
                        className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mx-auto max-w-2xl rounded-lg border border-dashed border-[var(--w-border-soft)] bg-[color-mix(in_srgb,var(--w-bg)_94%,var(--w-primary))] px-4 py-20 text-center text-gray-500">
                <p>
                  No gallery images yet. Upload photos in <strong>Admin → Setup</strong> (Photos step).
                </p>
              </div>
            )}
          </div>
        </ScrollFade>
      </section>

      {/* Editorial bento + statement image */}
      {weddingPhotos.length >= 3 ? (
        <>
          <section id="gallery-editorial" className="bg-[var(--w-bg)] py-14 md:py-20">
            <ScrollFade y={24} duration={0.62} className="container mx-auto px-4">
              <header className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
                <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--w-primary)]">
                  From our lens
                </p>
                <h2 className="mt-2 font-serif text-3xl text-[var(--w-primary)] md:text-4xl">Editorial moments</h2>
                <p className="mt-2 text-sm text-gray-600">
                  A slower layout to linger on a few favourite frames.
                </p>
              </header>
              <div className="mx-auto grid max-w-6xl grid-cols-12 gap-3 md:grid-rows-2 md:gap-4">
                <div className="relative col-span-12 min-h-[min(72vw,22rem)] overflow-hidden rounded-2xl shadow-lg md:col-span-8 md:row-span-2 md:min-h-[28rem]">
                  <img
                    src={weddingPhotos[0]!.src}
                    alt={weddingPhotos[0]!.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
                  />
                </div>
                <div className="relative col-span-6 min-h-[11rem] overflow-hidden rounded-xl shadow-md md:col-span-4 md:col-start-9 md:row-start-1 md:min-h-0 md:h-full">
                  <img
                    src={weddingPhotos[1]!.src}
                    alt={weddingPhotos[1]!.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                </div>
                <div className="relative col-span-6 min-h-[11rem] overflow-hidden rounded-xl shadow-md md:col-span-4 md:col-start-9 md:row-start-2 md:min-h-0 md:h-full">
                  <img
                    src={weddingPhotos[2]!.src}
                    alt={weddingPhotos[2]!.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                </div>
              </div>
            </ScrollFade>
          </section>
          {weddingPhotos[3] ? (
            <section className="bg-[color-mix(in_srgb,white_96%,var(--w-bg))] py-2 md:py-4" aria-label="Featured photograph">
              <ScrollFade fadeOnly duration={0.7} className="relative mx-auto max-h-[min(78vh,40rem)] w-full overflow-hidden">
                <img
                  src={weddingPhotos[3]!.src}
                  alt={weddingPhotos[3]!.alt}
                  loading="lazy"
                  className="max-h-[min(78vh,40rem)] w-full object-cover object-center"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
              </ScrollFade>
            </section>
          ) : null}
        </>
      ) : null}

      <div className="stripe-pattern w-full" />

      {/* Our Story Section */}
      <section id="our-story" className="py-20 bg-[var(--w-bg)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile Image */}

            <ScrollFade
              className="mb-12 text-center md:mb-16"
              y={24}
              delay={0.06}
              duration={0.72}
            >
              {storyHeading || storyBody ? (
                <>
                  <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--w-primary)]">
                    Our story
                  </p>
                  {storyHeading ? (
                    <h2 className="mt-3 font-serif text-3xl text-[var(--w-primary)] md:text-4xl lg:text-5xl">
                      {storyHeading}
                    </h2>
                  ) : storyBody ? (
                    <h2 className="mt-3 font-serif text-3xl text-[var(--w-primary)] md:text-4xl lg:text-5xl">
                      A word from us
                    </h2>
                  ) : null}
                </>
              ) : (
                <p className="text-center text-gray-500">
                  Your story will appear here after you add it in <strong>Admin → Setup</strong> (Story &amp; details).
                </p>
              )}
            </ScrollFade>

            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14 lg:gap-16">
              <ScrollFade
                className="relative mx-auto w-full max-w-sm md:order-2"
                x={reducedMotion ? 0 : 28}
                y={0}
                duration={0.72}
              >
                <div className="relative rotate-1 rounded-sm bg-white p-3 pb-10 shadow-2xl ring-1 ring-black/10 motion-reduce:rotate-0">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[color-mix(in_srgb,var(--w-accent)_10%,white)]">
                    {firstHeroUrl ? (
                      <img
                        src={firstHeroUrl}
                        alt={coupleDisplayName || "Couple"}
                        loading="lazy"
                        className="h-full w-full object-cover object-[center_15%]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-4 text-center text-xs text-[var(--w-accent)]">
                        Upload hero photos or pick a home hero image in Admin → Setup (Photos).
                      </div>
                    )}
                  </div>
                  <p className="mt-4 text-center font-script text-xl text-[var(--w-primary)] md:text-2xl">
                    {coupleDisplayName || "Your names"}
                  </p>
                </div>
              </ScrollFade>

              <ScrollFade
                className="space-y-6 md:order-1"
                x={reducedMotion ? 0 : -28}
                y={0}
                duration={0.72}
              >
                <div className="text-2xl text-[var(--w-primary)]" aria-hidden>
                  💍
                </div>
                <h3 className="font-script text-3xl text-[var(--w-primary)] md:text-4xl">
                  {coupleDisplayName || (
                    <span className="font-sans text-xl font-normal text-gray-400">Your names</span>
                  )}
                </h3>
                {ws.site?.tagline?.trim() ? (
                  <p className="font-serif text-lg italic text-gray-700 md:text-xl">{ws.site.tagline}</p>
                ) : null}
                {storyLead ? (
                  <blockquote className="border-l-4 border-[var(--w-accent)] pl-5 font-serif text-xl leading-snug text-[var(--w-primary)] md:text-2xl">
                    {storyLead}
                  </blockquote>
                ) : null}
                {storyRest ? (
                  <p className="text-base leading-relaxed text-gray-700 md:text-lg">{storyRest}</p>
                ) : storyBody && !storyLead ? (
                  <p className="text-base leading-relaxed text-gray-700 md:text-lg">{storyBody}</p>
                ) : !storyBody ? (
                  <p className="text-sm leading-relaxed text-gray-500">
                    Add your tagline and story in <strong>Admin → Setup</strong> (Story &amp; details).
                  </p>
                ) : null}
              </ScrollFade>
            </div>
          </div>
        </div>
      </section>

      <section
        id="moments-collage"
        className="relative z-10 overflow-hidden bg-gradient-to-b from-[color-mix(in_srgb,white_96%,var(--w-bg))] via-[var(--w-bg)] to-[color-mix(in_srgb,var(--w-accent)_8%,var(--w-bg))] pt-16 pb-36 md:pt-24 md:pb-40"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--w-accent)_0%,transparent_70%)] opacity-20" />

        <div className="container relative mx-auto max-w-6xl px-4">
          <ScrollFade className="mx-auto mb-10 max-w-2xl text-center md:mb-14" y={18} duration={0.62}>
            <p className="text-[10px] font-medium uppercase tracking-[0.38em] text-[var(--w-primary)]">
              Moments &amp; details
            </p>
            <h2 className="mt-2 font-serif text-3xl text-[var(--w-primary)] md:text-4xl">Liquid glass gallery</h2>
            <p className="mt-2 text-sm text-gray-600 md:text-base">
              Drag or swipe the carousel — one photo per frame, centred on your moment. Venue and colours sit in the
              same frosted panel below.
            </p>
          </ScrollFade>

          <LiquidGlassCoverFlow photos={weddingPhotos} reducedMotion={reducedMotion} />

          <ScrollFade
            id="details"
            className={cn(
              "mx-auto mt-14 max-w-4xl rounded-[1.75rem] border p-6 shadow-[0_18px_48px_-20px_rgba(0,0,0,0.18)] backdrop-blur-2xl ring-1 ring-inset md:mt-20 md:p-10",
              showVenueOrColours
                ? "border-white/50 bg-white/25 ring-white/25"
                : "border-[var(--w-border-soft)] bg-white/15 ring-white/15"
            )}
            y={20}
            duration={0.65}
          >
            {showVenueOrColours ? (
              <div className="grid grid-cols-1 items-start gap-10 text-center md:grid-cols-2 md:gap-12 md:text-left">
                <div className="space-y-2 antialiased">
                  <p className="text-xs uppercase tracking-widest text-gray-500">Reception venue</p>
                  {venueName ? (
                    <p className="text-lg font-semibold text-[var(--w-primary)] md:text-xl">{venueName}</p>
                  ) : (
                    <p className="text-sm text-gray-400">Add your venue in Admin → Setup (Story &amp; details).</p>
                  )}
                  {venueAddress ? (
                    <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700 md:text-base">{venueAddress}</p>
                  ) : null}
                </div>
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-widest text-gray-500">Colours of the day</p>
                  {palette.dressCode.length > 0 ? (
                    <DressCodeChips colors={palette.dressCode} />
                  ) : (
                    <p className="text-sm text-gray-400">
                      Add up to three named colours in <strong>Admin → Setup</strong> (Colours step).
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center text-sm text-gray-600">
                <strong>Details</strong> — add your venue address and colours of the day in{" "}
                <strong>Admin → Setup</strong> to show them in this glass panel.
              </p>
            )}
          </ScrollFade>
        </div>
      </section>

      {/* Bottom Action Bar with Modal */}
      <div
        className="fixed bottom-12 md:bottom-4 lg:bottom-10 left-0 right-0 z-30 px-4"
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
        <div className="mx-auto w-full max-w-md">
          <div
            className="bg-[var(--w-primary)] text-white py-2 md:py-3 px-4 md:px-6 rounded-full shadow-lg cursor-pointer"
            onClick={() => {
              const isMobileViewport =
                typeof window !== "undefined" &&
                window.matchMedia("(max-width: 767px)").matches;

              if (isMobileViewport) {
                setIsActionModalOpen((prev) => !prev);
              } else {
                setIsActionModalOpen(true);
              }
              setIsModalDisabled(false);
            }}
          >
            <div className="flex w-full min-w-0 items-center justify-center gap-x-1 md:gap-x-2 text-xs md:text-sm text-center">
              <span className="hidden sm:inline">{actionBarProgramme}</span>
              <span className="sm:hidden">{actionBarProgramme}</span>
              <span className="text-[var(--w-accent)]">|</span>
              <span className="hidden sm:inline">{actionBarCalendar}</span>
              <span className="sm:hidden">{actionBarCalendar}</span>
              <span className="text-[var(--w-accent)]">|</span>
              <span className="hidden md:inline">{actionBarDirections}</span>
              <span className="sm:inline md:hidden">{actionBarDirectionsShort}</span>
            </div>
          </div>
        </div>

        {/* Modal */}
        <ActionModal
          isOpen={isActionModalOpen}
          links={actionLinks}
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
