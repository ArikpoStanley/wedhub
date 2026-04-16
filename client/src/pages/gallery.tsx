import { motion } from "framer-motion";
import { Heart, ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState } from "react";
import ConfettiBackground from "@/components/confetti-background";
import ConfettiBurst from "@/components/confetti-burst";
import NavigationBar from "@/components/navigation-bar";
import Footer from "@/components/footer";

export default function Gallery() {
  const galleryPhotos = [
    {
      src: "https://res.cloudinary.com/dycukxm7r/image/upload/v1776227725/DSC_8787_wrwgc9.jpg",
      alt: "Mymee in traditional attire"
    },
    {
      src: "https://res.cloudinary.com/dycukxm7r/image/upload/v1776227700/DSC_8764_vvhtp1.jpg",
      alt: "David in traditional attire"
    },
    {
      src: "https://res.cloudinary.com/dycukxm7r/image/upload/v1776310781/lv_0_20260415184705_tqnujf.jpg",
      alt: "Mymee and David together"
    },
    {
      src: "https://res.cloudinary.com/dycukxm7r/image/upload/v1776310778/lv_0_20260415190505_b0r0d4.jpg",
      alt: "Couple portrait"
    },
    {
      src: "https://res.cloudinary.com/dycukxm7r/image/upload/v1776227664/DSC_8782_bqdxop.jpg",
      alt: "Mymee smiling"
    },
    {
      src: "https://res.cloudinary.com/dycukxm7r/image/upload/v1776227671/PreweddingPictures_odczgq.jpg",
      alt: "Pre-wedding pictures"
    }
  ];

  return (
    <div className="min-h-screen bg-rose-50 relative">
      <ConfettiBackground />
      <ConfettiBurst />
      
      <NavigationBar currentPage="gallery" />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-script text-[hsl(342,69%,29%)] mb-8">
            Gallery
          </h1>

          {/* Decorative elements positioned absolutely on the text */}
            <motion.div 
            className="absolute -top-4 -left-8 w-16 h-16 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              ❤️
            </motion.div>
            <motion.div 
            className="absolute top-1/2 right-1/4 w-16 h-16 flex items-center justify-center transform -translate-y-1/2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              🌸
            </motion.div>
            <motion.div 
            className="absolute -bottom-4 -right-8 w-16 h-16 flex items-center justify-center"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              ❤️
            </motion.div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-7xl mx-auto items-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {galleryPhotos.map((photo, index) => (
            <motion.div
              key={index}
              className={`
                overflow-hidden rounded-xl shadow-lg group cursor-pointer
                ${index === 0 ? 'col-span-1 sm:col-span-2 row-span-2' : ''}
                ${index === 2 ? 'sm:col-span-1 lg:col-span-2' : ''}
              `}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <img 
                src={photo.src}
                alt={photo.alt}
                className={`
                  w-full object-cover object-top group-hover:scale-105 transition-transform duration-500
                  ${index === 0 ? 'h-96 sm:h-full' : 'h-48 sm:h-64'}
                `}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[hsl(342,69%,29%)] rounded-full flex items-center justify-center">
              <Heart className="text-white text-2xl fill-current" />
            </div>
          </div>
          <h3 className="text-2xl font-serif text-[hsl(342,69%,29%)] mb-4">
            Love in Every Frame
          </h3>
          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
            These moments capture the journey of our love story. Each photo tells a piece of our tale, 
            from sweet beginnings to this beautiful celebration we're about to share with you.
          </p>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}