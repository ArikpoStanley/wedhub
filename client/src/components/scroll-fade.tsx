import { type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type ScrollFadeProps = {
  children: ReactNode;
  className?: string;
  /** Vertical offset in px while hidden (ignored when `fadeOnly`). */
  y?: number;
  /** Horizontal offset in px while hidden (e.g. slide from the side). */
  x?: number;
  duration?: number;
  delay?: number;
  /**
   * When `false` (default), the block fades back out after leaving the viewport.
   * When `true`, animates only the first time it enters (better for reduced churn).
   */
  once?: boolean;
  /** Opacity-only; no vertical slide. */
  fadeOnly?: boolean;
  amount?: number | "some" | "all";
} & Omit<HTMLMotionProps<"div">, "children" | "initial" | "animate" | "whileInView" | "viewport" | "transition">;

/**
 * Fade (and optional rise) when a block enters the viewport; fades out again when it leaves
 * (`once: false`). Honors `prefers-reduced-motion` via the site hook (static layout, no motion).
 */
export function ScrollFade({
  children,
  className,
  y = 22,
  x: xProp,
  duration = 0.58,
  delay = 0,
  once = false,
  fadeOnly = false,
  amount = 0.14,
  ...rest
}: ScrollFadeProps) {
  const reducedMotion = useReducedMotion();
  const hiddenY = fadeOnly ? 0 : y;
  const hiddenX = xProp ?? 0;

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, x: hiddenX, y: hiddenY }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount, margin: "0px 0px -12% 0px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
