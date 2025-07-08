"use client"

import { useEffect, useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MapPin, Bed, Bath, Square, Calendar, Share2, Heart, Phone, ChevronLeft, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import PropertyImageGallery from "@/components/property-image-gallery"
import PropertyFeatures from "@/components/property-features"
import TopNavMenu from "@/components/top-nav-menu"
import BookShowingButton from "@/components/book-showing-button"
import VideoPlayer from "@/components/video-player"
import type { Property } from "@/types/property"

// Mock data for a single property
const mockProperties: Record<string, Property> = {
  "1": {
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
    lot_dimensions: "50 x 120 ft",
    year_built: 2020,
    features: [
      "Floor-to-Ceiling Windows",
      "Open Concept Design",
      "Smart Home System",
      "Heated Floors",
      "Walk-in Closet",
      "Home Theater",
      "Wine Cellar",
      "Chef's Kitchen",
    ],
    hero_image: "/properties/1/hero.jpg",
    status: "sold",
    listing_date: new Date().toISOString(),
    description:
      "Modern architectural masterpiece with floor-to-ceiling windows and open concept living. This stunning contemporary home features sleek lines, abundant natural light, and premium finishes throughout. The perfect blend of luxury and functionality in Toronto's most prestigious neighborhood.",
    media_urls: [
      "/properties/1/1.jpg",
      "/properties/1/2.jpg",
      "/properties/1/3.jpg",
      "/properties/1/4.jpg",
      "/properties/1/5.jpg",
      "/properties/1/6.jpg",
      "/properties/1/7.jpg",
      "/properties/1/8.jpg",
      "/properties/1/9.jpg",
      "/properties/1/10.jpg",
      "/properties/1/11.jpg",
      "/properties/1/12.jpg",
      "/properties/1/13.jpg",
      "/properties/1/14.jpg",
      "/properties/1/15.jpg",
    ],
    youtube_video: "https://www.youtube.com/watch?v=PpAnSuBf7Fc",
    property_tax: 12000,
    hoa_fees: 500,
    more: {
      Parking: "2-Car Garage",
      Cooling: "Central Air",
      Heating: "Forced Air, Radiant",
      Basement: "Finished, Walkout",
      Roof: "Flat Roof",
      View: "City, Park",
      Fireplace: "2 Gas Fireplaces",
    },
  },
  "2": {
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
    description:
      "Contemporary waterfront villa with infinity pool and stunning night lighting. This architectural gem offers breathtaking views and seamless indoor-outdoor living. Perfect for the discerning buyer seeking luxury and privacy.",
    media_urls: [
      "/properties/2/1.jpg",
      "/properties/2/2.jpg",
      "/properties/2/3.jpg",
      "/properties/2/4.jpg",
      "/properties/2/5.jpg",
      "/properties/2/6.jpg",
      "/properties/2/7.jpg",
      "/properties/2/8.jpg",
      "/properties/2/9.jpg",
      "/properties/2/10.jpg",
      "/properties/2/11.jpg",
      "/properties/2/12.jpg",
      "/properties/2/13.jpg",
      "/properties/2/14.jpg",
      "/properties/2/15.jpg",
      "/properties/2/16.jpg",
      "/properties/2/17.jpg",
      "/properties/2/18.jpg",
      "/properties/2/19.jpg",
      "/properties/2/20.jpg",
      "/properties/2/21.jpg",
      "/properties/2/22.jpg",
      "/properties/2/23.jpg",
      "/properties/2/24.jpg",
      "/properties/2/25.jpg",
      "/properties/2/26.jpg",
      "/properties/2/27.jpg",
      "/properties/2/28.jpg",
      "/properties/2/29.jpg",
      "/properties/2/30.jpg",
    ],
    youtube_video: "https://www.youtube.com/watch?v=O6CvUZSxeT0",
    features: [
      "Infinity Pool",
      "Waterfront",
      "Outdoor Lighting",
      "Rooftop Terrace",
      "Smart Home",
      "Floor-to-Ceiling Windows",
    ],
    year_built: 2021,
    property_tax: 10500,
    hoa_fees: 350,
    more: {
      Parking: "3-Car Garage",
      Cooling: "Central Air",
      Heating: "Forced Air",
      Basement: "Finished",
      Roof: "Slate",
      View: "Waterfront",
      Fireplace: "3 Gas Fireplaces",
    },
  },
  "3": {
    id: "3",
    address: "789 Elite Street",
    city: "Toronto",
    province: "ON",
    postal_code: "M5R 2S8",
    property_type: "house",
    price: 3508000,
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 2640,
    hero_image: "/images/property-3.jpg",
    status: "for_sale",
    listing_date: new Date().toISOString(),
    description:
      "Mediterranean-inspired luxury estate with pool and elegant columns. This timeless property combines classic architecture with modern amenities, offering a serene retreat in the heart of the city.",
    media_urls: ["/images/property-1.jpg", "/images/property-2.jpg", "/images/property-4.jpg"],
    features: ["Swimming Pool", "Columns", "Mediterranean Style", "Landscaped Garden", "Outdoor Living Space"],
  },
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function PropertyPage({ params }: PageProps) {
  const router = useRouter()
  const { id } = use(params)
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
        const response = await fetch(`/api/properties/${id}`)
        if (response.ok) {
          const propertyData = await response.json()
          setProperty(propertyData)
        } else {
          // If property not found in database, fallback to mock data
          const mockProperty = mockProperties[id]
          if (mockProperty) {
            setProperty(mockProperty)
          } else {
            router.push("/404")
            return
          }
        }
      } catch (error) {
        console.error('Error fetching property:', error)
        // Fallback to mock data
        const mockProperty = mockProperties[id]
        if (mockProperty) {
          setProperty(mockProperty)
        } else {
          router.push("/404")
          return
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id, router])

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
              <Image
                src="/images/logo-color.png"
                alt="Pooya Pirayesh Luxury Real Estate"
                width={250}
                height={50}
                className="h-10 w-auto"
              />
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
              <Link href="#" className="text-[#aa9578] hover:text-[#473729] transition-colors">
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
              <Link href="#" className="text-[#aa9578] hover:text-[#473729] transition-colors">
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
              <Link href="#" className="text-[#aa9578] hover:text-[#473729] transition-colors">
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
          images={property.images?.length ? 
            (() => {
              // Sort images with hero image first, then by order
              const sortedImages = property.images.sort((a, b) => {
                // Hero image always comes first
                if (a.is_hero && !b.is_hero) return -1
                if (!a.is_hero && b.is_hero) return 1
                // If both or neither are hero, sort by order
                return a.order - b.order
              })
              return sortedImages.map(img => img.url)
            })() : 
            [property.hero_image!, ...(property.media_urls || [])]
          }
          videoUrl={property.videos?.length ? property.videos[0].url : property.youtube_video}
          heroImage={property.hero_image}
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
                    {property.city}, {property.province} {property.postal_code}
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
                <Bed className="h-6 w-6 text-[#aa9578] mb-2" />
                <span className="text-lg font-semibold">{property.bedrooms} Bedrooms</span>
              </div>
              <div className="flex flex-col items-center">
                <Bath className="h-6 w-6 text-[#aa9578] mb-2" />
                <span className="text-lg font-semibold">{property.bathrooms} Bathrooms</span>
              </div>
              <div className="flex flex-col items-center">
                <Square className="h-6 w-6 text-[#aa9578] mb-2" />
                <span className="text-lg font-semibold">{property.square_feet?.toLocaleString()} sq ft</span>
              </div>
              <div className="flex flex-col items-center">
                <Calendar className="h-6 w-6 text-[#aa9578] mb-2" />
                <span className="text-lg font-semibold">{property.year_built}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="font-tenor-sans text-2xl text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            <div className="mb-12">
              <h2 className="font-tenor-sans text-2xl text-gray-900 mb-4">Features</h2>
              <PropertyFeatures features={property.features || []} />
            </div>

            {/* Additional Details */}
            {property.more && Object.keys(property.more).length > 0 && (
              <div className="mb-12">
                <h2 className="font-tenor-sans text-2xl text-gray-900 mb-4">Additional Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(property.more).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Tour */}
            {property.youtube_video && (
              <div className="mb-12">
                <h2 className="font-tenor-sans text-2xl text-gray-900 mb-4">Video Tour</h2>
                <VideoPlayer 
                  videoUrl={property.youtube_video}
                  posterImage={property.hero_image}
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
                      {property.status === "sold" ? "SOLD" : (property.price ? formatPrice(property.price) : "Price upon request")}
                    </h3>
                    <Badge className={`px-3 py-1 rounded-full ${
                      property.status === "sold" 
                        ? "bg-red-600 text-white" 
                        : property.status === "for_sale" 
                        ? "bg-[#473729] text-white" 
                        : "bg-blue-600 text-white"
                    }`}>
                      {property.status === "sold" ? "SOLD" : property.status === "for_sale" ? "For Sale" : "For Rent"}
                    </Badge>
                  </div>

                  {property.property_tax && (
                    <div className="flex justify-between text-gray-600 mb-2">
                      <span>Property Tax:</span>
                      <span>${property.property_tax.toLocaleString()}/year</span>
                    </div>
                  )}

                  {property.hoa_fees && (
                    <div className="flex justify-between text-gray-600">
                      <span>HOA Fees:</span>
                      <span>${property.hoa_fees.toLocaleString()}/month</span>
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
