import { useCallback, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollFade } from "@/components/scroll-fade";

export type CoverFlowPhoto = { src: string; alt: string };

type Slot = { rel: number; photoIndex: number };

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/**
 * Horizontal offset per ring (symmetric). Intentionally smaller than card half-widths
 * so frames overlap like a real cover-flow stack.
 */
const COVER_FLOW_STEP_PX = 188;

/**
 * All slots use the same frame dimensions as the hero card; only scale changes.
 * abs 1 = 70% of centre; abs 2 ≈ old “end” card vs centre (12rem / 24rem width).
 */
function coverFlowScale(abs: number): number {
  if (abs <= 0) return 1;
  if (abs === 1) return 0.7;
  if (abs === 2) return 0.52;
  return Math.max(0.4, 0.52 - (abs - 2) * 0.07);
}

function coverFlowOpacity(abs: number): number {
  if (abs <= 0) return 1;
  if (abs === 1) return 0.88;
  if (abs === 2) return 0.55;
  return 0.45;
}

export function LiquidGlassCoverFlow({
  photos,
  reducedMotion: reducedProp,
  className,
}: {
  photos: CoverFlowPhoto[];
  /** When true, skip 3D / drag (from parent `useReducedMotion` hook if preferred). */
  reducedMotion?: boolean;
  className?: string;
}) {
  const systemReduced = useReducedMotion();
  const reduced = reducedProp ?? systemReduced ?? false;
  const n = photos.length;
  const [active, setActive] = useState(0);

  const go = useCallback(
    (delta: number) => {
      if (n <= 0) return;
      setActive((a) => mod(a + delta, n));
    },
    [n]
  );

  const slots: Slot[] = useMemo(() => {
    if (n === 0) return [];
    const rels = n === 1 ? [0] : n === 2 ? [-1, 0, 1] : [-2, -1, 0, 1, 2];
    return rels.map((rel) => ({ rel, photoIndex: mod(active + rel, n) }));
  }, [active, n]);

  if (n === 0) {
    return (
      <div
        className={cn(
          "mx-auto flex max-w-lg flex-col items-center justify-center rounded-3xl border border-white/35 bg-white/15 px-8 py-16 text-center shadow-2xl backdrop-blur-xl",
          className
        )}
      >
        <p className="text-sm text-gray-600">Add gallery photos in Admin → Setup to see them here.</p>
      </div>
    );
  }

  if (reduced) {
    return (
      <div className={cn("mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6", className)}>
        {photos.slice(0, 6).map((p) => (
          <div
            key={p.src}
            className="overflow-hidden rounded-2xl border border-white/40 bg-white/20 shadow-lg backdrop-blur-md"
          >
            <img src={p.src} alt={p.alt} className="aspect-[3/4] w-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <ScrollFade
      className={cn(
        "relative w-full pb-28 md:pb-24 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]",
        className
      )}
      y={28}
      duration={0.65}
    >
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[120%] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,var(--w-accent)_0%,transparent_55%)] opacity-[0.1]" />

      <motion.div
        className="relative mx-auto flex min-h-[min(76vw,30rem)] w-full max-w-[min(100%,80rem)] cursor-grab touch-pan-y items-center justify-center px-0 py-6 active:cursor-grabbing sm:px-4 md:min-h-[34rem] [perspective:1600px] [perspective-origin:50%_42%]"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.14}
        onDragEnd={(_, info) => {
          const t = 72;
          if (info.offset.x > t) go(-1);
          else if (info.offset.x < -t) go(1);
        }}
      >
        {/* Scene: wide box so translated cards stay centered on viewport */}
        <div
          className="relative mx-auto h-[min(82vw,36rem)] w-full min-w-[min(100%,22rem)] max-w-[min(100%,72rem)] [transform-style:preserve-3d]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {slots.map(({ rel, photoIndex }) => {
            const abs = Math.abs(rel);
            const translateX = rel * COVER_FLOW_STEP_PX;
            const rotateY = -rel * 15;
            const translateZ = -(abs * 64 + abs * abs * 22);
            const scale = coverFlowScale(abs);
            const opacity = coverFlowOpacity(abs);
            const photo = photos[photoIndex]!;

            return (
              <div
                key={`${active}-${rel}-${photoIndex}`}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ zIndex: 20 - abs, transformStyle: "preserve-3d" }}
              >
                <motion.div
                  className="[transform-style:preserve-3d]"
                  initial={false}
                  animate={{
                    x: translateX,
                    y: 0,
                    z: translateZ,
                    rotateY,
                    scale,
                    opacity,
                  }}
                  transition={{ type: "spring", stiffness: 210, damping: 38, mass: 0.94 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-[2rem] border border-white/55 bg-gradient-to-br from-white/28 via-white/10 to-white/5 shadow-[0_40px_90px_-32px_rgba(0,0,0,0.45),inset_0_0_0_1px_rgba(255,255,255,0.32),inset_0_1px_0_0_rgba(255,255,255,0.5)] backdrop-blur-2xl ring-1 ring-white/25",
                      "h-[min(70vw,24rem)] w-[min(90vw,21rem)] sm:h-[28rem] sm:w-[24rem]"
                    )}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      draggable={false}
                      className="h-full w-full object-cover object-center"
                      loading={abs === 0 ? "eager" : "lazy"}
                    />
                    <div
                      className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-tr from-white/15 via-transparent to-transparent opacity-70"
                      aria-hidden
                    />
                    <div
                      className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18),inset_0_-20px_40px_-12px_rgba(0,0,0,0.12)]"
                      aria-hidden
                    />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* z-40 keeps controls above the home page fixed action bar (z-30) so taps register. */}
      <div className="relative z-40 mt-12 flex flex-col items-center gap-5 md:mt-14">
        <p className="text-center text-xs text-gray-500">Swipe or drag horizontally to browse</p>
        <div className="flex items-center justify-center gap-2">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show photo ${i + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                setActive(i);
              }}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === active ? "w-8 bg-[var(--w-primary)]" : "w-2 bg-[var(--w-border-soft)] hover:bg-[var(--w-accent)]"
              )}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className="rounded-full border border-[var(--w-border-soft)] bg-white/55 px-4 py-2 text-sm font-medium text-[var(--w-primary)] shadow-md backdrop-blur-md transition hover:bg-white/85"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className="rounded-full border border-[var(--w-border-soft)] bg-white/55 px-4 py-2 text-sm font-medium text-[var(--w-primary)] shadow-md backdrop-blur-md transition hover:bg-white/85"
          >
            Next
          </button>
        </div>
      </div>
    </ScrollFade>
  );
}
