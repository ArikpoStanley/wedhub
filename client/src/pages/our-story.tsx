import { motion } from "framer-motion";
import { Heart, ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useState } from "react";
import ConfettiBackground from "@/components/confetti-background";
import ConfettiBurst from "@/components/confetti-burst";
import NavigationBar from "@/components/navigation-bar";
import Footer from "@/components/footer";

export default function OurStory() {
  const storyQuestions = [
    {
      question: "How did you both meet?",
      answers: [
        {
          name: "Esther & Basil",
          text: "We both met on LinkedIn. As we continued to chat we got each other's contact. Our conversations started around work and gradually extended to everything else. We would chat all day and call all night. We started hanging out after work and on weekends till we became inseparable."
        }
      ]
    },
    {
      question: "Tell us about your first date",
      answers: [
        {
          name: "Esther",
          text: "We met at the cinema for 'A Wrinkle in Time'. I remember being so nervous but also excited. The movie was good, but I was more focused on getting to know him better. We had dinner afterwards and talked for hours about everything and nothing."
        },
        {
          name: "Basil",
          text: "I was trying so hard to be cool and composed, but she had this way of making me feel completely at ease. By the end of the night, I knew there was something special about her. The way she laughed, her perspectives on life - everything just clicked."
        }
      ]
    },
    {
      question: "When did you know this was 'the one'?",
      answers: [
        {
          name: "Esther",
          text: "I think it was during one of our late-night calls when he was comforting me through a difficult time. The way he listened, understood, and supported me without judgment made me realize he was someone I could trust with my whole heart."
        },
        {
          name: "Basil",
          text: "I knew she was the one, when the witness in my heart became clear."
        }
      ]
    }
  ];

  const galleryPhotos = [
    {
      src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500",
      alt: "Couple portrait"
    },
    {
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500",
      alt: "Dancing together"
    },
    {
      src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500",
      alt: "Formal wear"
    },
    {
      src: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500",
      alt: "Romantic moment"
    }
  ];

  return (
    <div className="min-h-screen bg-rose-50 relative">
      <ConfettiBackground />
      <ConfettiBurst />
      
      <NavigationBar currentPage="our-story" showBackButton={true} />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-lg font-script text-[hsl(342,69%,29%)] mb-4">
            Celebrating love in its purest form
          </p>
          <h1 className="text-5xl md:text-7xl font-serif mb-8">
          </h1>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            {galleryPhotos.map((photo, index) => (
              <motion.div
                key={index}
                className="overflow-hidden rounded-xl shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <img 
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>

          {/* Decorative Heart */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="w-16 h-16 bg-[hsl(342,69%,29%)] rounded-full flex items-center justify-center">
              <Heart className="text-white text-2xl fill-current" />
            </div>
          </motion.div>
        </motion.div>

        {/* Q&A Section */}
        <div className="max-w-4xl mx-auto space-y-8">
          {storyQuestions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <h3 className="text-2xl md:text-3xl font-serif text-[hsl(342,69%,29%)] mb-6 text-center">
                  {item.question}
                </h3>
                
                <div className="space-y-6">
                  {item.answers.map((answer, answerIndex) => (
                    <div key={answerIndex}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-[hsl(342,69%,29%)] rounded-full flex items-center justify-center">
                          <span className="text-white font-script text-sm font-bold">
                            {answer.name === "Esther" ? "E" : answer.name === "Basil" ? "B" : "E&B"}
                          </span>
                        </div>
                        <span className="font-serif font-semibold text-[hsl(342,69%,29%)] text-lg">
                          {answer.name}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed ml-11 text-base">
                        {answer.text}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Closing Message */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-[hsl(342,69%,29%)] rounded-full flex items-center justify-center">
                <Heart className="text-white text-2xl fill-current" />
              </div>
            </div>
            <h3 className="text-3xl font-serif text-[hsl(342,69%,29%)] mb-6">
              Our Journey Continues...
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              What started as a simple LinkedIn connection has blossomed into the greatest love story of our lives. 
              We're excited to begin this new chapter together and grateful to have you witness our union.
            </p>
          </Card>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}