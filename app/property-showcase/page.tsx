"use client"

import { useState, useEffect, Suspense, useCallback, useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, MapPin, Bed, Bath, Square, Car, SlidersHorizontal, X } from "lucide-react"
import TopNavMenu from "@/components/top-nav-menu"
import SiteFooter from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ResponsiveLogo from "@/components/responsive-logo"
import { createAddressSlug } from "@/lib/utils"
import { PropertySearch } from "@/components/property-search"
import type { Property } from "@/types/property"

function PropertyShowcaseContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || "")
  const [selectedCity, setSelectedCity] = useState(() => searchParams.get('city') || "all")
  const [selectedType, setSelectedType] = useState(() => searchParams.get('propertyType') || "all")
  const [selectedStatus, setSelectedStatus] = useState(() => searchParams.get('status') || "all")
  const [priceRange, setPriceRange] = useState("all")

  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Fetch properties from API
  const fetchProperties = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      // Add search query if present
      if (searchQuery.trim()) {
        params.append('q', searchQuery.trim())
      }

      // Add filters
      if (selectedCity && selectedCity !== 'all') params.append('city', selectedCity)
      if (selectedType && selectedType !== 'all') params.append('propertyType', selectedType)

      // Add price range
      if (priceRange && priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number)
        if (min) params.append('minPrice', min.toString())
        if (max) params.append('maxPrice', max.toString())
      }

      const response = await fetch(`/api/properties?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
      } else {
        console.error('Failed to fetch properties:', response.statusText)
        setProperties([])
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedCity, selectedType, priceRange])

  // Fetch properties when filters change
  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  // Update URL when filters change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams()

      if (searchQuery.trim()) params.set('search', searchQuery.trim())
      if (selectedCity && selectedCity !== 'all') params.set('city', selectedCity)
      if (selectedType && selectedType !== 'all') params.set('propertyType', selectedType)
      if (selectedStatus && selectedStatus !== 'all') params.set('status', selectedStatus)

      const queryString = params.toString()
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname

      // Only update if URL actually changed
      if (newUrl !== window.location.pathname + window.location.search) {
        router.replace(newUrl, { scroll: false })
      }
    }, 800) // Debounce URL updates

    return () => clearTimeout(timer)
  }, [searchQuery, selectedCity, selectedType, selectedStatus, pathname, router])

  // Filter properties by status (client-side)
  const filteredProperties = useMemo(() => {
    if (selectedStatus === "all") return properties
    return properties.filter(property => property.status === selectedStatus)
  }, [properties, selectedStatus])

  // Get unique filter options
  const uniqueCities = useMemo(() =>
    Array.from(new Set(properties.map(p => p.city).filter(Boolean))).sort(),
    [properties]
  )

  const uniqueTypes = useMemo(() =>
    Array.from(new Set(properties.map(p => p.propertyType).filter(Boolean))).sort(),
    [properties]
  )

  const uniqueStatuses = useMemo(() =>
    Array.from(new Set(properties.map(p => p.status).filter(Boolean))).sort(),
    [properties]
  )

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchQuery("")
    setSelectedCity("all")
    setSelectedType("all")
    setSelectedStatus("all")
    setPriceRange("all")
  }, [])

  // Format price
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }, [])

  // Status badge helpers
  const getStatusColor = useCallback((status: string) => {
    const colors: Record<string, string> = {
      sold: 'bg-red-100 text-red-800 border-red-200',
      conditional: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      leased: 'bg-green-100 text-green-800 border-green-200',
      not_available: 'bg-gray-100 text-gray-800 border-gray-200',
      coming_soon: 'bg-blue-100 text-blue-800 border-blue-200',
      active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    }
    return colors[status] || 'bg-emerald-100 text-emerald-800 border-emerald-200'
  }, [])

  const getStatusText = useCallback((status: string) => {
    const texts: Record<string, string> = {
      sold: 'SOLD',
      conditional: 'CONDITIONAL',
      leased: 'LEASED',
      not_available: 'NOT AVAILABLE',
      coming_soon: 'COMING SOON',
      active: 'FOR SALE',
    }
    return texts[status] || status?.toUpperCase() || 'ACTIVE'
  }, [])

  // Generate property slug
  const generateSlug = useCallback((property: Property) => {
    const addressSlug = createAddressSlug(property.address || '')
    return `${addressSlug}-${property.id.slice(-8)}`
  }, [])

  if (loading && properties.length === 0) {
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
      <div className="w-full py-6 px-6 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/">
            <ResponsiveLogo variant="color" />
          </Link>
          <TopNavMenu />
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <Link
          href="/"
          className="inline-flex items-center text-[#aa9578] hover:text-[#473729] transition-colors font-manrope group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-tenor-sans text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4">
              Property Showcase
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Discover exceptional properties in Toronto's luxury market
            </p>
            <div className="text-2xl font-semibold text-[#aa9578]">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'}
              {searchQuery && (
                <span className="text-lg text-gray-600 font-normal block mt-2">
                  {filteredProperties.length > 0 ? 'matching' : 'found for'} &quot;{searchQuery}&quot;
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
              <div className="flex-1">
                <PropertySearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search by address, unit number, city, postal code, or MLS..."
                  className="w-full"
                  debounceMs={0}
                  onSelect={(suggestion) => {
                    // Navigate directly to the property page
                    const addressSlug = createAddressSlug(suggestion.address)
                    const slug = `${addressSlug}-${suggestion.id.slice(-8)}`
                    router.push(`/listings/${slug}`)
                  }}
                />
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-6 rounded-full border-gray-300 hover:bg-gray-50 font-medium lg:w-auto w-full"
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
                {(selectedCity !== 'all' || selectedType !== 'all' || selectedStatus !== 'all' || priceRange !== 'all') && (
                  <Badge className="ml-2 bg-[#aa9578] text-white">
                    {[selectedCity !== 'all', selectedType !== 'all', selectedStatus !== 'all', priceRange !== 'all'].filter(Boolean).length}
                  </Badge>
                )}
              </Button>

              {searchQuery && (
                <Button
                  variant="ghost"
                  onClick={clearAllFilters}
                  className="h-12 px-6 rounded-full font-medium lg:w-auto w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-6 overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="h-12 rounded-lg border-gray-300 bg-white">
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
                      <SelectTrigger className="h-12 rounded-lg border-gray-300 bg-white">
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
                      <SelectTrigger className="h-12 rounded-lg border-gray-300 bg-white">
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
                      <SelectTrigger className="h-12 rounded-lg border-gray-300 bg-white">
                        <SelectValue placeholder="Price Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="0-500000">Under $500K</SelectItem>
                        <SelectItem value="500000-1000000">$500K - $1M</SelectItem>
                        <SelectItem value="1000000-2000000">$1M - $2M</SelectItem>
                        <SelectItem value="2000000-5000000">$2M - $5M</SelectItem>
                        <SelectItem value="5000000-999999999">$5M+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {loading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 text-[#aa9578]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#aa9578]"></div>
                  <span className="text-lg font-manrope">Loading properties...</span>
                </div>
              </div>
            )}

            {!loading && filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link href={`/listings/${generateSlug(property)}`}>
                      <Card className="overflow-hidden hover:shadow-2xl shadow-md rounded-2xl border border-gray-200 hover:border-[#aa9578]/40 transition-all duration-300 group bg-white h-full cursor-pointer">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={property.heroImage || property.mediaUrls?.[0] || "/placeholder.svg"}
                            alt={property.address || 'Property'}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />

                          {/* Gradient overlays */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#aa9578]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Top badges */}
                          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                            <Badge className={`${getStatusColor(property.status)} px-3 py-1.5 text-xs font-bold rounded-lg shadow-lg backdrop-blur-sm`}>
                              {getStatusText(property.status)}
                            </Badge>
                            {property.youtubeVideo && (
                              <Badge className="bg-black/80 text-white px-3 py-1.5 text-xs rounded-lg shadow-lg backdrop-blur-sm font-semibold">
                                🎥 Video Tour
                              </Badge>
                            )}
                          </div>

                          {/* Bottom content */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                            <div className="text-2xl font-bold mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                              {property.status === 'not_available' ? 'Not Available' :
                               property.price ? formatPrice(property.price) : 'Price upon request'}
                            </div>
                            <h3 className="font-tenor-sans text-xl font-semibold mb-2 line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                              {property.address}
                            </h3>
                            <div className="flex items-center text-white/90 text-sm mb-3 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
                              <MapPin className="h-4 w-4 mr-1.5" />
                              <span>{property.city}{property.province ? `, ${property.province}` : ''}</span>
                            </div>

                            {/* Property details */}
                            <div className="flex items-center gap-2 flex-wrap">
                              {property.bedrooms && (
                                <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md text-white px-3 py-1.5 rounded-lg shadow-lg">
                                  <Bed className="h-3.5 w-3.5" />
                                  <span className="text-sm font-semibold">{property.bedrooms}</span>
                                </div>
                              )}
                              {property.bathrooms && (
                                <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md text-white px-3 py-1.5 rounded-lg shadow-lg">
                                  <Bath className="h-3.5 w-3.5" />
                                  <span className="text-sm font-semibold">{property.bathrooms}</span>
                                </div>
                              )}
                              {property.squareFeet && (
                                <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md text-white px-3 py-1.5 rounded-lg shadow-lg">
                                  <Square className="h-3.5 w-3.5" />
                                  <span className="text-sm font-semibold">{property.squareFeet.toLocaleString()} sq ft</span>
                                </div>
                              )}
                              {property.more && typeof property.more === 'object' && (property.more as Record<string, any>).tps && (
                                <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md text-white px-3 py-1.5 rounded-lg shadow-lg">
                                  <Car className="h-3.5 w-3.5" />
                                  <span className="text-sm font-semibold">{(property.more as Record<string, any>).tps}</span>
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
            ) : !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-tenor-sans text-gray-900 mb-3">
                    No properties found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search query to find what you're looking for
                  </p>
                  <Button
                    onClick={clearAllFilters}
                    className="bg-[#aa9578] hover:bg-[#8a7a63] text-white rounded-full font-medium px-8 py-6 text-base"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </motion.div>
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
