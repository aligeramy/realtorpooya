"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { MapPin, Bed, Bath, Scaling } from "lucide-react"
import type { Property } from "@/types/property"

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter()

  // Format price with commas
  const formatPrice = (price: number | undefined) => {
    if (!price) return "Price upon request"
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    })
  }

  // Use address instead of property name
  const propertyAddress = property.address

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    // Navigate to the property page
    router.push(`/listings/${property.id}`)
    // Ensure we're at the top of the page
    window.scrollTo(0, 0)
  }

  return (
    <div onClick={handleClick} className="group cursor-pointer h-full">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <Image
            src={property.hero_image || "/placeholder.svg?height=400&width=600&query=luxury home"}
            alt={propertyAddress}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-5 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-tenor-sans text-xl text-gray-900">{propertyAddress}</h3>
            <span className="font-manrope font-semibold text-xl text-gray-900">{formatPrice(property.price)}</span>
          </div>

          <div className="flex items-center text-[#aa9578] -mt-1 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {property.city}, {property.province}
            </span>
          </div>

          <div className="flex justify-between items-center pt-4 mt-auto">
            {property.bedrooms && (
              <div className="flex items-center text-gray-600 border border-gray-200 rounded-md px-3 py-1.5">
                <Bed className="h-4 w-4 mr-1.5" />
                <span className="text-sm">{property.bedrooms} Beds</span>
              </div>
            )}

            {property.bathrooms && (
              <div className="flex items-center text-gray-600 border border-gray-200 rounded-md px-3 py-1.5">
                <Bath className="h-4 w-4 mr-1.5" />
                <span className="text-sm">{property.bathrooms} Baths</span>
              </div>
            )}

            {property.square_feet && (
              <div className="flex items-center text-gray-600 border border-gray-200 rounded-md px-3 py-1.5">
                <Scaling className="h-4 w-4 mr-1.5" />
                <span className="text-sm">{property.square_feet.toLocaleString()} sqft</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
