"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Phone, Search, MapPin, Bed, Bath } from "lucide-react"
import TopNavMenu from "./top-nav-menu"
import ResponsiveLogo from "./responsive-logo"

// Property Search Component
function PropertySearchWithSuggestions() {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Fetch featured properties when component mounts or when search is focused
  const fetchFeaturedProperties = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/properties/featured')
      if (response.ok) {
        const properties = await response.json()
        setSuggestions(properties.slice(0, 6)) // Show max 6 suggestions
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter properties based on search query
  const filteredSuggestions = suggestions.filter(property => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase()
    return (
      property.address?.toLowerCase().includes(query) ||
      property.city?.toLowerCase().includes(query) ||
      property.propertyType?.toLowerCase().includes(query) ||
      property.description?.toLowerCase().includes(query)
    )
  })

  // Handle input focus
  const handleFocus = () => {
    if (suggestions.length === 0) {
      fetchFeaturedProperties()
    }
    setShowSuggestions(true)
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (!showSuggestions) {
      setShowSuggestions(true)
    }
  }

  // Handle search submit
  const handleSearch = () => {
    window.location.href = `/property-showcase?search=${encodeURIComponent(searchQuery)}`
    setShowSuggestions(false)
  }

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Generate property slug for URL
  const generateSlug = (property: any) => {
    return `${property.address?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${property.id?.slice(-8)}`
  }

  return (
    <div ref={searchRef} className="relative">
      {/* Search Input */}
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search For Properties"
          className="w-full h-14 md:h-16 pl-6 pr-32 rounded-full text-base font-manrope backdrop-blur-md bg-white/20 border-white/30 text-white placeholder:text-white/70"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleFocus}
        />

        <button 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-700 hover:bg-white rounded-full px-6 py-2 font-manrope tracking-tight flex items-center gap-2"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Loading properties...
            </div>
          ) : filteredSuggestions.length > 0 ? (
            <>
              {filteredSuggestions.map((property) => (
                <Link
                  key={property.id}
                  href={`/listings/${generateSlug(property)}`}
                  className="block hover:bg-gray-50 transition-colors"
                  onClick={() => setShowSuggestions(false)}
                >
                  <div className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-b-0">
                    {/* Property Image */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      {property.heroImage || (property.mediaUrls && property.mediaUrls[0]) ? (
                        <Image
                          src={property.heroImage || property.mediaUrls[0]}
                          alt={property.address || 'Property'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Property Details */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">
                        {property.address}
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {property.city}, {property.province}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {property.status === 'not_available' ? 'NOT AVAILABLE' : formatPrice(property.price)}
                          </span>
                          {property.status === 'sold' && (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                              SOLD
                            </span>
                          )}
                          {property.status === 'not_available' && (
                            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                              NOT AVAILABLE
                            </span>
                          )}
                        </div>
                        {property.bedrooms && (
                          <span className="flex items-center gap-1">
                            <Bed className="h-3 w-3" />
                            {property.bedrooms}
                          </span>
                        )}
                        {property.bathrooms && (
                          <span className="flex items-center gap-1">
                            <Bath className="h-3 w-3" />
                            {property.bathrooms}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              
              {/* View All Listings Link */}
              <Link
                href="/property-showcase"
                className="block bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => setShowSuggestions(false)}
              >
                <div className="p-4 text-center">
                  <span className="text-blue-600 font-semibold">
                    View All Listings →
                  </span>
                </div>
              </Link>
            </>
          ) : (
            <div className="p-4">
              <div className="text-center text-gray-500 mb-3">
                No properties found matching "{searchQuery}"
              </div>
              <Link
                href="/property-showcase"
                className="block bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg p-3 text-center"
                onClick={() => setShowSuggestions(false)}
              >
                <span className="text-blue-600 font-semibold">
                  View All Listings →
                </span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function HeroSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const videoElement = videoRef.current
    if (videoElement) {
      videoElement.addEventListener("loadeddata", () => {
        setIsVideoLoaded(true)
      })

      // Play the video when it's ready
      if (videoElement.readyState >= 3) {
        setIsVideoLoaded(true)
      }
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("loadeddata", () => {
          setIsVideoLoaded(true)
        })
      }
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Video with Image Fallback */}
      <div className="absolute inset-0 z-0 bg-black">
        {/* Image Fallback - always visible until video loads */}
        <Image
          src="/images/luxury-home.jpg"
          alt="Luxury Home in Toronto"
          fill
          priority
          className={`object-cover object-left-bottom transition-opacity duration-1000 ${
            isVideoLoaded ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
            isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <source
            src="/videos/hero.mp4"
            type="video/mp4"
          />
          {/* Fallback to image is handled by CSS */}
        </video>

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 z-10"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        <div className="w-full py-6 px-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Logo on Left */}
            <ResponsiveLogo variant="white" />

            {/* Right Side Elements */}
            <div className="flex items-center space-x-6">
              {/* Phone Number */}
              <div className="hidden md:flex items-center text-white font-manrope tracking-tight">
                <Phone className="h-4 w-4 mr-2" />
                <span>416-553-7707</span>
              </div>

              {/* Menu Container */}
              <TopNavMenu />

              {/* Social Media Icons */}
              <div className="hidden md:flex items-center space-x-4">
                <Link href="https://www.facebook.com/realtorpooya" className="text-white hover:text-white/80 transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="https://www.instagram.com/realtorpooya/" className="text-white hover:text-white/80 transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="https://www.linkedin.com/in/pooya-pirayesh-758998366/" className="text-white hover:text-white/80 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content - Centered with Flexible Spacing */}
        <div className="container mx-auto flex-1 flex flex-col">
          {/* Upper Content Area */}
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <p className="font-montserrat tracking-[0.3em] text-white/90 text-sm md:text-base mb-4 uppercase">
              Luxury Real Estate
            </p>
            <h1 className="font-tenor-sans text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tighter max-w-4xl mb-8">
              Find Your Dream Home
            </h1>
          </div>

          {/* Search Bar - Positioned Lower */}
          <div className="w-full max-w-4xl mx-auto mb-16 md:mb-24 lg:mb-32 px-4">
            {/* Property Search with Suggestions */}
            <PropertySearchWithSuggestions />
          </div>
        </div>
      </div>
    </div>
  )
}
