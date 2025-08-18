import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import CountdownTimer from "@/components/countdown-timer";
import ConfettiBackground from "@/components/confetti-background";
import ConfettiBurst from "@/components/confetti-burst";
import NavigationBar from "@/components/navigation-bar";
import Footer from "@/components/footer";
import confetti from "canvas-confetti";
import { weddingApi } from "@/services/wedding-api";
import type { CreateRSVP } from "@shared/wedding-schema";

export default function RSVP() {
  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    email: "",
    guests: 1,
    message: "",
    whatsappInvite: "" as "yes" | "no" | "",
    willAttend: "" as "yes" | "no" | "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rsvpForm.name || !rsvpForm.email || !rsvpForm.whatsappInvite || !rsvpForm.willAttend) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitMessage("");

    try {
      const rsvpData: CreateRSVP = {
        name: rsvpForm.name,
        email: rsvpForm.email,
        whatsappInvite: rsvpForm.whatsappInvite,
        willAttend: rsvpForm.willAttend,
        guests: rsvpForm.guests,
        message: rsvpForm.message || undefined,
      };

      const response = await weddingApi.submitRSVP(rsvpData);
      
      if (response.success) {
        setSubmitMessage("Thank you! Your RSVP has been submitted successfully.");
        
        // Fire confetti burst on successful RSVP submission
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: [
            "#f472b6",
            "#ec4899",
            "#db2777",
            "#be185d",
            "#fbbf24",
            "#f59e0b",
            "#10b981",
            "#059669",
            "#3b82f6",
            "#1d4ed8",
            "#8b5cf6",
            "#7c3aed",
            "#ef4444",
            "#dc2626",
            "#ffffff",
          ],
          shapes: ["circle", "square"],
          gravity: 0.8,
          ticks: 200,
          startVelocity: 30,
          decay: 0.95,
        });

        // Reset form
        setRsvpForm({
          name: "",
          email: "",
          guests: 1,
          message: "",
          whatsappInvite: "",
          willAttend: "",
        });
      } else {
        setSubmitError(response.message || "Failed to submit RSVP");
      }
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      setSubmitError(error instanceof Error ? error.message : "Failed to submit RSVP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 relative">
      <ConfettiBackground />
      <ConfettiBurst />

      <NavigationBar currentPage="rsvp" />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-serif text-[hsl(342,69%,29%)] mb-8">
            RSVP TO OUR <span className="text-[hsl(332,51%,70%)]">WEDDING</span>
          </h1>

          {/* Countdown Timer */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <CountdownTimer targetDate="2025-08-02T00:00:00" />
          </motion.div>

          {/* WhatsApp Invite Section */}
          <motion.div
            className="max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <h2 className="text-3xl font-serif text-[hsl(342,69%,29%)] mb-6">
                RSVP
              </h2>
              <hr className="border-[hsl(342,69%,29%)] mb-8" />

              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-medium text-[hsl(342,69%,29%)] mb-4">
                    Did you receive an invite card via WhatsApp?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="whatsappInvite"
                        value="no"
                        checked={rsvpForm.whatsappInvite === "no"}
                        onChange={(e) =>
                          setRsvpForm({
                            ...rsvpForm,
                            whatsappInvite: e.target.value as "yes" | "no",
                          })
                        }
                        className="w-5 h-5 text-[hsl(342,69%,29%)] border-2 border-[hsl(342,69%,29%)] focus:ring-[hsl(342,69%,29%)]"
                      />
                      <span className="text-lg text-[hsl(342,69%,29%)]">
                        No
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="whatsappInvite"
                        value="yes"
                        checked={rsvpForm.whatsappInvite === "yes"}
                        onChange={(e) =>
                          setRsvpForm({
                            ...rsvpForm,
                            whatsappInvite: e.target.value as "yes" | "no",
                          })
                        }
                        className="w-5 h-5 text-[hsl(342,69%,29%)] border-2 border-[hsl(342,69%,29%)] focus:ring-[hsl(342,69%,29%)]"
                      />
                      <span className="text-lg text-[hsl(342,69%,29%)]">
                        Yes
                      </span>
                    </label>
                  </div>
                </div>

                {/* Conditional message when "No" is selected */}
                {rsvpForm.whatsappInvite === "no" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-6"
                  >
                    <div className="bg-rose-200/60 backdrop-blur-sm rounded-lg p-6 text-center">
                      <p className="text-lg text-[hsl(342,69%,29%)] font-medium">
                        We're sorry, you may not be able to attend without an
                        invite card 😢
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Conditional attendance question when "Yes" is selected */}
                {rsvpForm.whatsappInvite === "yes" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-6"
                  >
                    <div>
                      <label className="block text-lg font-medium text-[hsl(342,69%,29%)] mb-4">
                        Will you be Attending?{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="willAttend"
                            value="no"
                            checked={rsvpForm.willAttend === "no"}
                            onChange={(e) =>
                              setRsvpForm({
                                ...rsvpForm,
                                willAttend: e.target.value as "yes" | "no",
                              })
                            }
                            className="w-5 h-5 text-[hsl(342,69%,29%)] border-2 border-[hsl(342,69%,29%)] focus:ring-[hsl(342,69%,29%)]"
                          />
                          <span className="text-lg text-[hsl(342,69%,29%)]">
                            No
                          </span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="willAttend"
                            value="yes"
                            checked={rsvpForm.willAttend === "yes"}
                            onChange={(e) =>
                              setRsvpForm({
                                ...rsvpForm,
                                willAttend: e.target.value as "yes" | "no",
                              })
                            }
                            className="w-5 h-5 text-[hsl(342,69%,29%)] border-2 border-[hsl(342,69%,29%)] focus:ring-[hsl(342,69%,29%)]"
                          />
                          <span className="text-lg text-[hsl(342,69%,29%)]">
                            Yes
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Message when willAttend is "no" */}
                    {rsvpForm.willAttend === "no" && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-6"
                      >
                        <div className="bg-rose-200/60 backdrop-blur-sm rounded-lg p-6 text-center">
                          <p className="text-lg text-[hsl(342,69%,29%)] font-medium">
                            We're sorry to hear that you won't be attending 😢
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Name and Email fields - only show when willAttend is "yes" */}
                    {rsvpForm.willAttend === "yes" && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-6 space-y-6"
                      >
                        <div>
                          <label className="block text-lg font-medium text-[hsl(342,69%,29%)] mb-3">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={rsvpForm.name}
                            onChange={(e) =>
                              setRsvpForm({ ...rsvpForm, name: e.target.value })
                            }
                            className="w-full px-4 py-3 border-2 border-[hsl(342,69%,29%)] rounded-full focus:ring-2 focus:ring-[hsl(342,69%,29%)] focus:border-transparent bg-white/80"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div>
                          <label className="block text-lg font-medium text-[hsl(342,69%,29%)] mb-3">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={rsvpForm.email}
                            onChange={(e) =>
                              setRsvpForm({
                                ...rsvpForm,
                                email: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border-2 border-[hsl(342,69%,29%)] rounded-full focus:ring-2 focus:ring-[hsl(342,69%,29%)] focus:border-transparent bg-white/80"
                            placeholder="Enter your email address"
                          />
                        </div>

                        {/* Success/Error Messages */}
                        {submitMessage && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg"
                          >
                            {submitMessage}
                          </motion.div>
                        )}

                        {submitError && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
                          >
                            {submitError}
                          </motion.div>
                        )}

                        <button
                          onClick={handleRsvpSubmit}
                          disabled={isSubmitting}
                          className="w-full bg-transparent border-2 border-[hsl(342,69%,29%)] text-[hsl(342,69%,29%)] hover:bg-[hsl(342,69%,29%)] hover:text-white py-3 text-lg rounded-full font-medium transition-all duration-300 hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? "Submitting..." : "RSVP"}
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
