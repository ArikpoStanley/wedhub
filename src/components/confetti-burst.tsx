import { useEffect } from "react";
import confetti from "canvas-confetti";
import { weddingEffectColors } from "@/lib/effect-palette";

export default function ConfettiBurst() {
  useEffect(() => {
    const fireConfetti = () => {
      const colors = weddingEffectColors();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors,
        shapes: ['circle', 'square'],
        gravity: 0.8,
        ticks: 200,
        startVelocity: 30,
        decay: 0.95,
      });

      // Second burst with different timing
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
      }, 250);

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
      }, 400);
    };

    // Fire confetti 2 times with delays
    fireConfetti(); // First burst immediately
    
    // Second burst after 3 seconds
    setTimeout(() => {
      fireConfetti();
    }, 3000);

    // Optional: Fire confetti on window focus (for when user returns to tab)
    const handleFocus = () => {
      // Only fire if it's been more than 5 seconds since page load
      if (Date.now() - performance.timing.navigationStart > 5000) {
        fireConfetti();
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}