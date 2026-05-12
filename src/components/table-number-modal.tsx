import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { weddingApi } from "@/services/wedding-api";
import type { Contact } from "@shared/wedding-schema";
import { useWeddingSiteOptional } from "@/context/site-context";

interface TableNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TableNumberModal({ isOpen, onClose }: TableNumberModalProps) {
  const siteCtx = useWeddingSiteOptional();
  const siteScope =
    siteCtx?.tenantSlug != null ? { slug: siteCtx.tenantSlug } : null;

  const [searchQuery, setSearchQuery] = useState("");
  const [foundContact, setFoundContact] = useState<Contact | null>(null);
  const [searchResult, setSearchResult] = useState<"found" | "not-found" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckName = async () => {
    if (!searchQuery.trim()) return;

    if (!siteScope) {
      setError("Open your published wedding link (address includes /w/your-slug) to look up table numbers.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setFoundContact(null);
    setSearchResult(null);

    try {
      const response = await weddingApi.searchContacts(searchQuery.trim(), siteScope);
      
      if (response.success && response.data && response.data.length > 0) {
        // If multiple matches, take the first one
        const contact = response.data[0];
        setFoundContact(contact);
        setSearchResult("found");
      } else {
        setSearchResult("not-found");
      }
    } catch (err) {
      console.error('Error searching contacts:', err);
      setError('Failed to search contacts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setFoundContact(null);
    setSearchResult(null);
    setError(null);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <motion.div
        className="relative z-10 bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-4xl max-h-[85vh] sm:max-h-[90vh] md:max-h-[92vh] overflow-y-auto relative"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: isOpen ? 1 : 0.9, opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
      >
        {/* Close button */}
        <div className="sticky top-0 right-0 flex justify-end p-2 sm:p-3 md:p-4 z-20 bg-white/80 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 p-0 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
            aria-label="Close modal"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        {/* Modal body */}
        <div className="p-4 sm:p-6 md:p-8 lg:p-10">
          {/* Title */}
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-[var(--w-primary)] text-base sm:text-lg md:text-xl lg:text-2xl font-serif leading-relaxed px-1">
              Hello dear, kindly enter your name, email, or phone number to find your table number
            </h3>
          </div>

          {/* Input and button row */}
          <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
            <Input
              type="text"
              placeholder="Enter your name, email, or phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:flex-1 border-gray-300 focus:border-[var(--w-primary)] focus:ring-[var(--w-primary)] text-sm sm:text-base md:text-lg py-2.5 sm:py-3 md:py-3.5"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCheckName();
                }
              }}
            />
            <Button
              onClick={handleCheckName}
              disabled={!searchQuery.trim() || isLoading}
              className="w-full sm:w-auto bg-[var(--w-border-soft)] text-[var(--w-primary)] hover:bg-[color-mix(in_srgb,var(--w-accent)_25%,var(--w-bg))] border border-[var(--w-border-soft)] px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base md:text-lg font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Checking..." : "CHECK NAME"}
            </Button>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              className="text-center p-3 sm:p-4 rounded-lg bg-red-50 border border-red-200 mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-red-600 font-medium text-sm sm:text-base">{error}</p>
            </motion.div>
          )}

          {/* Result */}
          {searchResult && (
            <motion.div
              className="text-center p-3 sm:p-4 md:p-6 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {searchResult === "not-found" ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-5 md:p-6">
                  <p className="text-yellow-800 font-medium text-sm sm:text-base md:text-lg mb-2">
                    Contact not found
                  </p>
                  <p className="text-yellow-700 text-xs sm:text-sm md:text-base">
                    Please confirm your information or contact us for assistance.
                  </p>
                </div>
              ) : foundContact ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-5 md:p-6">
                  <p className="text-gray-600 mb-2 text-sm sm:text-base md:text-lg font-medium">Welcome, {foundContact.fullName}!</p>
                  {foundContact.tableNumber ? (
                    <div>
                      <p className="text-gray-600 mb-2 sm:mb-3 text-sm sm:text-base md:text-lg">Your table number is:</p>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--w-primary)] mb-2">
                        Table {foundContact.tableNumber}
                      </p>
                    </div>
                  ) : (
                    <p className="text-orange-600 font-medium text-sm sm:text-base md:text-lg">
                      Table assignment pending. Please check back later.
                    </p>
                  )}
                  <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 space-y-1">
                    <p className="break-words">Email: {foundContact.email}</p>
                    <p>Phone: {foundContact.phoneNumber}</p>
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}

         
        </div>
      </motion.div>
    </motion.div>
  );
} 