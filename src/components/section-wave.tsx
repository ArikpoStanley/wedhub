import { cn } from "@/lib/utils";

type SectionWaveDividerProps = {
  className?: string;
  /** Tailwind text color class applied to the SVG fill (e.g. matches the section below). */
  fillClassName: string;
  /** Flip vertically so the wave opens the other way. */
  flip?: boolean;
};

/**
 * Organic section edge (inspired by shape dividers / “wave” transitions between blocks).
 */
export function SectionWaveDivider({ className, fillClassName, flip }: SectionWaveDividerProps) {
  return (
    <div
      className={cn(
        "pointer-events-none relative w-full select-none overflow-hidden leading-[0]",
        flip && "rotate-180",
        className
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 96"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className={cn("relative block h-12 w-[calc(100%+2px)] min-w-full md:h-[4.25rem]", fillClassName)}
      >
        <path
          fill="currentColor"
          d="M0 48 C180 12 360 84 540 44 C720 4 900 76 1080 36 C1260 -4 1380 28 1440 20 V96 H0 Z"
        />
      </svg>
    </div>
  );
}
