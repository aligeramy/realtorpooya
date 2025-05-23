"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Plus, DollarSign, Building, Bath, Bed, X, Facebook, Instagram, Linkedin, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"
import SearchFilters from "./search-filters"
import TopNavMenu from "./top-nav-menu"
import { useRouter } from "next/navigation"

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()
  const [activeFilters, setActiveFilters] = useState<{
    propertyType?: string
    priceRange?: [number, number]
    homeType?: string
    forSale?: boolean
    beds?: number
    baths?: number
    squareFeet?: [number, number]
    keywords?: string[]
  }>({})
  const isMobile = useIsMobile()

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

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const addFilter = (key: string, value: any) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const removeFilter = (key: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[key as keyof typeof newFilters]
      return newFilters
    })
  }

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).length
  }

  const handleSearch = () => {
    // Build search params from query and filters
    const params = new URLSearchParams()
    
    if (searchQuery) {
      params.set('q', searchQuery)
    }
    
    if (activeFilters.propertyType) {
      params.set('property_type', activeFilters.propertyType)
    }
    
    if (activeFilters.priceRange) {
      params.set('min_price', activeFilters.priceRange[0].toString())
      params.set('max_price', activeFilters.priceRange[1].toString())
    }
    
    if (activeFilters.beds) {
      params.set('min_bedrooms', activeFilters.beds.toString())
    }
    
    if (activeFilters.baths) {
      params.set('min_bathrooms', activeFilters.baths.toString())
    }
    
    // Navigate to search page with all filters
    router.push(`/search?${params.toString()}`)
  }

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
            <div>
              <Image
                src="/images/logo.png"
                alt="Pooya Pirayesh Luxury Real Estate"
                width={219}
                height={75}
                className="h-auto"
              />
            </div>

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
                <Link href="#" className="text-white hover:text-white/80 transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-white hover:text-white/80 transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-white hover:text-white/80 transition-colors">
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
            <div className="relative">
              {/* Active Filters */}
              {getActiveFilterCount() > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {activeFilters.propertyType && (
                    <Badge className="bg-white/90 text-gray-800 hover:bg-white/80 flex items-center gap-1 py-1.5 px-3">
                      <Building className="h-3 w-3" />
                      {activeFilters.propertyType}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeFilter("propertyType")} />
                    </Badge>
                  )}
                  {activeFilters.beds !== undefined && (
                    <Badge className="bg-white/90 text-gray-800 hover:bg-white/80 flex items-center gap-1 py-1.5 px-3">
                      <Bed className="h-3 w-3" />
                      {activeFilters.beds} Beds
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeFilter("beds")} />
                    </Badge>
                  )}
                  {activeFilters.baths !== undefined && (
                    <Badge className="bg-white/90 text-gray-800 hover:bg-white/80 flex items-center gap-1 py-1.5 px-3">
                      <Bath className="h-3 w-3" />
                      {activeFilters.baths} Baths
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeFilter("baths")} />
                    </Badge>
                  )}
                  {activeFilters.priceRange && (
                    <Badge className="bg-white/90 text-gray-800 hover:bg-white/80 flex items-center gap-1 py-1.5 px-3">
                      <DollarSign className="h-3 w-3" />${activeFilters.priceRange[0].toLocaleString()} - $
                      {activeFilters.priceRange[1].toLocaleString()}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeFilter("priceRange")} />
                    </Badge>
                  )}
                  {activeFilters.forSale !== undefined && (
                    <Badge className="bg-white/90 text-gray-800 hover:bg-white/80 flex items-center gap-1 py-1.5 px-3">
                      {activeFilters.forSale ? "For Sale" : "For Rent"}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeFilter("forSale")} />
                    </Badge>
                  )}
                </div>
              )}

              {/* Search Options Panel - Absolutely positioned and centered */}
              {showFilters && (
                <div className="absolute left-0 right-0 bottom-full mb-4 z-50">
                  <div className="w-full p-6 bg-white/90 backdrop-blur-md border-white/30 rounded-3xl shadow-xl">
                    <SearchFilters onApplyFilter={addFilter} activeFilters={activeFilters} />
                  </div>
                </div>
              )}

              {/* Search Input with Filter Button */}
              <div className="flex items-center">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="flex items-center justify-center w-8 h-8 bg-white/90 rounded-full hover:bg-white focus:outline-none transition-colors"
                          onClick={toggleFilters}
                        >
                          <Plus className="h-4 w-4 text-gray-700" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Search Options</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <Input
                  type="text"
                  placeholder="Search For Properties"
                  className="w-full h-14 md:h-16 pl-16 pr-32 rounded-full text-base font-manrope backdrop-blur-md bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                />

                <Button 
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-700 hover:bg-white rounded-full px-6 py-2 font-manrope tracking-tight flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
