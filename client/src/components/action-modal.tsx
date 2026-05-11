import { motion } from "framer-motion";
import { MapPin, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildGoogleCalendarUrl,
  defaultCalendarWindowFromWeddingDate,
  parseIsoDateTime,
} from "@/lib/google-calendar";

export type WeddingActionLinks = {
  mapsDirectionsUrl?: string;
  calendarGoogleUrlOverride?: string;
  calendarEventTitle?: string;
  calendarEventDescription?: string;
  calendarEventLocation?: string;
  calendarStartIso?: string;
  calendarEndIso?: string;
  weddingDate: Date | null;
  orderOfServiceUrl?: string;
};

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemClicked?: () => void;
  links: WeddingActionLinks;
}

export default function ActionModal({ isOpen, onClose, onItemClicked, links }: ActionModalProps) {
  const openDirections = () => {
    const u = links.mapsDirectionsUrl?.trim();
    if (u) window.open(u, "_blank", "noopener,noreferrer");
    else window.alert("Add a “Get directions” Maps URL in Admin → Setup (Schedule & quick links).");
    onClose();
    onItemClicked?.();
  };

  const openCalendar = () => {
    const override = links.calendarGoogleUrlOverride?.trim();
    if (override) {
      window.open(override, "_blank", "noopener,noreferrer");
      onClose();
      onItemClicked?.();
      return;
    }
    const title = links.calendarEventTitle?.trim() || "Wedding";
    const details = links.calendarEventDescription?.trim() || "";
    const location = links.calendarEventLocation?.trim() || "";
    let start = parseIsoDateTime(links.calendarStartIso);
    let end = parseIsoDateTime(links.calendarEndIso);
    if (!start || !end) {
      const win = defaultCalendarWindowFromWeddingDate(links.weddingDate);
      if (win) {
        start = start ?? win.start;
        end = end ?? win.end;
      }
    }
    if (!start || !end) {
      window.alert(
        "Set event start/end (Schedule & quick links) or add a full Google Calendar URL override.",
      );
      onClose();
      onItemClicked?.();
      return;
    }
    const url = buildGoogleCalendarUrl({ title, details, location, start, end });
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
    onItemClicked?.();
  };

  const openOrderOfService = () => {
    const u = links.orderOfServiceUrl?.trim();
    if (u) window.open(u, "_blank", "noopener,noreferrer");
    else window.alert("Add an order-of-service / PDF URL in Admin → Setup (Schedule & quick links).");
    onClose();
    onItemClicked?.();
  };

  const actions = [
    { icon: <MapPin className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />, text: "Get Direction", onClick: openDirections },
    {
      icon: <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
      text: "Add to Google Calendar",
      onClick: openCalendar,
    },
    {
      icon: <Download className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
      text: "Download Order of Service",
      onClick: openOrderOfService,
    },
  ];

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[100] flex items-end justify-center pb-24 md:pb-20 lg:pb-24 px-3 sm:px-4 md:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <div onClick={onClose} />

        <motion.div
          className="relative z-10 bg-white rounded-2xl sm:rounded-3xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: isOpen ? 1 : 0.9, opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-center gap-2 sm:gap-3 h-12 sm:h-14 md:h-16 rounded-xl font-medium transition-colors bg-[var(--w-primary)] text-white hover:bg-[var(--w-border-soft)] hover:text-[var(--w-primary)] text-sm sm:text-base md:text-lg"
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
