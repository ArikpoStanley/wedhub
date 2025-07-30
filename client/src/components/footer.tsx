import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="py-4 bg-[#800000] text-white overflow-hidden">
      <div className="relative">
        <motion.div 
          className="flex space-x-8 whitespace-nowrap text-xl font-serif"
          animate={{ x: [0, -2000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 50 }, (_, i) => (
            <span key={i} className="inline-block">
              ● LOVE LIKE THIS ●
            </span>
          ))}
        </motion.div>
      </div>
    </footer>
  );
} 