"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import PropertyCard from "./property-card"
import type { Property } from "@/types/property"

export default function FeaturedListings() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div key={property.id} className="h-full">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>

        {/* Only show "View All Listings" if there are 4 or more properties */}
        {properties.length >= 4 && (
          <div className="mt-12 text-center">
            <Button className="bg-[#f3ecdf] text-[#aa9578] hover:bg-[#e9e0cc] rounded-full px-8 py-6 font-manrope text-lg">
              View All Listings
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
