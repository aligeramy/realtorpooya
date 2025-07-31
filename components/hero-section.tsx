"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Phone, Search, MapPin, Bed, Bath, SlidersHorizontal, Plus } from "lucide-react"
import TopNavMenu from "./top-nav-menu"
import ResponsiveLogo from "./responsive-logo"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

// Hero-specific Search Filters Component
function HeroSearchFilters({ onApplyFilter, activeFilters }: { onApplyFilter: (key: string, value: any) => void, activeFilters: any }) {
  const handleFilterChange = (key: string, value: string) => {
    // Convert "any" to undefined for the filter system
    onApplyFilter(key, value === "any" ? undefined : value)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Property Type */}
      <div>
        <Label className="!text-white font-tenor-sans text-shadow-md font-medium mb-2 block text-md">Property Type</Label>
        <Select
          onValueChange={(value) => handleFilterChange("propertyType", value)}
          defaultValue={activeFilters.propertyType || "any"}
        >
          <SelectTrigger className="w-full h-12 rounded-full border-white/30 bg-white/90 backdrop-blur-sm">
            <SelectValue placeholder="Any Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Type</SelectItem>
            <SelectItem value="detached">House</SelectItem>
            <SelectItem value="condo">Condo</SelectItem>
            <SelectItem value="townhouse">Townhouse</SelectItem>
            <SelectItem value="lot">Land/Lot</SelectItem>
            <SelectItem value="multi-res">Multi-Family</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bedrooms */}
      <div>
        <Label className="!text-white/90 font-tenor-sans text-shadow-md text-shadow-md font-medium mb-2 block text-md">Bedrooms</Label>
        <Select onValueChange={(value) => handleFilterChange("bedrooms", value)} defaultValue={activeFilters.bedrooms || "any"}>
          <SelectTrigger className="w-full h-12 rounded-full border-white/30 bg-white/90 backdrop-blur-sm">
            <SelectValue placeholder="Any Beds" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
            <SelectItem value="5">5+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bathrooms */}
      <div>
        <Label className="!text-white/90 font-tenor-sans text-shadow-md font-medium mb-2 block text-md">Bathrooms</Label>
        <Select onValueChange={(value) => handleFilterChange("bathrooms", value)} defaultValue={activeFilters.bathrooms || "any"}>
          <SelectTrigger className="w-full h-12 rounded-full border-white/30 bg-white/90 backdrop-blur-sm">
            <SelectValue placeholder="Any Baths" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
            <SelectItem value="5">5+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <Label className="!text-white/90 font-tenor-sans text-shadow-md font-medium mb-2 block text-md">Price Range</Label>
        <Select onValueChange={(value) => handleFilterChange("priceRange", value)} defaultValue={activeFilters.priceRange || "any"}>
          <SelectTrigger className="w-full h-12 rounded-full border-white/30 bg-white/90 backdrop-blur-sm">
            <SelectValue placeholder="Any Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Price</SelectItem>
            <SelectItem value="0-500000">Under $500K</SelectItem>
            <SelectItem value="500000-1000000">$500K - $1M</SelectItem>
            <SelectItem value="1000000-2000000">$1M - $2M</SelectItem>
            <SelectItem value="2000000-5000000">$2M - $5M</SelectItem>
            <SelectItem value="5000000+">$5M+</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// Debounce helper
