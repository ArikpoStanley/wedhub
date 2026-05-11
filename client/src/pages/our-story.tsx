import { ScrollFade } from "@/components/scroll-fade";
import { Heart, ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useState } from "react";
import ConfettiBackground from "@/components/confetti-background";
import ConfettiBurst from "@/components/confetti-burst";
import NavigationBar from "@/components/navigation-bar";
import Footer from "@/components/footer";
import StackedCards from "@/components/stacked-cards";
import PhotoPanels from "@/components/photo-panels";

export default function OurStory() {
  const storyQuestions = [
    {
      question: "How Did You First Meet?",
      answers: [
        {
          name: "Mymee",
          text: "We met on LinkedIn in 2019. I invited him to a business meeting as a prospective client for the company I was working with at the time"
        },
        {
          name: "David",
          text: "We met on LinkedIn as professionals for a business meeting."
        }
      ]
    },
    {
      question: "Tell us about your first date",
      answers: [
        {
          name: "Mymee",
          text: "We met at the cinema for 'A Wrinkle in Time'. I remember being so nervous but also excited. The movie was good, but I was more focused on getting to know him better. We had dinner afterwards and talked for hours about everything and nothing."
        },
        {
          name: "David",
          text: "I was trying so hard to be cool and composed, but she had this way of making me feel completely at ease. By the end of the night, I knew there was something special about her. The way she laughed, her perspectives on life - everything just clicked."
        }
      ]
    },
    {
      question: "When did you know this was 'the one'?",
      answers: [
        {
          name: "Mymee",
          text: "I think it was during one of our late-night calls when he was comforting me through a difficult time. The way he listened, understood, and supported me without judgment made me realize he was someone I could trust with my whole heart."
        },
        {
          name: "David",
          text: "I knew she was the one, when the witness in my heart became clear."
        }
      ]
    }
  ];

  const galleryPhotos = [
    {
      id: "1",
      src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500",
      alt: "Couple portrait"
    },
    {
      id: "2", 
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500",
      alt: "Dancing together"
    },
    {
      id: "3",
      src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500",
      alt: "Formal wear"
    },
    {
      id: "4",
      src: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500",
      alt: "Romantic moment"
    },
    {
      id: "5",
      src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500",
      alt: "Wedding celebration"
    }
  ];

  const cardColors = [
    "bg-[color-mix(in_srgb,var(--w-primary)_12%,var(--w-bg))]",
    "bg-[var(--w-border-soft)]",
    "bg-[color-mix(in_srgb,var(--w-accent)_22%,var(--w-bg))]",
    "bg-[color-mix(in_srgb,var(--w-accent)_12%,white)]",
  ];

  return (
    <div className="min-h-screen bg-[var(--w-bg)] relative">
      <ConfettiBackground />
      <ConfettiBurst />
      
      <NavigationBar currentPage="our-story" showBackButton={true} />

      <div className="container mx-auto px-4 pb-12">
        {/* Hero Banner */}
        <ScrollFade
          className="mb-12 flex flex-col items-center gap-6 rounded-2xl bg-gradient-to-r from-[var(--w-bg)] to-[color-mix(in_srgb,var(--w-accent)_18%,var(--w-bg))] px-8 pb-6 pt-4 lg:flex-row lg:px-12 lg:pb-8 lg:pt-6"
          y={28}
          duration={0.72}
        >
          {/* Left Text Section */}
          <div className="flex-1 text-left space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[var(--w-primary)] rounded-full flex items-center justify-center">
                <span className="text-white text-sm">❤️</span>
              </div>
              <span className="text-sm text-[var(--w-primary)]">❤️</span>
            </div>
            <p className="text-xl font-script text-[var(--w-primary)]">
              Celebrating love in its purest form
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-[var(--w-primary)]">
              FROM LINKEDIN CONNECTION
            </h1>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[var(--w-accent)]">
              TO CONVICTION
            </h2>
          </div>

          {/* Right Photo Panels */}
          <div className="flex-1">
            <PhotoPanels photos={galleryPhotos} />
          </div>
        </ScrollFade>

        {/* Decorative Heart */}
        <ScrollFade className="mb-12 flex justify-center" fadeOnly duration={0.55}>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--w-primary)]">
            <Heart className="text-2xl fill-current text-white" />
          </div>
        </ScrollFade>

        {/* Q&A Section */}
        <StackedCards
          cards={storyQuestions.map((item, index) => ({
            id: `question-${index}`,
            title: item.question,
            backgroundColor: cardColors[index % cardColors.length],
            content: (
              <div className="space-y-4">
                {item.answers.map((answer, answerIndex) => (
                  <div key={answerIndex} className="mb-6">
                    <div className="inline-block bg-[var(--w-primary)] text-white px-4 py-2 rounded-lg mb-3">
                      <span className="font-script text-sm font-bold">
                        {answer.name}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-base">
                      {answer.text}
                    </p>
                  </div>
                ))}
              </div>
            )
          }))}
          className="max-w-4xl mx-auto"
        />

        {/* Closing Message */}
        <ScrollFade className="mt-16 text-center" y={26} duration={0.7}>
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-[var(--w-primary)] rounded-full flex items-center justify-center">
                <Heart className="text-white text-2xl fill-current" />
              </div>
            </div>
            <h3 className="text-3xl font-serif text-[var(--w-primary)] mb-6">
              Our Journey Continues...
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              What started as a simple LinkedIn connection has blossomed into the greatest love story of our lives. 
              We're excited to begin this new chapter together and grateful to have you witness our union.
            </p>
          </Card>
        </ScrollFade>
      </div>
      
      <Footer />
    </div>
  );
}