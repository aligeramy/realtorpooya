"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import PropertyCard from "./property-card"
import type { Property } from "@/types/property"

export default function FeaturedListings() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const propertiesPerPage = 3

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await fetch('/api/properties/featured')
        if (response.ok) {
          const featuredProperties = await response.json()
          setProperties(featuredProperties)
        } else {
          console.log('No featured properties found')
          setProperties([])
        }
      } catch (error) {
        console.error('Error fetching featured properties:', error)
        setProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProperties()
  }, [])

  // Calculate pagination
  const totalPages = Math.ceil(properties.length / propertiesPerPage)
  const startIndex = currentPage * propertiesPerPage
  const currentProperties = properties.slice(startIndex, startIndex + propertiesPerPage)

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="font-tenor-sans text-4xl md:text-5xl text-black mb-4 md:mb-0">FEATURED LISTINGS</h2>
            <p className="text-[#aa9578] font-manrope text-lg md:text-xl max-w-md">
              Presenting the highlighted listings tailored to suit your preferences
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-2xl aspect-[4/3]"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // If no properties, show a message or hide the section
  if (properties.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="font-tenor-sans text-4xl md:text-5xl text-black mb-4 md:mb-0">FEATURED LISTINGS</h2>
            <p className="text-[#aa9578] font-manrope text-lg md:text-xl max-w-md">
              Presenting the highlighted listings tailored to suit your preferences
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No featured properties available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Please check back later or contact us for available listings.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="font-tenor-sans text-4xl md:text-5xl text-black mb-4 md:mb-0">FEATURED LISTINGS</h2>
          <p className="text-[#aa9578] font-manrope text-lg md:text-xl max-w-md">
            Presenting the highlighted listings tailored to suit your preferences
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {currentProperties.map((property) => (
            <div key={property.id} className="h-full">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>

        {/* Navigation Controls - Only show if more than 3 properties */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevPage}
              className="rounded-full border-[#aa9578] text-[#aa9578] hover:bg-[#aa9578] hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page Indicators */}
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentPage === i
                      ? 'bg-[#aa9578]'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              className="rounded-full border-[#aa9578] text-[#aa9578] hover:bg-[#aa9578] hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Property Status Info */}
        {properties.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-600">
            Showing {currentProperties.length} of {properties.length}  properties
          </div>
        )}

        {/* View All Listings Button */}
        <div className="mt-12 text-center hidden">
          <Button className="bg-[#f3ecdf] text-[#aa9578] hover:bg-[#e9e0cc] rounded-full px-8 py-6 font-manrope text-lg">
            View All Listings
          </Button>
        </div>
      </div>
    </section>
  )
}
