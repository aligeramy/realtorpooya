"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import PropertyCard from "./property-card"
import type { Property } from "@/types/property"
import Image from "next/image"
import { MapPin } from "lucide-react"

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
    status: "for_sale",
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
    status: "for_sale",
    listing_date: new Date().toISOString(),
    description: "Contemporary waterfront villa with infinity pool and stunning night lighting",
  },
]

// Special Coming Soon property
const comingSoonProperty = {
  id: "coming-soon",
  address: "Luxury Property",
  city: "Toronto",
  province: "ON",
  status: "coming_soon" as any,
  hero_image: "/images/property-3.jpg",
}

export default function FeaturedListings() {
  const [properties, setProperties] = useState<Property[]>(mockProperties)

  // Custom Coming Soon Card Component
  const ComingSoonCard = () => {
    return (
      <div className="group h-full">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm h-full flex flex-col relative">
          {/* Image Container with blur effect */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={comingSoonProperty.hero_image || "/placeholder.svg?height=400&width=600&query=luxury home"}
              alt="Coming Soon"
              fill
              className="object-cover blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/95 backdrop-blur-sm px-8 py-3 rounded-full">
                <span className="font-manrope font-semibold text-lg text-gray-900">Coming Soon</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="font-tenor-sans p-4 flex-grow flex flex-col">
            {/* Title */}
            <h3 className="font-manrope font-semibold text-lg text-gray-900 mb-2">{comingSoonProperty.address}</h3>

            {/* Location */}
            <div className="flex items-center text-gray-500 text-sm mb-4">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>
                {comingSoonProperty.city}, {comingSoonProperty.province}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mt-auto">
              A new luxury property will be available soon.
            </p>
          </div>
        </div>
      </div>
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
          <ComingSoonCard />
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
