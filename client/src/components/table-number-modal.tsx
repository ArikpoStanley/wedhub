import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface TableNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TableNumberModal({ isOpen, onClose }: TableNumberModalProps) {
  const [name, setName] = useState("");
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with actual guest data
  const guestData = [
    { name: "John Doe", table: "Table 1" },
    { name: "Jane Smith", table: "Table 2" },
    { name: "Mike Johnson", table: "Table 1" },
    { name: "Sarah Wilson", table: "Table 3" },
    // Add more guest data as needed
  ];

  const handleCheckName = () => {
    if (!name.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const guest = guestData.find(
        g => g.name.toLowerCase().includes(name.toLowerCase())
      );
      
      if (guest) {
        setTableNumber(guest.table);
      } else {
        setTableNumber("Not found");
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleClose = () => {
    setName("");
    setTableNumber(null);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <motion.div
        className="bg-white rounded-3xl shadow-xl w-96 md:w-[32rem] lg:w-[40rem] xl:w-[48rem] max-w-[95vw] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: isOpen ? 1 : 0.9, opacity: isOpen ? 1 : 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Close button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Modal body */}
        <div className="p-8 md:p-10">
          {/* Title */}
          <div className="text-center mb-8">
            <h3 className="text-[hsl(342,69%,29%)] text-xl md:text-2xl font-serif leading-relaxed">
              Hello dear kindly enter your name to find your table number
            </h3>
          </div>

          {/* Input and button row */}
          <div className="flex gap-4 mb-8">
            <Input
              type="text"
              placeholder="ENTER YOUR NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 border-gray-300 focus:border-[hsl(342,69%,29%)] focus:ring-[hsl(342,69%,29%)] text-lg py-3"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCheckName();
                }
              }}
            />
            <Button
              onClick={handleCheckName}
              disabled={!name.trim() || isLoading}
              className="bg-pink-100 text-[hsl(342,69%,29%)] hover:bg-pink-200 border border-pink-200 px-6 py-3 text-lg"
            >
              {isLoading ? "Checking..." : "CHECK NAME..."}
            </Button>
          </div>

          {/* Result */}
          {tableNumber && (
            <motion.div
              className="text-center p-6 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {tableNumber === "Not found" ? (
                <p className="text-red-600 font-medium text-lg">
                  Sorry, we couldn't find your name. Please check the spelling or contact us.
                </p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-3 text-lg">Your table number is:</p>
                  <p className="text-3xl font-bold text-[hsl(342,69%,29%)]">
                    {tableNumber}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Footer navigation */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button
              className="w-full bg-[hsl(342,69%,29%)] text-white hover:bg-[hsl(342,60%,40%)] py-4 text-lg"
              onClick={handleClose}
            >
              Programme | Calendar | Get Direction | Check Table No.
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 