function debounce(fn: (...args: any[]) => void, delay: number) {
  let timer: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// Property Search Component
function PropertySearchWithSuggestions() {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeFilters, setActiveFilters] = useState<any>({})
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
    
    // Handle description field which can be a JSON object or string
    const descriptionText = typeof property.description === 'string' 
      ? property.description 
      : typeof property.description === 'object' && property.description
        ? JSON.stringify(property.description)
        : ''
    
    return (
      property.address?.toLowerCase().includes(query) ||
      property.city?.toLowerCase().includes(query) ||
      property.propertyType?.toLowerCase().includes(query) ||
      descriptionText.toLowerCase().includes(query)
    )
  })

  // Handle input focus
  const handleFocus = () => {
    if (suggestions.length === 0) {
      fetchFeaturedProperties()
    }
    setShowSuggestions(true)
  }

  // Handle input blur - reset to featured properties when focus is lost
  const handleBlur = () => {
    // Small delay to allow for clicks on suggestions
    setTimeout(() => {
      if (!searchQuery.trim()) {
        fetchFeaturedProperties()
      }
    }, 200)
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchQuery(newValue)
    
    if (!showSuggestions) {
      setShowSuggestions(true)
    }
    
    // Always fetch featured properties for suggestions
    fetchFeaturedProperties()
  }

  // Handle filter application
  const handleApplyFilter = (key: string, value: any) => {
    setActiveFilters((prev: any) => ({
      ...prev,
      [key]: value
    }))
  }

  // Handle search submit
  const handleSearch = () => {
    // Build query string with search and filters
    const params = new URLSearchParams()
    
    if (searchQuery.trim()) {
      params.set('search', searchQuery)
    }
    
    // Add active filters to the query
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, JSON.stringify(value))
        } else if (!Array.isArray(value)) {
          params.set(key, value.toString())
        }
      }
    })

    const queryString = params.toString()
    window.location.href = `/property-showcase${queryString ? `?${queryString}` : ''}`
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
    // Use CRM slug generation for all properties
    return `${property.address?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${property.id?.slice(-8)}`
  }

  return (
    <div ref={searchRef} className="relative">
      {/* Search Input with Filter Button */}
      <div className="flex items-center gap-2">
        {/* Filter Toggle Button */}
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className={`h-14 md:h-16 w-14 md:w-16 rounded-full flex items-center justify-center backdrop-blur-md border-white/30 ${
            showFilters 
              ? 'bg-white/90 text-gray-700 hover:bg-white' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </Button>

        {/* Main Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search For Properties"
            className="w-full h-14 md:h-16 pl-6 pr-4 rounded-full text-base font-manrope backdrop-blur-md bg-white/20 border-white/30 text-white placeholder:text-white/70"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* Search Button */}
        <button 
          className="h-14 md:h-16 bg-white/90 text-gray-700 hover:bg-white rounded-full px-6 py-2 font-manrope tracking-tight flex items-center gap-2"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#fff]/70 backdrop-blur-md rounded-3xl shadow-2xl border border-[#fff]/30 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4">
              {/* Show 3 skeletons for loading state */}
              <div className="flex items-center gap-4 mb-3">
                <Skeleton className="w-16 h-16 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <Skeleton className="w-16 h-16 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          ) : filteredSuggestions.length > 0 ? (
            <>
              {filteredSuggestions.map((property) => (
                <Link
                  key={property.id}
                  href={`/listings/${generateSlug(property)}`}
                  className="block hover:bg-gray-50 transition-colors border-b border-gray-600/20 last:border-b-0"
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
                      <div className="font-semibold text-gray-900 truncat font-tenor-sans">
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
                className="block bg-[#000]/20 backdrop-blur-md hover:bg-[#eae7e1] transition-colors shadow-2xl border border-[#fff]/30 overflow-hidden z-50 max-h-96 overflow-y-auto"
                onClick={() => setShowSuggestions(false)}
              >
                <div className="p-4 text-center">
                  <span className="text-[#444] font-semibold font-tenor-sans">
                    Search MLS Results →
                  </span>
                </div>
              </Link>
            </>
          ) : (
            <Link
                href="/property-showcase"
                className="block bg-[#000]/20 backdrop-blur-md hover:bg-[#eae7e1] transition-colors shadow-2xl border border-[#fff]/30 overflow-hidden z-50 max-h-96 overflow-y-auto"
                onClick={() => setShowSuggestions(false)}
              >
                <div className="p-4 text-center">
                  <div className="text-[#444] font-semibold font-tenor-sans flex items-center justify-center">
                    No Results Found. 
                    <span className="text-[#444] text-xs font-semibold hover:bg-black/10 transition-colors font-tenor-sans border border-black/20 rounded-md py-1 px-2 ml-2">Search MLS Results →</span>
                  </div>
                </div>
              </Link>
          )}
        </div>
      )}

      {/* Filters Section */}
      {showFilters && (
        <div className="mt-4 p-6 rounded-3xl backdrop-blur-md bg-white/20 border border-white/30">
          <HeroSearchFilters 
            onApplyFilter={handleApplyFilter}
            activeFilters={activeFilters}
          />
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
