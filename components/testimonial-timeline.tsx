"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

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
      "Pooya's engineering background gave us confidence during our custom build. He spotted structural issues our inspector missed and negotiated $45,000 in remediation from the seller. His technical knowledge is unmatched in Toronto's luxury market.",
    author: "Michael & Sarah Thompson",
    position: "Forest Hill",
    highlight: "technical knowledge",
  },
  {
    id: 2,
    quote:
      "We interviewed five top agents before listing our Bridle Path estate. Pooya's data-driven approach and market analysis was leagues beyond the others. He sold our home for $1.2M over asking in just 9 days when similar properties sat for months.",
    author: "Robert Chen",
    position: "CEO, Quantum Investments",
    highlight: "data-driven approach",
  },
  {
    id: 3,
    quote:
      "After two failed attempts with other realtors, Pooya helped us find the perfect Yorkville property and guided us through a complex bidding war. His negotiation skills and strategic thinking secured our dream home despite not having the highest offer.",
    author: "Jennifer & David Miller",
    position: "Yorkville",
    highlight: "negotiation skills",
  },
  {
    id: 4,
    quote:
      "Pooya managed our entire custom build from land acquisition to final staging. His attention to detail and project management skills ensured we stayed on budget and timeline. The finished home sold for 28% above neighborhood comparables.",
    author: "Alexandra Wilson",
    position: "Rosedale",
    highlight: "attention to detail",
  },
  {
    id: 5,
    quote:
      "As international investors, we needed someone who understood Toronto's luxury market intimately. Pooya's comprehensive market analysis and investment strategy helped us build a portfolio of high-performing properties that have appreciated 43% in just three years.",
    author: "James & Victoria Harrington",
    position: "London, UK",
    highlight: "investment strategy",
  },
]

export default function TestimonialTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth)
      const handleResize = () => {
        setWindowWidth(window.innerWidth)
      }
      window.addEventListener("resize", handleResize)
      return () => {
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      // Set the container height to be enough to force scrolling through all testimonials
      // For mobile, we stack them, so we need more height
      const cardHeight = windowWidth >= 768 ? 300 : 400
      const totalHeight = cardHeight * testimonials.length + window.innerHeight
      setContainerHeight(totalHeight)
    }
  }, [windowWidth])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  return (
    <section className="relative bg-white py-20">
      <div className="container mx-auto px-4 mb-16">
        <h2 className="font-tenor-sans text-4xl md:text-5xl text-center text-gray-900 mb-4">Client Testimonials</h2>
        <p className="text-[#aa9578] font-manrope text-lg md:text-xl text-center max-w-2xl mx-auto">
          Discover what our clients have to say about their experience working with Pooya Pirayesh
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: containerHeight > 0 ? `${containerHeight}px` : "100vh" }}
      >
        <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  progress={scrollYProgress}
                  index={index}
                  total={testimonials.length}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

interface TestimonialCardProps {
  testimonial: Testimonial
  progress: any
  index: number
  total: number
}

function TestimonialCard({ testimonial, progress, index, total }: TestimonialCardProps) {
  // Calculate when this card should be visible
  const start = index / total
  const end = (index + 1) / total

  // Transform the opacity based on scroll progress
  const opacity = useTransform(progress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0])
  const y = useTransform(progress, [start, start + 0.1, end - 0.1, end], [100, 0, 0, -100])
  const scale = useTransform(progress, [start, start + 0.1, end - 0.1, end], [0.8, 1, 1, 0.8])

  // Alternate card colors
  const bgColors = [
    "bg-[#f9f6f1]", // Light beige
    "bg-[#e9f7f9]", // Light teal
  ]
  const bgColor = bgColors[index % bgColors.length]

  // Format the quote to highlight specific words
  const formatQuote = (quote: string, highlight?: string) => {
    if (!highlight) return quote

    const parts = quote.split(new RegExp(`(${highlight})`, "gi"))
    return parts.map((part, i) =>
      part.toLowerCase() === highlight?.toLowerCase() ? (
        <span key={i} className="text-[#4AAEBB] font-semibold">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  return (
    <motion.div
      className={`absolute inset-0 w-full md:w-[90%] mx-auto ${index % 2 === 0 ? "md:ml-0" : "md:mr-0"}`}
      style={{ opacity, y, scale }}
    >
      <div
        className={`${bgColor} rounded-2xl p-8 md:p-12 shadow-lg max-w-3xl mx-auto md:mx-0 ${
          index % 2 === 0 ? "md:ml-0" : "md:mr-0"
        }`}
      >
        <div className="mb-6">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#aa9578] opacity-40"
          >
            <path
              d="M17.5 10C15.8333 10.8333 14.5833 12.0833 13.75 13.75C12.9167 15.4167 12.5 17.0833 12.5 18.75C12.5 21.25 13.3333 23.3333 15 25C16.6667 26.6667 18.75 27.5 21.25 27.5C23.75 27.5 25.8333 26.6667 27.5 25C29.1667 23.3333 30 21.25 30 18.75C30 16.25 29.1667 14.1667 27.5 12.5C25.8333 10.8333 23.75 10 21.25 10C20.4167 10 19.5833 10.0833 18.75 10.25C19.5833 9.41667 20.8333 8.75 22.5 8.25C24.1667 7.75 25.8333 7.5 27.5 7.5V5C25 5 22.5 5.41667 20 6.25C17.5 7.08333 15.4167 8.33333 13.75 10H17.5Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <p className=" text-xl md:text-2xl text-gray-800 leading-relaxed mb-8">
          {formatQuote(testimonial.quote, testimonial.highlight)}
        </p>

        <div className="flex items-center">
          <div className="flex-1">
            <h4 className="font-manrope font-semibold text-gray-900">{testimonial.author}</h4>
            {testimonial.position && <p className="text-[#aa9578]">{testimonial.position}</p>}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
