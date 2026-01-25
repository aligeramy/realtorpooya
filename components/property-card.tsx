"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { MapPin, Bed, Bath, Scaling } from "lucide-react"
import type { Property } from "@/types/property"
import { createAddressSlug } from "@/lib/utils"

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
    // Create URL slug from address
    const addressSlug = createAddressSlug(property.address)
    // Navigate to the property page using address slug
    router.push(`/listings/${addressSlug}`)
  }

  return (
    <div onClick={handleClick} className="group cursor-pointer h-full">
      <div className="bg-white rounded-lg border-2 border-gray-200 hover:border-[#aa9578]/40 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col relative">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#aa9578]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
        
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={
              property.heroImage || 
              (property.mediaUrls && property.mediaUrls.length > 0 ? property.mediaUrls[0] : null) || 
              "/placeholder.svg?height=400&width=600&query=luxury home"
            }
            alt={propertyAddress}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {/* Always visible gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          {/* Enhanced gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#aa9578]/30 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Text overlay on image */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-20">
            <div className="text-xl font-medium mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tabular-nums">
              {property.status === "not_available" ? "Not Available" : formatPrice(property.price)}
            </div>
            <h3 className="font-tenor-sans text-2xl font-semibold mb-2 line-clamp-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
              {propertyAddress}
            </h3>
            <div className="flex items-center text-white/90 text-sm mb-3 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              <MapPin className="h-3.5 w-3.5 mr-1.5" />
              <span>{property.city}, {property.province}</span>
            </div>
            
            {/* Property detail badges on image - bottom row */}
            <div className="flex items-center gap-1.5 z-20">
              {property.bedrooms && (
                <div className="flex items-center gap-1 bg-black/20 backdrop-blur-md text-white px-2 py-1 rounded-md shadow-lg border border-white/30">
                  <Bed className="h-3 w-3 text-white" />
                  <span className="text-xs font-medium">{property.bedrooms}</span>
                  <span className="text-[10px] text-white/90">Bed</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-1 bg-black/20 backdrop-blur-md text-white px-2 py-1 rounded-md shadow-lg border border-white/30">
                  <Bath className="h-3 w-3 text-white" />
                  <span className="text-xs font-medium">{property.bathrooms}</span>
                  <span className="text-[10px] text-white/90">Bath</span>
                </div>
              )}
              {property.squareFeet && (
                <div className="flex items-center gap-1 bg-black/20 backdrop-blur-md text-white px-2 py-1 rounded-md shadow-lg border border-white/30">
                  <Scaling className="h-3 w-3 text-white" />
                  <span className="text-xs font-medium">{property.squareFeet.toLocaleString()}</span>
                  <span className="text-[10px] text-white/90">sq ft</span>
                </div>
              )}
            </div>
          </div>

          {/* Status overlay */}
          {property.status === "sold" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
              <div className="bg-red-600/90 backdrop-blur-md text-white px-6 py-3 rounded-md font-tenor-sans text-xl font-semibold border border-white/30 shadow-xl">
                SOLD
              </div>
            </div>
          )}
          {property.status === "not_available" && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-30">
              <div className="bg-gray-700/90 backdrop-blur-md text-white px-6 py-3 rounded-md font-tenor-sans text-lg font-semibold border border-white/30 shadow-xl">
                NOT AVAILABLE
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
