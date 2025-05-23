"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Home, Building, TrendingUp, MessageCircle } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface JourneyStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  image: string
}

export default function RealEstateJourney() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])
  const [showSupportModal, setShowSupportModal] = useState(false)

  const steps: JourneyStep[] = [
    {
      id: 1,
      title: "Purchase Property",
      description: "Start your journey by selecting the ideal property — we guide you every step of the way.",
      icon: <Home className="h-6 w-6" />,
      image: "/images/journey-1.jpg",
    },
    {
      id: 2,
      title: "Build Property",
      description: "Bring your vision to life with expert planning, design, and execution.",
      icon: <Building className="h-6 w-6" />,
      image: "/images/journey-2.jpg",
    },
    {
      id: 3,
      title: "Sell the New Property",
      description: "Maximize your returns with a smooth, supported selling experience.",
      icon: <TrendingUp className="h-6 w-6" />,
      image: "/images/journey-3.jpg",
    },
  ]

  // Intersection observer to detect which step is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = stepsRef.current.findIndex((ref) => ref === entry.target)
            if (index !== -1) {
              setActiveStep(index)
            }
          }
        })
      },
      { threshold: 0.6, root: null },
    )

    stepsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      stepsRef.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [])

  // Parallax scroll effect for the section title
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const titleY = useTransform(scrollYProgress, [0, 0.5], [100, 0])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Title with Parallax Effect */}
        <motion.div className="text-center mb-32 md:mb-60" style={{ y: titleY, opacity: titleOpacity }}>
          <h2 className="font-tenor-sans text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">
            The Real Estate Journey
          </h2>
          <p className="text-[#aa9578] font-manrope text-lg md:text-xl max-w-2xl mx-auto">
            A seamless process from acquisition to profitable sale
          </p>
        </motion.div>

        {/* Main content with sticky image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative">
          {/* Left Column - Steps Content */}
          <div className="space-y-32 pb-32">
            {steps.map((step, index) => (
              <div key={step.id} ref={(el) => (stepsRef.current[index] = el)} className="min-h-[40vh]">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-[#f3ecdf] flex items-center justify-center shadow-sm">
                      {step.icon}
                    </div>
                    <div className="ml-4">
                      <span className="text-[#aa9578] font-montserrat text-sm uppercase tracking-widest">
                        Step {step.id}
                      </span>
                      <h3 className="font-tenor-sans text-3xl md:text-4xl text-gray-900">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed max-w-xl font-light">{step.description}</p>

                  {/* Support Card after Step 3 */}
                  {step.id === 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      viewport={{ once: true }}
                      className="mt-12"
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="bg-gradient-to-r from-[#f3ecdf] to-[#f9f6f1] p-6 rounded-xl cursor-pointer hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-start">
                              <div className="bg-white rounded-full p-3 mr-4">
                                <MessageCircle className="h-6 w-6 text-[#4AAEBB]" />
                              </div>
                              <div>
                                <h4 className="font-tenor-sans text-xl text-gray-900 mb-2">
                                  Need help making it happen?
                                </h4>
                                <p className="text-gray-700 font-light">Let's talk about how we support your vision.</p>
                              </div>
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <div className="p-4 text-center">
                            <div className="w-16 h-16 bg-[#f3ecdf] rounded-full flex items-center justify-center mx-auto mb-4">
                              <MessageCircle className="h-8 w-8 text-[#4AAEBB]" />
                            </div>
                            <h3 className="font-tenor-sans text-2xl text-gray-900 mb-4">We're Here to Help</h3>
                            <p className="text-gray-700 mb-6">
                              We support your goals every step of the way — reach out to explore how we can help.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                              <Button className="bg-[#4AAEBB] hover:bg-[#3a9aa7] rounded-full">Contact Us</Button>
                              <Button variant="outline" className="rounded-full">
                                Learn More
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>

          {/* Right Column - Sticky Image */}
          <div className="hidden lg:block">
            <div className="sticky top-[25vh]" style={{ marginTop: "0" }}>
              {/* Image Container */}
              <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-xl bg-gray-100">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: activeStep === index ? 1 : 0,
                      transition: { duration: 0.8, ease: "easeInOut" },
                    }}
                  >
                    <Image
                      src={step.image || "/placeholder.svg"}
                      alt={step.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Step Icons BELOW the image */}
              <div className="flex justify-center space-x-8 mt-8">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center transition-opacity duration-500 ${
                      activeStep === index ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${
                        activeStep === index ? "bg-[#4AAEBB] text-white" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <span className="text-xs font-medium mt-2">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
