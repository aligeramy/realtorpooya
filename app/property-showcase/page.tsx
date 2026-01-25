"use client"

import { useState, useEffect, Suspense, useTransition, useRef, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, MapPin, Bed, Bath, Square, Car, Search, Filter, SlidersHorizontal } from "lucide-react"
import TopNavMenu from "@/components/top-nav-menu"
import SiteFooter from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ResponsiveLogo from "@/components/responsive-logo"
import { createAddressSlug } from "@/lib/utils"
import { PropertySearch } from "@/components/property-search"
import type { Property } from "@/types/property"

function PropertyShowcaseContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const isUpdatingFromUrlRef = useRef(false)
  
  // Initialize state from URL params immediately
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || "")
  const [selectedCity, setSelectedCity] = useState(() => searchParams.get('city') || "all")
  const [selectedType, setSelectedType] = useState(() => searchParams.get('propertyType') || "all")
  const [selectedStatus, setSelectedStatus] = useState(() => searchParams.get('status') || "all")
  const [priceRange, setPriceRange] = useState("all")
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Update state when URL params change (only if not updating from user input)
  useEffect(() => {
    if (isUpdatingFromUrlRef.current) {
      isUpdatingFromUrlRef.current = false
      return
    }
    
    const urlSearch = searchParams.get('search') || ""
    const urlCity = searchParams.get('city') || "all"
    const urlType = searchParams.get('propertyType') || "all"
    const urlStatus = searchParams.get('status') || "all"
    
    // Only update state if values actually changed to prevent unnecessary re-renders
    if (urlSearch !== searchQuery) {
      setSearchQuery(urlSearch)
    }
    if (urlCity !== selectedCity) {
      setSelectedCity(urlCity)
    }
    if (urlType !== selectedType) {
      setSelectedType(urlType)
    }
    if (urlStatus !== selectedStatus) {
      setSelectedStatus(urlStatus)
    }
  }, [searchParams, searchQuery, selectedCity, selectedType, selectedStatus])

  // Debounced search query for API calls (only trigger after user stops typing)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery)
  
  // Debounced URL update query (separate from API debounce to prevent URL updates on every keystroke)
  const [debouncedUrlQuery, setDebouncedUrlQuery] = useState(searchQuery)

  // Update debounced search query with delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500) // 500ms delay before triggering search

    return () => clearTimeout(timer)
  }, [searchQuery])
  
  // Update debounced URL query with delay (longer delay to prevent URL updates while typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUrlQuery(searchQuery)
    }, 1000) // 1000ms (1 second) delay before updating URL - prevents updates while actively typing

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch properties with filters
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      try {
        // Build query parameters
        const params = new URLSearchParams()
        if (debouncedSearchQuery.trim()) params.append('search', debouncedSearchQuery.trim())
        if (selectedCity && selectedCity !== 'all') params.append('city', selectedCity)
        if (selectedType && selectedType !== 'all') params.append('propertyType', selectedType)
        if (priceRange && priceRange !== 'all') {
          const [min, max] = priceRange.split('-').map(Number)
          if (min) params.append('minPrice', min.toString())
          if (max) params.append('maxPrice', max.toString())
        }

        const response = await fetch(`/api/properties?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setProperties(data)
          setFilteredProperties(data)
        } else {
          console.error('Failed to fetch properties:', response.statusText)
          setProperties([])
          setFilteredProperties([])
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
        setProperties([])
        setFilteredProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [debouncedSearchQuery, selectedCity, selectedType, priceRange])

  // Update URL when filters change (for shareable URLs) - debounced to prevent updates while typing
  useEffect(() => {
    // Skip if we're currently updating from URL to prevent loops
    if (isUpdatingFromUrlRef.current) {
      return
    }

    // Use debounced URL query instead of immediate searchQuery to prevent URL updates while typing
    const params = new URLSearchParams()
    const trimmedQuery = debouncedUrlQuery.trim()
    if (trimmedQuery) params.set('search', trimmedQuery)
    if (selectedCity && selectedCity !== 'all') params.set('city', selectedCity)
    if (selectedType && selectedType !== 'all') params.set('propertyType', selectedType)
    if (selectedStatus && selectedStatus !== 'all') params.set('status', selectedStatus)
    
    const queryString = params.toString()
    
    // Build current URL params for comparison (normalize to match our format)
    const currentParams = new URLSearchParams()
    const currentSearch = (searchParams.get('search') || '').trim()
    const currentCity = searchParams.get('city') || 'all'
    const currentType = searchParams.get('propertyType') || 'all'
    const currentStatus = searchParams.get('status') || 'all'
    
    if (currentSearch) currentParams.set('search', currentSearch)
    if (currentCity !== 'all') currentParams.set('city', currentCity)
    if (currentType !== 'all') currentParams.set('propertyType', currentType)
    if (currentStatus !== 'all') currentParams.set('status', currentStatus)
    
    const currentQueryString = currentParams.toString()
    
    // Only update if search params actually changed to prevent unnecessary updates
    if (currentQueryString !== queryString) {
      // Mark that we're updating from code, not from URL change
      isUpdatingFromUrlRef.current = true
      
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname
      
      // Use startTransition for non-urgent URL updates (following Vercel best practices)
      // This marks the update as non-urgent and prevents blocking the UI
      startTransition(() => {
        router.replace(newUrl, { scroll: false })
      })
    }
  }, [debouncedUrlQuery, selectedCity, selectedType, selectedStatus, pathname, router, searchParams])

  // Filter properties based on status (client-side only, as API doesn't filter by status)
  useEffect(() => {
    let filtered = properties

    // Status filter (client-side only)
    if (selectedStatus && selectedStatus !== "all") {
      filtered = filtered.filter(property => property.status === selectedStatus)
    }

    setFilteredProperties(filtered)
  }, [properties, selectedStatus])

  // Get unique cities for filter
  const uniqueCities = Array.from(new Set(properties.map(p => p.city).filter(Boolean)))
  const uniqueTypes = Array.from(new Set(properties.map(p => p.propertyType).filter(Boolean)))
  const uniqueStatuses = Array.from(new Set(properties.map(p => p.status).filter(Boolean)))

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sold':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'conditional':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'leased':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'not_available':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'coming_soon':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sold':
        return 'SOLD'
      case 'conditional':
        return 'CONDITIONAL'
      case 'leased':
        return 'LEASED'
      case 'not_available':
        return 'NOT AVAILABLE'
      case 'coming_soon':
        return 'COMING SOON'
      case 'active':
        return 'FOR SALE'
      default:
        return status?.toUpperCase() || 'ACTIVE'
    }
  }

  const generateSlug = (property: Property) => {
    const addressSlug = createAddressSlug(property.address || '')
    return `${addressSlug}-${property.id.slice(-8)}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-pulse">
            <Image
              src="/Icon/Icon_Color_RealtorPooya.png"
              alt="Loading..."
              width={64}
              height={64}
              className="animate-fade-in-out"
            />
          </div>
          <div className="mt-4 text-[#aa9578] font-manrope text-lg animate-fade-in-out">
            Loading properties...
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="w-full py-6 px-6 bg-white">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <Link href="/">
              <ResponsiveLogo variant="color" />
            </Link>
          </div>
          <TopNavMenu />
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <Link
          href="/"
          className="inline-flex items-center text-[#aa9578] hover:text-[#473729] transition-colors font-manrope"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-0"
            >
              <h1 className="font-tenor-sans text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4">
                Property Showcase
              </h1>
              <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-8">
                Discover exceptional properties in Toronto's luxury market
              </p>
              <div className="text-2xl font-semibold text-[#aa9578]">
                {loading ? (
                  <span className="text-gray-400">Loading properties...</span>
                ) : (
                  <>
                    {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'} Available
                    {searchQuery && (
                      <span className="text-lg text-gray-600 font-normal block mt-2">
                        Results for &quot;{searchQuery}&quot;
                      </span>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Professional Search with Suggestions */}
              <PropertySearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by address, city, postal code, or MLS number..."
                className="flex-1"
                debounceMs={300}
                onSelect={(suggestion) => {
                  // Optionally navigate to property or update filters
                  setSearchQuery(suggestion.address)
                }}
              />

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-6 rounded-md border-gray-300 hover:bg-gray-50 font-medium"
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
              >
                                 <Select value={selectedCity} onValueChange={setSelectedCity}>
                   <SelectTrigger className="h-12 rounded-md border-gray-300">
                     <SelectValue placeholder="All Cities" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">All Cities</SelectItem>
                     {uniqueCities.map(city => (
                       <SelectItem key={city} value={city}>{city}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>

                 <Select value={selectedType} onValueChange={setSelectedType}>
                   <SelectTrigger className="h-12 rounded-md border-gray-300">
                     <SelectValue placeholder="All Types" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">All Types</SelectItem>
                     {uniqueTypes.map(type => (
                       <SelectItem key={type} value={type}>{type}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>

                 <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                   <SelectTrigger className="h-12 rounded-md border-gray-300">
                     <SelectValue placeholder="All Status" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">All Status</SelectItem>
                     {uniqueStatuses.map(status => (
                       <SelectItem key={status} value={status}>{getStatusText(status)}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>

                 <Select value={priceRange} onValueChange={setPriceRange}>
                   <SelectTrigger className="h-12 rounded-md border-gray-300">
                     <SelectValue placeholder="Price Range" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">All Prices</SelectItem>
                     <SelectItem value="0-500000">Under $500K</SelectItem>
                     <SelectItem value="500000-1000000">$500K - $1M</SelectItem>
                     <SelectItem value="1000000-2000000">$1M - $2M</SelectItem>
                     <SelectItem value="2000000-5000000">$2M - $5M</SelectItem>
                     <SelectItem value="5000000">$5M+</SelectItem>
                   </SelectContent>
                 </Select>

                                 <Button
                   onClick={() => {
                     setSearchQuery("")
                     setSelectedCity("all")
                     setSelectedType("all")
                     setSelectedStatus("all")
                     setPriceRange("all")
                   }}
                   variant="outline"
                   className="h-12 rounded-md border-gray-300 font-medium"
                 >
                   Clear All
                 </Button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link href={`/listings/${generateSlug(property)}`} className="block h-full">
                      <Card className="overflow-hidden hover:shadow-2xl shadow-lg rounded-lg border-2 border-gray-200 hover:border-[#aa9578]/40 transition-all duration-300 group bg-white relative h-full cursor-pointer">
                        {/* Gradient border effect */}
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#aa9578]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={property.heroImage || property.mediaUrls?.[0] || "/placeholder.svg"}
                            alt={property.address || 'Property'}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                          {/* Always visible gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          {/* Enhanced gradient on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#aa9578]/30 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Top badges */}
                          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                            <Badge className={`${getStatusColor(property.status)} px-3 py-1.5 text-xs font-semibold rounded-md border border-white/30 backdrop-blur-md shadow-xl`}>
                              {getStatusText(property.status)}
                            </Badge>
                            {property.youtubeVideo && (
                              <Badge className="bg-black/70 text-white px-3 py-1.5 text-xs rounded-md border border-white/30 backdrop-blur-md shadow-xl">
                                Video Tour
                              </Badge>
                            )}
                          </div>

                          {/* Text overlay on image */}
                          <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-20">
                            <div className="text-xl font-medium mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tabular-nums">
                              {property.status === 'not_available' ? 'Not Available' : 
                               property.price ? formatPrice(property.price) : 'Price upon request'}
                            </div>
                            <h3 className="font-tenor-sans text-2xl font-semibold mb-2 line-clamp-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                              {property.address}
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
                                  <Square className="h-3 w-3 text-white" />
                                  <span className="text-xs font-medium">{property.squareFeet?.toLocaleString()}</span>
                                  <span className="text-[10px] text-white/90">sq ft</span>
                                </div>
                              )}
                              {property.more && typeof property.more === 'object' && (property.more as Record<string, any>).tps && (
                                <div className="flex items-center gap-1 bg-black/20 backdrop-blur-md text-white px-2 py-1 rounded-md shadow-lg border border-white/30">
                                  <Car className="h-3 w-3 text-white" />
                                  <span className="text-xs font-medium">{(property.more as Record<string, any>).tps}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-500 text-lg mb-4">
                  No properties found matching your criteria
                </div>
                                 <Button
                   onClick={() => {
                     setSearchQuery("")
                     setSelectedCity("all")
                     setSelectedType("all")
                     setSelectedStatus("all")
                     setPriceRange("all")
                   }}
                   className="bg-[#aa9578] hover:bg-[#8a7a63] text-white rounded-md font-medium"
                 >
                   Clear Filters
                 </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

export default function PropertyShowcasePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-pulse">
            <Image
              src="/Icon/Icon_Color_RealtorPooya.png"
              alt="Loading..."
              width={64}
              height={64}
              className="animate-fade-in-out"
            />
          </div>
          <div className="mt-4 text-[#aa9578] font-manrope text-lg animate-fade-in-out">
            Loading properties...
          </div>
        </div>
      </div>
    }>
      <PropertyShowcaseContent />
    </Suspense>
  )
} 