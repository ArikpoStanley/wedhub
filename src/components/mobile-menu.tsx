import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: Array<{ label: string; href: string }>;
  onNavigate: (href: string) => void;
}

export default function MobileMenu({ isOpen, onClose, navigationItems, onNavigate }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Menu Panel */}
          <motion.div
            className="absolute inset-0 bg-[color-mix(in_srgb,var(--w-bg)_92%,var(--w-primary))]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Watercolor floral background */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1518895949257-7621c3c786d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            
            <div className="relative h-full flex flex-col justify-center items-end pr-8 space-y-4 text-[var(--w-primary)]">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-6 right-6 text-3xl text-[var(--w-primary)] hover:text-[var(--w-primary-hover)]"
                onClick={onClose}
              >
                <X className="h-8 w-8" />
              </Button>
              
              <nav className="text-right space-y-3">
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.href}
                    onClick={() => onNavigate(item.href)}
                    className="block text-2xl font-serif font-semibold hover:text-[var(--w-primary-hover)] transition-colors text-right"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
