import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
    const colors = ['#f472b6', '#ec4899', '#db2777', '#be185d'];
    
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
            left: `${particle.x}%`,
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size
          }}
          initial={{ 
            y: -100, 
            rotate: 0,
            opacity: 1 
          }}
          animate={{ 
            y: window.innerHeight + 100, 
            rotate: 720,
            opacity: 0 
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
