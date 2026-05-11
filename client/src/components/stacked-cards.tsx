import { motion } from "framer-motion";
import { useRef } from "react";
import { Card } from "@/components/ui/card";

interface StackedCard {
  id: string;
  title: string;
  content: React.ReactNode;
  backgroundColor?: string;
}

interface StackedCardsProps {
  cards: StackedCard[];
  className?: string;
}

export default function StackedCards({ cards, className = "" }: StackedCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="relative mb-8 md:mb-12 flex items-start gap-6"
            style={{ 
              zIndex: index + 1,
              position: "sticky" as any,
              top: `${120 + (index * 10)}px`
            }}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.2,
              ease: "easeOut"
            }}
            viewport={{ 
              once: false, 
              margin: "-100px 0px -200px 0px" 
            }}
          >
            {/* Decorative icon on the left */}
            <div className="flex-shrink-0 mt-4">
              <div className="w-8 h-8 bg-[var(--w-primary)] rounded-full flex items-center justify-center">
                <span className="text-white text-sm">❤️</span>
              </div>
            </div>
            
            {/* Card content on the right */}
            <Card 
              className={`
                flex-1 p-8 backdrop-blur-sm border-0 shadow-lg 
                transform transition-transform hover:scale-[1.02]
                ${card.backgroundColor || "bg-white/80"}
              `}
            >
              <h3 className="text-2xl md:text-3xl font-serif text-[var(--w-primary)] mb-6 text-center">
                {card.title}
              </h3>
              <div className="text-gray-700 leading-relaxed">
                {card.content}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
} 