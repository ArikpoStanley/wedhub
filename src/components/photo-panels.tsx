import { motion } from "framer-motion";
import { useState } from "react";

interface PhotoPanel {
  id: string;
  src: string;
  alt: string;
}

interface PhotoPanelsProps {
  photos: PhotoPanel[];
  className?: string;
}

export default function PhotoPanels({ photos, className = "" }: PhotoPanelsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className={`flex gap-1 max-w-5xl mx-auto ${className}`}>
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          className="relative flex-1 overflow-hidden rounded-lg shadow-lg cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ 
            scale: 1.05,
            zIndex: 10
          }}
          onHoverStart={() => setExpandedIndex(index)}
          onHoverEnd={() => setExpandedIndex(null)}
        >
          <img 
            src={photo.src}
            alt={photo.alt}
            className="w-full h-96 object-cover transition-all duration-300"
            style={{
              objectPosition: expandedIndex === index ? 'center' : 'center'
            }}
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      ))}
    </div>
  );
} 