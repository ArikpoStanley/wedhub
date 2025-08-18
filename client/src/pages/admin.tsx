import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NavigationBar from "@/components/navigation-bar";
import Footer from "@/components/footer";
import { weddingApi } from "@/services/wedding-api";
import type { RSVP, Guest } from "@shared/wedding-schema";

export default function Admin() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"rsvps" | "guests">("rsvps");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rsvpResponse, guestResponse] = await Promise.all([
        weddingApi.getAllRSVPs(),
        weddingApi.getAllGuests(),
      ]);

      if (rsvpResponse.success) {
        setRsvps(rsvpResponse.data);
      }
      if (guestResponse.success) {
        setGuests(guestResponse.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const attendingRsvps = rsvps.filter(rsvp => rsvp.willAttend === "yes");
  const notAttendingRsvps = rsvps.filter(rsvp => rsvp.willAttend === "no");
  const totalGuests = attendingRsvps.reduce((sum, rsvp) => sum + (rsvp.guests || 1), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <div className="text-2xl text-[#800000]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50">
      <NavigationBar currentPage="admin" />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-serif text-[#800000] text-center mb-8">
            Wedding Dashboard
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 text-center">
              <h3 className="text-2xl font-bold text-[#800000]">{rsvps.length}</h3>
              <p className="text-gray-600">Total RSVPs</p>
            </Card>
            <Card className="p-6 text-center">
              <h3 className="text-2xl font-bold text-green-600">{attendingRsvps.length}</h3>
              <p className="text-gray-600">Attending</p>
            </Card>
            <Card className="p-6 text-center">
              <h3 className="text-2xl font-bold text-red-600">{notAttendingRsvps.length}</h3>
              <p className="text-gray-600">Not Attending</p>
            </Card>
            <Card className="p-6 text-center">
              <h3 className="text-2xl font-bold text-[#800000]">{totalGuests}</h3>
              <p className="text-gray-600">Total Guests</p>
            </Card>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-4 mb-6">
            <Button
              onClick={() => setActiveTab("rsvps")}
              variant={activeTab === "rsvps" ? "default" : "outline"}
              className={activeTab === "rsvps" ? "bg-[#800000] text-white" : ""}
            >
              RSVPs ({rsvps.length})
            </Button>
            <Button
              onClick={() => setActiveTab("guests")}
              variant={activeTab === "guests" ? "default" : "outline"}
              className={activeTab === "guests" ? "bg-[#800000] text-white" : ""}
            >
              Guests ({guests.length})
            </Button>
          </div>

          {/* RSVP List */}
          {activeTab === "rsvps" && (
            <Card className="p-6">
              <h2 className="text-2xl font-serif text-[#800000] mb-4">RSVP Responses</h2>
              {rsvps.length === 0 ? (
                <p className="text-gray-600">No RSVPs yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Name</th>
                        <th className="text-left py-2">Email</th>
                        <th className="text-left py-2">Attending</th>
                        <th className="text-left py-2">Guests</th>
                        <th className="text-left py-2">WhatsApp Invite</th>
                        <th className="text-left py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rsvps.map((rsvp) => (
                        <tr key={rsvp._id} className="border-b">
                          <td className="py-2">{rsvp.name}</td>
                          <td className="py-2">{rsvp.email}</td>
                          <td className="py-2">
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                rsvp.willAttend === "yes"
                                  ? "bg-green-100 text-green-800"
                                  : rsvp.willAttend === "no"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {rsvp.willAttend === "yes" ? "Yes" : rsvp.willAttend === "no" ? "No" : "Pending"}
                            </span>
                          </td>
                          <td className="py-2">{rsvp.guests || 1}</td>
                          <td className="py-2">
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                rsvp.whatsappInvite === "yes"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {rsvp.whatsappInvite === "yes" ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="py-2">
                            {new Date(rsvp.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {/* Guest List */}
          {activeTab === "guests" && (
            <Card className="p-6">
              <h2 className="text-2xl font-serif text-[#800000] mb-4">Guest List</h2>
              {guests.length === 0 ? (
                <p className="text-gray-600">No guests added yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Name</th>
                        <th className="text-left py-2">Email</th>
                        <th className="text-left py-2">Phone</th>
                        <th className="text-left py-2">Relationship</th>
                        <th className="text-left py-2">RSVP Status</th>
                        <th className="text-left py-2">Table</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guests.map((guest) => (
                        <tr key={guest._id} className="border-b">
                          <td className="py-2">{guest.name}</td>
                          <td className="py-2">{guest.email || "-"}</td>
                          <td className="py-2">{guest.phone || "-"}</td>
                          <td className="py-2">{guest.relationship || "-"}</td>
                          <td className="py-2">
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                guest.rsvpStatus === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : guest.rsvpStatus === "declined"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {guest.rsvpStatus}
                            </span>
                          </td>
                          <td className="py-2">{guest.tableNumber || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          <div className="mt-8 text-center">
            <Button onClick={loadData} className="bg-[#800000] text-white">
              Refresh Data
            </Button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}