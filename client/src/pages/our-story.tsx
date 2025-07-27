import { motion } from "framer-motion";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import ConfettiBackground from "@/components/confetti-background";

export default function OurStory() {
  const [, navigate] = useLocation();

  const storyQuestions = [
    {
      question: "How Did You First Meet?",
      answers: [
        {
          name: "Funbi",
          text: "We met on LinkedIn in 2019. I invited him to a business meeting as a prospective client for the company I was working with at the time"
        },
        {
          name: "Joseph",
          text: "We met on LinkedIn as professionals for a business meeting."
        }
      ]
    },
    {
      question: "Who Made The First Move?",
      answers: [
        {
          name: "Funbi",
          text: "Joseph made the first move, and all the other moves lol"
        },
        {
          name: "Joseph",
          text: "I Joseph Ogbaji, made the first move. Lol"
        }
      ]
    },
    {
      question: "What Was Your First Impression Of Each Other?",
      answers: [
        {
          name: "Funbi",
          text: "He struck me as someone passionate about God. Na so business meeting turn to conversation about 'worship'"
        },
        {
          name: "Joseph",
          text: "My first impression about her, was how exciting she gets."
        }
      ]
    },
    {
      question: "What's Your Favorite Thing About Each Other?",
      answers: [
        {
          name: "Funbi",
          text: "I cherish our friendship and deeply admire his commitment and passion for God, work and family."
        },
        {
          name: "Joseph",
          text: "Her personality is my favorite thing about her."
        }
      ]
    },
    {
      question: "What's Something You Both Love Doing Together?",
      answers: [
        {
          name: "Funbi",
          text: "Sharing a meal together inside the car, parked in a quiet spot on a cool evening. Studying bible devotional together"
        },
        {
          name: "Joseph",
          text: "We love watching movies together and having conversation."
        }
      ]
    },
    {
      question: "What's A Funny Or Awkward Moment You'll Never Forget?",
      answers: [
        {
          name: "Funbi",
          text: "When we saw each other again in 2022 (we only met twice in 2019 lol), Joseph was so excited he gave me a big hug and even lifted me off the ground! I was so confused because we weren't really close friends, and his excitement felt unexpected. It was an awkward, beautiful moment!"
        },
        {
          name: "Joseph",
          text: "The day I told her. I like you. 😂"
        }
      ]
    },
    {
      question: "What Are Your Values?",
      answers: [
        {
          name: "Funbi",
          text: "Faith, Kindness, Service, Integrity"
        },
        {
          name: "Joseph",
          text: "Service"
        }
      ]
    },
    {
      question: "How Has Your Faith Shaped Your Relationship?",
      answers: [
        {
          name: "Funbi & Joseph",
          text: "Looking back, it's clear that faith was the invisible thread that brought us together. From the first spark of our friendship to the sacred moment we would say \"I do,\" faith was there—quietly guiding, gently nudging, and faithfully building something beautiful. There were moments we didn't even realize were landmarks small gestures, shared laughter, honest conversations. But each of those moments was a stepping stone, leading us toward each other. Faith wasn't just a part of our story, it was the author, writing every chapter with purpose and grace."
        }
      ]
    },
    {
      question: "When Did You Know He / She Was The One",
      answers: [
        {
          name: "Joseph",
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
      src: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500",
      alt: "Romantic moment"
    }
  ];

  return (
    <div className="min-h-screen bg-rose-50 relative">
      <ConfettiBackground />
      
      {/* Header */}
      <header className="bg-rose-50/90 backdrop-blur-md py-6 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-[hsl(342,69%,29%)] hover:text-[hsl(342,60%,40%)] flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </Button>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => navigate("/")}
                className="text-[hsl(342,69%,29%)] hover:text-[hsl(342,60%,40%)] font-serif font-medium transition-colors"
              >
                Home
              </button>
              <span className="text-[hsl(342,69%,29%)] font-serif font-medium border-b-2 border-[hsl(342,69%,29%)]">
                Our Story
              </span>
              <button className="text-[hsl(342,69%,29%)] hover:text-[hsl(342,60%,40%)] font-serif font-medium transition-colors">
                Gallery
              </button>
            </nav>

            <div className="hidden md:flex space-x-6">
              <button className="text-[hsl(342,69%,29%)] hover:text-[hsl(342,60%,40%)] font-serif font-medium transition-colors">
                Registry
              </button>
              <button className="text-[hsl(342,69%,29%)] hover:text-[hsl(342,60%,40%)] font-serif font-medium transition-colors">
                Schedule
              </button>
              <button className="text-[hsl(342,69%,29%)] hover:text-[hsl(342,60%,40%)] font-serif font-medium transition-colors">
                RSVP
              </button>
            </div>

            {/* Logo/Monogram */}
            <div className="w-12 h-12 bg-[hsl(342,69%,29%)] rounded-full flex items-center justify-center">
              <span className="text-white font-script text-xl font-bold">O&J</span>
            </div>
          </div>
        </div>
      </header>

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
            <span className="text-[hsl(342,69%,29%)]">FROM LINKEDIN CONNECTION</span>
            <br />
            <span className="text-[hsl(332,51%,70%)]">TO CONVICTION</span>
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
                            {answer.name === "Funbi" ? "F" : answer.name === "Joseph" ? "J" : "F&J"}
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

        {/* Bottom Action Button */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Button 
            onClick={() => navigate("/")}
            className="bg-[hsl(342,69%,29%)] text-white px-12 py-4 rounded-full text-lg font-medium hover:bg-[hsl(342,60%,40%)] transition-colors shadow-lg"
          >
            Back to Wedding Details
          </Button>
        </motion.div>

        {/* Bottom Banner */}
        <div className="fixed bottom-0 left-0 right-0 bg-[hsl(342,69%,29%)] text-white py-3 text-center z-30">
          <div className="flex justify-center items-center space-x-6 text-sm">
            <button className="hover:text-[hsl(332,51%,70%)] transition-colors">Programme</button>
            <span>|</span>
            <button className="hover:text-[hsl(332,51%,70%)] transition-colors">Calendar</button>
            <span>|</span>
            <button className="hover:text-[hsl(332,51%,70%)] transition-colors">Get Direction</button>
            <span>|</span>
            <button className="hover:text-[hsl(332,51%,70%)] transition-colors">Check Table No.</button>
          </div>
        </div>
      </div>
    </div>
  );
}