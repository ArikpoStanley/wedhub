"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#800000]/10 flex items-center justify-center">
            <Heart className="w-8 h-8 text-[#800000]" aria-hidden />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-[#800000] mb-3">Your wedding site starts here</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Create a free account, walk through setup, then publish. Only after you go live does your unique link
          become public for guests—nothing is shown until you are ready.
        </p>
        <Card className="p-6 space-y-3 text-left shadow-md border-rose-100">
          <Button asChild className="w-full bg-[#800000] hover:bg-[#600000]">
            <Link href="/signup">Create an account</Link>
          </Button>
          <Button asChild variant="outline" className="w-full border-[#800000] text-[#800000]">
            <Link href="/login">Log in</Link>
          </Button>
        </Card>
        <p className="text-sm text-gray-500 mt-8">
          After publishing, share:{" "}
          <code className="text-xs bg-rose-100 px-1.5 py-0.5 rounded">/w/your-slug</code>
        </p>
      </motion.div>
    </div>
  );
}
