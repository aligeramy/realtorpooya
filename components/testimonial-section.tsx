"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Quote } from "lucide-react"

interface Testimonial {
  id: number
  quote: string
  author: string
  position?: string
  highlight?: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "Pooya spotted structural issues our inspector missed and negotiated $45,000 in remediation. His technical knowledge is unmatched in Toronto's luxury market.",
    author: "Michael & Sarah Thompson",
    position: "Forest Hill",
    highlight: "technical knowledge",
  },
  {
    id: 2,
    quote:
      "Pooya's data-driven approach was leagues beyond others. He sold our home for $1.2M over asking in just 9 days when similar properties sat for months.",
    author: "Robert Chen",
    position: "CEO, Quantum Investments",
    highlight: "data-driven approach",
  },
  {
    id: 3,
    quote:
      "Pooya's negotiation skills secured our dream home despite not having the highest offer. His strategic thinking made all the difference.",
    author: "Jennifer & David Miller",
    position: "Yorkville",
    highlight: "negotiation skills",
  },
  {
    id: 4,
    quote:
      "His attention to detail ensured we stayed on budget and timeline. The finished home sold for 28% above neighborhood comparables.",
    author: "Alexandra Wilson",
    position: "Rosedale",
    highlight: "attention to detail",
  },
  {
    id: 5,
    quote:
      "Pooya's market analysis helped us build a portfolio of properties that have appreciated 43% in just three years. Truly exceptional.",
    author: "James & Victoria Harrington",
    position: "London, ON",
    highlight: "market analysis",
  },
]

// Create a duplicate array for infinite looping
const loopedTestimonials = [...testimonials, ...testimonials.slice(0, 2)]

export default function TestimonialSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [autoplayPaused, setAutoplayPaused] = useState(false)

  // Format the quote to highlight specific words
  const formatQuote = (quote: string, highlight?: string) => {
    if (!highlight) return quote

    const parts = quote.split(new RegExp(`(${highlight})`, "gi"))
    return parts.map((part, i) =>
      part.toLowerCase() === highlight?.toLowerCase() ? (
        <span key={i} className="text-[#473729] font-semibold">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  // Handle scrolling to a specific testimonial
  const scrollToTestimonial = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.clientWidth * 0.4 // 40vw on desktop
      const leftOffset = scrollRef.current.clientWidth * 0.2 // 20vw left margin
      const scrollPosition = leftOffset + cardWidth * index

      scrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })

      setActiveIndex(index % testimonials.length)
    }
  }

  // Handle looping
  const handleLoop = () => {
    if (!scrollRef.current) return

    const totalWidth = scrollRef.current.scrollWidth
    const viewportWidth = scrollRef.current.clientWidth
    const maxScroll = totalWidth - viewportWidth
    const currentScroll = scrollRef.current.scrollLeft

    // If we're near the end, jump to the beginning (duplicate section)
    if (currentScroll > maxScroll - 100) {
      // Calculate position of the first duplicate item
      const cardWidth = viewportWidth * 0.4
      const leftOffset = viewportWidth * 0.2
      const resetPosition = leftOffset + cardWidth * 0

      // Jump without animation
      scrollRef.current.scrollTo({
        left: resetPosition,
        behavior: "auto",
      })

      setActiveIndex(0)
    }

    // If we're near the beginning and going backwards, jump to the end
    if (currentScroll < 100 && activeIndex === 0) {
      // Calculate position of the last original item
      const cardWidth = viewportWidth * 0.4
      const leftOffset = viewportWidth * 0.2
      const resetPosition = leftOffset + cardWidth * (testimonials.length - 1)

      // Jump without animation
      scrollRef.current.scrollTo({
        left: resetPosition,
        behavior: "auto",
      })

      setActiveIndex(testimonials.length - 1)
    }
  }

  // Auto-scroll functionality
  useEffect(() => {
    if (autoplayPaused) return

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % testimonials.length
      scrollToTestimonial(nextIndex)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [activeIndex, autoplayPaused])

  // Dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return

    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
    setAutoplayPaused(true)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return

    setIsDragging(true)
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
    setAutoplayPaused(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return

    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2 // Faster scrolling
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return

    const x = e.touches[0].pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleDragEnd = () => {
    setIsDragging(false)

    // Resume autoplay after 5 seconds of inactivity
    setTimeout(() => {
      setAutoplayPaused(false)
    }, 5000)

    // Snap to the nearest testimonial
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.clientWidth * 0.4
      const leftOffset = scrollRef.current.clientWidth * 0.2
      const scrollPosition = scrollRef.current.scrollLeft - leftOffset
      const index = Math.round(scrollPosition / cardWidth)
      const boundedIndex = Math.max(0, Math.min(loopedTestimonials.length - 1, index))

      // Only update if we've actually moved to a different testimonial
      if (boundedIndex % testimonials.length !== activeIndex) {
        setActiveIndex(boundedIndex % testimonials.length)
      }

      // Smooth scroll to the nearest testimonial
      scrollToTestimonial(boundedIndex)
    }
  }

  // Update active index when scrolling
  const handleScroll = () => {
    if (!scrollRef.current || isDragging) return

    const cardWidth = scrollRef.current.clientWidth * 0.4
    const leftOffset = scrollRef.current.clientWidth * 0.2
    const scrollPosition = scrollRef.current.scrollLeft - leftOffset
    const index = Math.round(scrollPosition / cardWidth)
    const boundedIndex = Math.max(0, Math.min(loopedTestimonials.length - 1, index))

    if (boundedIndex % testimonials.length !== activeIndex) {
      setActiveIndex(boundedIndex % testimonials.length)
    }

    // Check if we need to loop
    handleLoop()
  }

  return (
    <section className="py-16 bg-[#f9f6f1]">
      <div className="relative overflow-hidden">
        <motion.div
          ref={scrollRef}
          className="flex overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
          onScroll={handleScroll}
        >
          {/* Spacer for left margin */}
          <div className="flex-shrink-0 w-[10vw] md:w-[20vw]"></div>

          {loopedTestimonials.map((testimonial, index) => (
            <div key={`${testimonial.id}-${index}`} className="flex-shrink-0 w-[80vw] md:w-[40vw] px-4 snap-center">
              <div className="bg-white rounded-2xl p-6 md:p-8 h-full">
                <div className="mb-4">
                  <Quote className="h-6 w-6 text-[#aa9578] opacity-30" />
                </div>

                <p className="text-lg  text-gray-800 leading-relaxed mb-6 font-light">
                  {formatQuote(testimonial.quote, testimonial.highlight)}
                </p>

                <div className="mt-auto">
                  <h4 className="font-manrope  text-gray-500">{testimonial.author}</h4>
                  {testimonial.position && <p className="text-[#aa9578] text-sm">{testimonial.position}</p>}
                </div>
              </div>
            </div>
          ))}

          {/* Spacer for right margin */}
          <div className="flex-shrink-0 w-[10vw] md:w-[20vw]"></div>
        </motion.div>

        {/* Horizontal line indicators instead of dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              className={`h-[1px] w-[20px] focus:outline-none transition-colors duration-300 ${
                activeIndex === index ? "bg-[#473729]" : "bg-[#e9e0cc]"
              }`}
              onClick={() => {
                scrollToTestimonial(index)
                setAutoplayPaused(true)
                setTimeout(() => setAutoplayPaused(false), 5000)
              }}
              aria-label={`View testimonial ${testimonial.id}`}
            ></button>
          ))}
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
