import { motion } from "framer-motion";
import { MapPin, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemClicked?: () => void;
}

export default function ActionModal({ isOpen, onClose, onItemClicked }: ActionModalProps) {

  const actions = [
    {
      icon: <MapPin className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
      text: "Get Direction",
      onClick: () => {
        // Open Google Maps in new tab
        const address = "Aquila Events Hub, Ikorodu, Lagos State, Nigeria";
        const encodedAddress = encodeURIComponent(address);
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        window.open(googleMapsUrl, '_blank');
        onClose();
        onItemClicked?.();
      }
    },
    {
      icon: <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
      text: "Add to Google Calendar",
      onClick: () => {
        // Create Google Calendar event URL
        const eventDetails = {
          text: "Wedding Ceremony & Reception",
          dates: "20241228T140000Z/20241228T220000Z", // December 28, 2024, 2:00 PM - 10:00 PM UTC
          details: "Join us for our special day! Wedding ceremony and reception at Aquila Events Hub, Ikorodu, Lagos State, Nigeria.",
          location: "Aquila Events Hub, Ikorodu, Lagos State, Nigeria"
        };

        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.text)}&dates=${eventDetails.dates}&details=${encodeURIComponent(eventDetails.details)}&location=${encodeURIComponent(eventDetails.location)}`;

        window.open(googleCalendarUrl, '_blank');
        onClose();
        onItemClicked?.();
      }
    },
    {
      icon: <Download className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
      text: "Download Order of Service",
      onClick: () => {
        // Download Order of Service from Google Drive
        const fileId = "1_c7gTlugswAYj9HPNCZiBvrki6JyOLeR";
        const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

        // Create a temporary link element to trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "Order of Service.pdf";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        onClose();
        onItemClicked?.();
      }
    }
  ];

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[100] flex items-end justify-center pb-24 md:pb-20 lg:pb-24 px-3 sm:px-4 md:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        {/* Backdrop */}
        <div
          // className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          className="relative z-10 bg-white rounded-2xl sm:rounded-3xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: isOpen ? 1 : 0.9, opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Modal body with buttons */}
          <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-center gap-2 sm:gap-3 h-12 sm:h-14 md:h-16 rounded-xl font-medium transition-colors bg-[#800000] text-white hover:bg-pink-100 hover:text-[#800000] text-sm sm:text-base md:text-lg"
                onClick={action.onClick}
              >
                <span className="flex-shrink-0">{action.icon}</span>
                <span className="truncate">{action.text}</span>
              </Button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
} 