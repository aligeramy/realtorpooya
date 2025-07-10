"use client"

import { useEffect, useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MapPin, Bed, Bath, Square, Calendar, Share2, Heart, Phone, ChevronLeft, Play, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import PropertyImageGallery from "@/components/property-image-gallery"
import PropertyFeatures from "@/components/property-features"
import TopNavMenu from "@/components/top-nav-menu"
import BookShowingButton from "@/components/book-showing-button"
import VideoPlayer from "@/components/video-player"
import type { Property } from "@/types/property"
import { createAddressSlug, findPropertyBySlug } from "@/lib/utils"
import ResponsiveLogo from "@/components/responsive-logo"

interface PageProps {
  params: Promise<{ id: string }>
}

// Function to extract features from property.features JSONB and property.more JSONB
function extractFeatures(property: Property): string[] {
  const features: string[] = []
  
  // Debug: log the raw features data to understand the format
  console.log('Raw features data:', property.features, 'Type:', typeof property.features)
  console.log('Is array?', Array.isArray(property.features))
  
  // Add features from the JSONB features column
  if (property.features) {
    if (Array.isArray(property.features)) {
      // JSONB array - process each item
      property.features.forEach((item: any, index: number) => {
        console.log(`Processing item ${index}:`, item, 'Type:', typeof item)
        if (typeof item === 'string') {
          // Check if it's a JSON string that needs parsing
          if (item.startsWith('[') && item.endsWith(']')) {
            console.log('Found JSON array string, parsing:', item)
            try {
              const parsed = JSON.parse(item)
              console.log('Parsed successfully:', parsed)
              if (Array.isArray(parsed)) {
                const validFeatures = parsed.filter((f: any) => f && typeof f === 'string')
                console.log('Adding parsed features:', validFeatures)
                features.push(...validFeatures)
              }
            } catch (error) {
              console.log('Parsing failed:', error)
              // If parsing fails, treat as regular string
              features.push(item)
            }
          } else {
            // Regular string feature
            console.log('Adding regular string feature:', item)
            features.push(item)
          }
        } else if (Array.isArray(item)) {
          // Nested array
          console.log('Found nested array:', item)
          features.push(...item.filter((f: any) => f && typeof f === 'string'))
        }
      })
    } else if (typeof property.features === 'object') {
      // JSONB object - extract values that look like features
      Object.values(property.features as Record<string, any>).forEach(value => {
        if (value && typeof value === 'string') {
          features.push(value)
        } else if (Array.isArray(value)) {
          features.push(...value.filter((f: any) => f && typeof f === 'string'))
        }
      })
    } else if (typeof property.features === 'string') {
      // Single feature as string - check if it's a JSON array
      if (property.features.startsWith('[') && property.features.endsWith(']')) {
        try {
          const parsed = JSON.parse(property.features)
          if (Array.isArray(parsed)) {
            features.push(...parsed.filter((f: any) => f && typeof f === 'string'))
          }
        } catch {
          features.push(property.features)
        }
      } else {
        features.push(property.features)
      }
    }
  }
  
  // Add features from the more JSONB column
  // The more field should be structured as: { "category_name": ["feature1", "feature2", ...] }
  if (property.more && typeof property.more === 'object') {
    console.log('Processing property.more:', property.more)
    Object.entries(property.more as Record<string, any>).forEach(([categoryKey, categoryValue]) => {
      console.log(`Processing category: ${categoryKey}, value:`, categoryValue)
      
      // Skip non-feature categories (like tps, etc.)
      const skipCategories = ['tps', 'total_parking_space', 'parking_space', 'id', 'created_at', 'updated_at']
      if (skipCategories.includes(categoryKey.toLowerCase())) {
        console.log(`Skipping non-feature category: ${categoryKey}`)
        return
      }
      
      if (categoryValue) {
        if (Array.isArray(categoryValue)) {
          // Category value is already an array
          const validFeatures = categoryValue.filter((f: any) => f && typeof f === 'string')
          console.log(`Adding features from category ${categoryKey}:`, validFeatures)
          features.push(...validFeatures)
        } else if (typeof categoryValue === 'string') {
          // Check if it's a JSON array string
          if (categoryValue.startsWith('[') && categoryValue.endsWith(']')) {
            console.log('Category value is JSON array string, parsing:', categoryValue)
            try {
              const parsed = JSON.parse(categoryValue)
              if (Array.isArray(parsed)) {
                const validFeatures = parsed.filter((f: any) => f && typeof f === 'string')
                console.log(`Adding parsed features from category ${categoryKey}:`, validFeatures)
                features.push(...validFeatures)
              }
            } catch (error) {
              console.log('Failed to parse JSON from category:', error)
              // Treat as single feature
              features.push(categoryValue)
            }
          } else {
            // Single feature string
            console.log(`Adding single feature from category ${categoryKey}:`, categoryValue)
            features.push(categoryValue)
          }
        }
      }
    })
  }
  
  const finalFeatures = features.filter((f: string) => f && f.length > 0) // Remove empty features
  console.log('Final features array:', finalFeatures)
  return finalFeatures
}

export default function PropertyPage({ params }: PageProps) {
  const router = useRouter()
  const { id: slug } = use(params)
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  // Scroll to top when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
  }, [])

  // Fetch property data from API
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // First try to find by slug in database
        const response = await fetch(`/api/properties`)
        if (response.ok) {
          const allProperties = await response.json()
          const foundProperty = findPropertyBySlug(allProperties, slug)
          if (foundProperty) {
            setProperty(foundProperty)
            setLoading(false)
            return
          }
        }

        // If not found in database, try individual property API (for backward compatibility)
        const individualResponse = await fetch(`/api/properties/${slug}`)
        if (individualResponse.ok) {
          const propertyData = await individualResponse.json()
          setProperty(propertyData)
          setLoading(false)
          return
        }

        // Property not found
        router.push("/404")
      } catch (error) {
        console.error('Error fetching property:', error)
        router.push("/404")
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [slug, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#aa9578]"></div>
      </div>
    )
  }

  if (!property) {
    router.push("/404")
    return null
  }

  // Format price with commas
  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    })
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="w-full py-6 px-6 bg-white">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo on Left */}
          <div>
            <Link href="/">
              <ResponsiveLogo variant="color" />
            </Link>
          </div>

          {/* Right Side Elements */}
          <div className="flex items-center space-x-6">
            {/* Phone Number */}
            <div className="hidden md:flex items-center text-[#aa9578] font-manrope tracking-tight">
              <Phone className="h-4 w-4 mr-2" />
              <span>416-553-7707</span>
            </div>

            {/* Menu Container */}
            <TopNavMenu />

            {/* Social Media Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="https://www.facebook.com/realtorpooya" className="text-[#aa9578] hover:text-[#473729] transition-colors">
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
                  className="lucide lucide-facebook"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>
              <Link href="https://www.instagram.com/realtorpooya/" className="text-[#aa9578] hover:text-[#473729] transition-colors">
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
                  className="lucide lucide-instagram"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>
              <Link href="https://www.linkedin.com/in/pooya-pirayesh-758998366/" className="text-[#aa9578] hover:text-[#473729] transition-colors">
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
                  className="lucide lucide-linkedin"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

                  {/* Property Gallery with Back Button */}
      <div className="relative">
        <PropertyImageGallery
          images={property.mediaUrls && property.mediaUrls.length > 0 ? 
            property.mediaUrls : 
            property.heroImage ? [property.heroImage] : []
          }
          videoUrl={property.youtubeVideo || undefined}
          heroImage={property.heroImage || undefined}
        />

        {/* Back button - Simplified to just an icon button */}
        <div className="absolute top-4 left-4 z-30">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-black/40 transition-colors"
            aria-label="Back to listings"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Property Details */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="font-tenor-sans text-4xl md:text-5xl text-gray-900 mb-2">{property.address}</h1>
                <div className="flex items-center text-[#aa9578]">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-lg">
                    {property.city}, {property.province} {property.postalCode}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-gray-200">
                  <Heart className="h-5 w-5 text-[#aa9578]" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-gray-200">
                  <Share2 className="h-5 w-5 text-[#aa9578]" />
                </Button>
              </div>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 p-6 bg-[#f3ecdf] rounded-2xl">
              <div className="flex flex-col items-center">
                <Bed className="h-8 w-8 text-[#aa9578] mb-2" />
                <span className="text-lg font-tenor-sans font-semibold">{property.bedrooms} Bedroom{property.bedrooms === '1' ? '' : 's'}</span>
              </div>
              <div className="flex flex-col items-center">
                <Bath className="h-8 w-8 text-[#aa9578] mb-2" />
                <span className="text-lg font-tenor-sans font-semibold">{property.bathrooms} Bathrooms</span>
              </div>
              <div className="flex flex-col items-center">
                <Square className="h-8 w-8 text-[#aa9578] mb-2" />
                <span className="text-lg font-tenor-sans font-semibold">{property.squareFeet?.toLocaleString() || 'N/A'} sq ft</span>
              </div>
              {/* Total Parking Space - only show if tps exists in more JSONB */}
              {property.more && typeof property.more === 'object' && (property.more as Record<string, any>).tps && (
                <div className="flex flex-col items-center">
                  <Car className="h-8 w-8 text-[#aa9578] mb-2" />
                                      <span className="text-lg font-tenor-sans font-semibold">{(property.more as Record<string, any>).tps} Parking Space{(property.more as Record<string, any>).tps === '1' ? '' : 's'}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="font-tenor-sans text-2xl text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            <div className="mb-12">
              <h2 className="font-tenor-sans text-2xl text-gray-900 mb-4">Features</h2>
              <PropertyFeatures features={extractFeatures(property)} />
            </div>

          

            {/* Video Tour */}
            {property.youtubeVideo && (
              <div className="mb-12">
                <h2 className="font-tenor-sans text-2xl text-gray-900 mb-4">Video Tour</h2>
                <VideoPlayer 
                  videoUrl={property.youtubeVideo}
                  posterImage={property.heroImage || undefined}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-tenor-sans text-3xl text-gray-900">
                      {property.status === "sold" ? "SOLD" : 
                       property.status === "not_available" ? "NOT AVAILABLE" :
                       (property.price ? formatPrice(property.price) : "Price upon request")}
                    </h3>
                    <Badge className={`px-3 py-1 rounded-full ${
                      property.status === "sold" 
                        ? "bg-red-600 text-white" 
                        : property.status === "active" 
                        ? "bg-[#473729] text-white" 
                        : property.status === "not_available"
                        ? "bg-gray-600 text-white"
                        : property.status === "coming_soon"
                        ? "bg-blue-600 text-white"
                        : property.status === "conditional"
                        ? "bg-yellow-600 text-white"
                        : property.status === "leased"
                        ? "bg-green-600 text-white"
                        : "bg-gray-500 text-white"
                    }`}>
                      {property.status === "sold" ? "SOLD" : 
                       property.status === "active" ? "For Sale" : 
                       property.status === "not_available" ? "Not Available" :
                       property.status === "coming_soon" ? "Coming Soon" :
                       property.status === "conditional" ? "Conditional" :
                       property.status === "leased" ? "Leased" :
                       property.status}
                    </Badge>
                  </div>

                  {property.propertyTax && property.status !== "sold" && (
                    <div className="flex justify-between text-gray-600 mb-2">
                      <span>Property Tax:</span>
                      <span>${property.propertyTax.toLocaleString()}/year</span>
                    </div>
                  )}

                  {property.hoaFees && property.status !== "sold" && (
                    <div className="flex justify-between text-gray-600">
                      <span>HOA Fees:</span>
                      <span>${property.hoaFees.toLocaleString()}/month</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {property.status === "sold" ? (
                    <Button
                      disabled
                      className="w-full bg-gray-400 text-gray-600 cursor-not-allowed rounded-full py-6 font-manrope text-lg mb-4"
                    >
                      Property Sold
                    </Button>
                  ) : (
                    <BookShowingButton fullWidth size="xl" className="mb-4" />
                  )}

                  <Link href="/contact">
                    <Button
                      variant="outline"
                      className="w-full border-[#aa9578] text-[#aa9578] hover:bg-[#f3ecdf] rounded-full py-6 font-manrope text-lg flex items-center justify-center"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Contact Agent
                    </Button>
                  </Link>
                </div>

                <div className="p-6 bg-[#f3ecdf]">
                  <h4 className="font-tenor-sans text-xl text-[#473729] mb-4">Agent Information</h4>
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 overflow-hidden relative">
                      <Image src="/images/agent-pooya.jpg" alt="Pooya Pirayesh" fill className="object-cover" />
                    </div>
                    <div>
                      <h5 className="font-manrope font-semibold text-[#473729]">Pooya Pirayesh</h5>
                      <p className="text-[#aa9578]">Luxury Real Estate Specialist</p>
                      <p className="text-[#aa9578]">416-553-7707</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
