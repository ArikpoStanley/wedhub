"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ScrollFade } from "@/components/scroll-fade";
import { Heart, X, ChevronLeft, ChevronRight } from "lucide-react";
import ConfettiBackground from "@/components/confetti-background";
import ConfettiBurst from "@/components/confetti-burst";
import NavigationBar from "@/components/navigation-bar";
import Footer from "@/components/footer";
import { useWeddingSite } from "@/context/site-context";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export default function Gallery() {
  const ws = useWeddingSite();
  const reducedMotion = useReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const galleryPhotos = useMemo(() => {
    const urls = ws.site?.content?.galleryImageUrls?.filter(Boolean) ?? [];
    const label =
      ws.site?.content?.coupleDisplayName ||
      [ws.site?.partnerOneName, ws.site?.partnerTwoName].filter(Boolean).join(" & ") ||
      "Wedding gallery";
    return urls.map((src, i) => ({ src, alt: `${label} — photo ${i + 1}` }));
  }, [ws.site]);

  const selectedPhoto = selectedIndex !== null ? galleryPhotos[selectedIndex] ?? null : null;

  const closeLightbox = useCallback(() => setSelectedIndex(null), []);
  const goPrev = useCallback(() => {
    setSelectedIndex((i) => {
      if (i === null || galleryPhotos.length === 0) return null;
      return (i - 1 + galleryPhotos.length) % galleryPhotos.length;
    });
  }, [galleryPhotos.length]);
  const goNext = useCallback(() => {
    setSelectedIndex((i) => {
      if (i === null || galleryPhotos.length === 0) return null;
      return (i + 1) % galleryPhotos.length;
    });
  }, [galleryPhotos.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, closeLightbox, goPrev, goNext]);

  const coupleLine =
    ws.site?.content?.coupleDisplayName ||
    [ws.site?.partnerOneName, ws.site?.partnerTwoName].filter(Boolean).join(" & ") ||
    "";

  const closingLine =
    ws.site?.tagline?.trim() ||
    "Moments from our journey—thank you for being part of the story.";

  return (
    <div className="min-h-screen bg-[var(--w-bg)] relative">
      <ConfettiBackground />
      <ConfettiBurst />

      <NavigationBar currentPage="gallery" />

      <header className="relative overflow-hidden border-b border-[var(--w-border-soft)] bg-[color-mix(in_srgb,var(--w-bg)_88%,white)] px-4 py-14 md:py-20">
        <div className="pointer-events-none absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[var(--w-accent)]/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-0 h-48 w-48 rounded-full bg-[var(--w-primary)]/10 blur-2xl" />
        <ScrollFade className="relative mx-auto max-w-3xl text-center" y={20} duration={0.68}>
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-[var(--w-primary)]">Gallery</p>
          <h1 className="mt-3 font-serif text-4xl text-[var(--w-primary)] sm:text-5xl md:text-6xl">{coupleLine || "Our gallery"}</h1>
          {ws.site?.weddingDate ? (
            <p className="mt-4 font-serif text-lg text-gray-600 md:text-xl">
              {new Date(ws.site.weddingDate).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          ) : null}
        </ScrollFade>
      </header>

      <div className="container mx-auto px-4 py-12 md:py-16">
        {galleryPhotos.length === 0 ? (
          <p className="mx-auto max-w-lg py-16 text-center text-gray-600">
            No gallery photos yet. Upload images in <strong>Admin → Setup</strong> (Photos step).
          </p>
        ) : (
          <>
            <p className="mx-auto mb-10 max-w-xl text-center text-sm text-gray-600 md:mb-12">
              Tap any image to open a large view. Use arrow keys or the side buttons to move between photos.
            </p>
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>div]:mb-4">
              {galleryPhotos.map((photo, index) => {
                const tall = index % 5 === 0 || index % 7 === 3;
                return (
                  <motion.div
                    key={photo.src}
                    className={cn(
                      "break-inside-avoid overflow-hidden rounded-xl bg-white/60 shadow-md ring-1 ring-black/5 cursor-pointer",
                      tall && "sm:mb-2"
                    )}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open photo: ${photo.alt}`}
                    onClick={() => setSelectedIndex(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedIndex(index);
                      }
                    }}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-40px" }}
                    transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : (index % 12) * 0.03 }}
                    whileHover={reducedMotion ? undefined : { y: -2 }}
                  >
                    <div className={cn("relative w-full overflow-hidden", tall ? "min-h-[18rem] md:min-h-[22rem]" : "min-h-[12rem] md:min-h-[14rem]")}>
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading="lazy"
                        className="h-full w-full object-cover object-center transition duration-500 hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        <ScrollFade className="mx-auto mt-16 max-w-2xl text-center md:mt-20" y={22} duration={0.65}>
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--w-primary)] shadow-lg">
              <Heart className="h-7 w-7 fill-current text-white" aria-hidden />
            </div>
          </div>
          <h3 className="font-serif text-2xl text-[var(--w-primary)] md:text-3xl">Love in every frame</h3>
          <p className="mt-4 leading-relaxed text-gray-700">{closingLine}</p>
        </ScrollFade>
      </div>

      {selectedPhoto && selectedIndex !== null ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={closeLightbox}
            aria-label="Close gallery"
          />

          <motion.div
            className="relative z-10 w-full max-w-5xl rounded-xl bg-black/40 p-2 shadow-2xl ring-1 ring-white/10"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-2 top-2 z-20 rounded-full bg-black/70 p-2 text-white hover:bg-black/90 sm:right-3 sm:top-3"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {galleryPhotos.length > 1 ? (
              <>
                <button
                  type="button"
                  className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white hover:bg-black/90 sm:left-3"
                  aria-label="Previous photo"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white hover:bg-black/90 sm:right-14"
                  aria-label="Next photo"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            ) : null}
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              className="max-h-[min(82vh,48rem)] w-full rounded-lg object-contain"
            />
            <p className="mt-2 text-center text-xs text-white/70">
              {selectedIndex + 1} / {galleryPhotos.length}
            </p>
          </motion.div>
        </motion.div>
      ) : null}

      <Footer />
    </div>
  );
}
