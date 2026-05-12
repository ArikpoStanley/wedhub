import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { weddingEffectColors } from "@/lib/effect-palette";

interface ConfettiParticle {
  id: number;
  x: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
}

export default function ConfettiBackground() {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    const colors = weddingEffectColors();
    
    const createConfetti = () => {
      const newParticles: ConfettiParticle[] = [];
      
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: Math.random(),
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 4 + 6,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 3
        });
      }
      
      setParticles(newParticles);
    };

    createConfetti();
    const interval = setInterval(createConfetti, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size
          }}
          initial={{ 
            x: 0,
            y: 0, 
            rotate: 0,
            opacity: 1,
            scale: 0
          }}
          animate={{ 
            x: (Math.random() - 0.5) * window.innerWidth * 2,
            y: (Math.random() - 0.5) * window.innerHeight * 2, 
            rotate: 720,
            opacity: 0,
            scale: 1
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
}
