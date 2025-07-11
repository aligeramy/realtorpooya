"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import BookShowingButton from "./book-showing-button"

export default function AboutAgent() {
  return (
    <section className="py-20 md:pt-32 md:pb-10 bg-[#f9f6f1]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <h3 className="text-[#aa9578] font-manrope text-md mb-4 uppercase tracking-widest">Meet Your Agent</h3>
            <h2 className="font-tenor-sans text-3xl md:text-4xl text-gray-900 mb-6 tracking-tighter">
              Working with a <span className="text-[#473729]">Trusted</span> Partner
            </h2>

            <p className="text-gray-700 font-manrope text-lg leading-relaxed mb-8">
              Pooya Pirayesh is a Toronto-based engineer-turned-luxury-realtor who shepherds clients through the full
              property lifecycle—sourcing land, overseeing seven-figure custom builds, then listing the finished home
              for maximum return. His boots-on-site experience and data-driven market strategy have helped clients
              capitalize on a GTA luxury segment.
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 mb-8">
              <div className="flex flex-col p-3 sm:p-5 border border-[#473729]/5 bg-[#473729]/5 rounded-md">
                <span className="font-tenor-sans text-2xl sm:text-4xl text-[#473729]">150+</span>
                <span className="text-gray-600 text-xs sm:text-base">Properties Sold</span>
              </div>
              <div className="flex flex-col p-3 sm:p-5 bg-[#473729]/5 border border-[#473729]/5 rounded-md">
                <span className="font-tenor-sans text-2xl sm:text-4xl text-[#473729]">$500M+</span>
                <span className="text-gray-600 text-xs sm:text-base">In Sales Volume</span>
              </div>
              <div className="flex flex-col p-3 sm:p-5 border border-[#473729]/5 bg-[#473729]/5 rounded-md">
                <span className="font-tenor-sans text-2xl sm:text-4xl text-[#473729]">12+</span>
                <span className="text-gray-600 text-xs sm:text-base">Years Experience</span>
              </div>
            </div>

            <BookShowingButton variant="primary" size="xl" />
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative h-[500px] md:h-[600px] w-full rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/pooya-profile.jpg"
                alt="Pooya Pirayesh"
                fill
                className="object-cover object-top"
                priority
              />

              {/* Info Card */}
              <div className="absolute bottom-8 right-8 left-8  bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg">
                <h4 className="text-[#473729] font-manrope text-xs uppercase tracking-widest mb-1">
                  Luxury Real Estate Specialist
                </h4>
                <h3 className="font-tenor-sans text-3xl tracking-tighter text-gray-900 mb-2">Pooya Pirayesh</h3>
                <p className="text-gray-700 mb-4">
                  From our first conversation to the final handshake, I provide the insight and support you need to
                  achieve your property goals.
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-[#f3ecdf] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#aa9578]"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">416-553-7707</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
