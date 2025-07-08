"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import PropertyCard from "./property-card"
import type { Property } from "@/types/property"

// Updated properties for the featured listings
const mockProperties: Property[] = [
  {
    id: "1",
    address: "266 Westlake Ave",
    city: "Toronto",
    province: "ON",
    postal_code: "M5M 3H5",
    property_type: "house",
    price: 4800500,
    bedrooms: 4,
    bathrooms: 3,
    square_feet: 3200,
    hero_image: "/properties/1/hero.jpg",
    status: "sold",
    listing_date: new Date().toISOString(),
    description: "Modern architectural masterpiece with floor-to-ceiling windows and open concept living",
  },
  {
    id: "2",
    address: "10 Howick Ln",
    city: "Toronto",
    province: "ON",
    postal_code: "M2N 0B4",
    property_type: "house",
    price: 4250000,
    bedrooms: 5,
    bathrooms: 4,
    square_feet: 3500,
    hero_image: "/properties/2/hero.jpg",
    status: "sold",
    listing_date: new Date().toISOString(),
    description: "Contemporary waterfront villa with infinity pool and stunning night lighting",
  },
  {
    id: "3",
    address: "85 Rosedale Heights Dr",
    city: "Toronto",
    province: "ON",
    postal_code: "M4T 1C4",
    property_type: "house",
    price: 3950000,
    bedrooms: 4,
    bathrooms: 3,
    square_feet: 2900,
    hero_image: "/images/property-3.jpg",
    status: "sold",
    listing_date: new Date().toISOString(),
    description: "Elegant luxury residence with premium finishes and private garden oasis",
  },
]

export default function FeaturedListings() {
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await fetch('/api/properties/featured')
        if (response.ok) {
          const featuredProperties = await response.json()
          if (featuredProperties.length >= 3) {
            // If we have 3 or more from API, use API data
            setProperties(featuredProperties.slice(0, 3))
          } else {
            // If we have fewer than 3 from API, combine with mock data
            const combinedProperties = [...featuredProperties]
            const remainingCount = 3 - featuredProperties.length
            
            // Add mock properties to fill up to 3 total
            for (let i = 0; i < remainingCount && i < mockProperties.length; i++) {
              const mockProperty = mockProperties[i]
              // Make sure we don't add duplicate IDs
              if (!combinedProperties.some(p => p.id === mockProperty.id)) {
                combinedProperties.push(mockProperty)
              }
            }
            
            setProperties(combinedProperties.slice(0, 3))
          }
        } else {
          console.log('No featured properties found, using mock data')
          setProperties(mockProperties)
        }
      } catch (error) {
        console.error('Error fetching featured properties:', error)
        // Keep using mock data on error
        setProperties(mockProperties)
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
