import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  /** When missing, a short placeholder is shown instead of a timer. */
  targetDate: string | null | undefined;
  /** `hero` = glass pill on dark photography hero. */
  variant?: "default" | "hero";
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ targetDate, variant = "default" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!targetDate?.trim()) {
      return;
    }
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!targetDate?.trim()) {
    return (
      <p
        className={
          variant === "hero"
            ? "text-center text-xs text-white/75 max-w-md mx-auto px-4"
            : "text-center text-sm text-gray-500 max-w-md mx-auto px-4"
        }
      >
        Wedding date will appear here after it is added in your admin setup.
      </p>
    );
  }

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds }
  ];

  const isHero = variant === "hero";

  return (
    <div
      className={
        isHero
          ? "inline-flex rounded-2xl border border-white/25 bg-white/10 px-3 py-3 sm:px-6 sm:py-4 backdrop-blur-md shadow-lg justify-center space-x-3 sm:space-x-6 text-white"
          : "flex justify-center space-x-4 sm:space-x-8 text-[var(--w-primary)]"
      }
    >
      {timeUnits.map((unit, index) => (
        <motion.div 
          key={unit.label}
          className="text-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <motion.div 
            className={
              isHero
                ? "text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-white tabular-nums"
                : "text-3xl sm:text-5xl md:text-7xl font-serif font-bold"
            }
            key={unit.value}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {String(unit.value).padStart(2, '0')}
          </motion.div>
          <div
            className={
              isHero
                ? "text-[9px] sm:text-[10px] font-serif font-medium mt-0.5 text-white/80 uppercase tracking-wide"
                : "text-[10px] sm:text-xs md:text-sm font-serif font-medium mt-1"
            }
          >
            {unit.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
