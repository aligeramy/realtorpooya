"use client"

import { useRef, useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function SuccessVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    const videoElement = videoRef.current
    if (videoElement) {
      videoElement.addEventListener("loadeddata", () => {
        setIsVideoLoaded(true)
      })

      // Play the video when it's ready
      if (videoElement.readyState >= 3) {
        setIsVideoLoaded(true)
      }
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("loadeddata", () => {
          setIsVideoLoaded(true)
        })
      }
    }
  }, [])

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto">
        <div className="relative w-full h-[80vh] rounded-3xl overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 w-full h-full bg-black/20 z-10"></div>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              isVideoLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src="/videos/success.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Content Overlay */}
          <div className="relative z-20 h-full flex flex-col justify-center p-8 md:p-16 lg:p-24 max-w-4xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-[#fff] uppercase font-montserrat text-lg mb-4 tracking-widest"
            >
              Beyond the Expected
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="font-tenor-sans text-5xl text-white mb-8 leading-tight"
            >
              Your Success is Our Success
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-white/90 text-lg md:text-xl mb-6 max-w-3xl font-light"
            >
              At Pooya Pirayeshakbari Luxury Real Estate, we only succeed when you achieve your goal, whether it's selling,
              letting your property, or buying a property. Unlike traditional estate agents, our brokerage model
              operates on a commission-only basis, meaning our trusted property partners are not only highly experienced
              and knowledgeable but also must be successful to be part of our team.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <Link
                href="/why-us"
                className="inline-flex items-center justify-center bg-white rounded-full h-16 w-16 group hover:bg-white/90 transition-colors"
              >
                <span className="sr-only">Why us</span>
                <ArrowRight className="h-6 w-6 text-gray-900 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Logo in bottom right */}
            <div className="absolute bottom-8 right-8">
              <svg
                width="80"
                height="40"
                viewBox="0 0 80 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                 <path d="M22.52,0C27.57,0,34.88,3.98,38.07,7.83c10.11,12.2,3.93,30.73-11.32,34.41-.7-7.8-3.85-15.08-10.03-20.03-2.21-1.77-4.79-2.72-7.06-4.27C4.01,14.11.43,7.92,0,1.09-.03.55.42,0,.97,0,10.52,0,14.6,0,22.52,0Z"/>
                <path  d="M22.17,62.6c0,.54-.43,1.01-.98,1-7.32-.02-14.39-4.69-17.82-11.06-.81-1.49-2.54-5.93-2.54-7.47v-23.18c0-.55.44-1.01.99-1,7.23.08,14.17,4.51,17.65,10.77.68,1.22,2.7,5.77,2.7,6.88v24.06Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
