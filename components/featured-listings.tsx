"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import PropertyCard from "./property-card"
import type { Property } from "@/types/property"

// Skeleton component for loading state
function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm h-full flex flex-col">
      <Skeleton className="aspect-[4/3] w-full rounded-t-lg" />
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-4 w-1/2 mb-2" />
        <div className="flex justify-between items-center pt-4 mt-auto space-x-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  )
}

// Featured properties content component
function FeaturedPropertiesContent() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const propertiesPerPage = 3

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties/featured')
        if (!response.ok) {
          throw new Error('Failed to fetch properties')
        }
        const data = await response.json()
        setProperties(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const totalPages = Math.ceil(properties.length / propertiesPerPage)
  const canGoNext = currentIndex < totalPages - 1
  const canGoPrev = currentIndex > 0

  const nextSlide = () => {
    if (canGoNext) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const prevSlide = () => {
    if (canGoPrev) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  const getCurrentProperties = () => {
    const startIndex = currentIndex * propertiesPerPage
    return properties.slice(startIndex, startIndex + propertiesPerPage)
  }

  if (loading) {
    return (
      <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
            ))}
          </div>
        </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load properties. Please try again later.</p>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
          <div className="text-center py-12">
        <p className="text-gray-600">No properties available at the moment.</p>
        </div>
    )
  }

  return (
    <div className="relative px-16 md:px-20"> {/* Add horizontal padding to make room for arrows */}
      {/* Navigation Arrows */}
      {properties.length > propertiesPerPage && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            disabled={!canGoPrev}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/90 hover:bg-white shadow-lg border border-gray-200 transition-all duration-200 ${
              !canGoPrev ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'
            }`}
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            disabled={!canGoNext}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/90 hover:bg-white shadow-lg border border-gray-200 transition-all duration-200 ${
              !canGoNext ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'
            }`}
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </Button>
        </>
      )}

      {/* Properties Carousel */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {getCurrentProperties().map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      {properties.length > propertiesPerPage && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                currentIndex === index
                  ? 'bg-[#473729] w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Property Counter */}
      {properties.length > propertiesPerPage && (
        <div className="text-center mt-4 text-sm text-gray-500">
          Showing {currentIndex * propertiesPerPage + 1}-{Math.min((currentIndex + 1) * propertiesPerPage, properties.length)} of {properties.length} properties
        </div>
      )}
    </div>
  )
}

export default function FeaturedListings() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-tenor-sans text-4xl md:text-5xl text-gray-900 mb-4"
          >
            Featured Properties
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Discover exceptional homes that define luxury living in Toronto's most prestigious neighborhoods
          </motion.p>
        </div>

        <Suspense 
          fallback={
            <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, index) => (
                  <PropertyCardSkeleton key={index} />
                ))}
              </div>
            </div>
          }
        >
          <FeaturedPropertiesContent />
        </Suspense>
       
      </div>
    </section>
  )
}
