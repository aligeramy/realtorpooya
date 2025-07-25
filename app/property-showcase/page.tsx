"use client"

import { useState, useEffect } from "react"
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
import type { Property } from "@/types/property"

export default function PropertyShowcasePage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [bedrooms, setBedrooms] = useState("all")
  const [bathrooms, setBathrooms] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

      // Parse URL parameters on component mount
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search)
      
      // Set initial filter values from URL parameters (from hero section)
      const searchParam = urlParams.get('search')
      const propertyTypeParam = urlParams.get('propertyType')
      const bedroomsParam = urlParams.get('bedrooms')
      const bathroomsParam = urlParams.get('bathrooms')
      const priceRangeParam = urlParams.get('priceRange')
      
      if (searchParam) setSearchQuery(searchParam)
      if (propertyTypeParam) setSelectedType(propertyTypeParam)
      if (bedroomsParam && bedroomsParam !== 'any') setBedrooms(bedroomsParam)
      if (bathroomsParam && bathroomsParam !== 'any') setBathrooms(bathroomsParam)
      if (priceRangeParam && priceRangeParam !== 'any') setPriceRange(priceRangeParam)
      
      // Show filters if any filter parameters are present
      if (propertyTypeParam || bedroomsParam || bathroomsParam || priceRangeParam) {
        setShowFilters(true)
      }
    }, [])

  // Fetch all properties with filters
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Build query parameters
        const params = new URLSearchParams()
        if (searchQuery) params.set('search', searchQuery)
        if (selectedType && selectedType !== 'all') params.set('propertyType', selectedType)
        if (bedrooms && bedrooms !== 'all') params.set('bedrooms', bedrooms)
        if (bathrooms && bathrooms !== 'all') params.set('bathrooms', bathrooms)
        if (priceRange && priceRange !== 'all') params.set('priceRange', priceRange)
        if (selectedCity && selectedCity !== 'all') params.set('city', selectedCity)

        const queryString = params.toString()
        const url = `/api/properties${queryString ? `?${queryString}` : ''}`
        
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setProperties(data)
          setFilteredProperties(data)
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [searchQuery, selectedType, bedrooms, bathrooms, priceRange, selectedCity])

  // Client-side additional filtering for status (since we handle most filtering server-side now)
  useEffect(() => {
    let filtered = [...properties]

    // Status filter (still handled client-side)
    if (selectedStatus && selectedStatus !== "all") {
      filtered = filtered.filter(property => property.status === selectedStatus)
    }

    setFilteredProperties(filtered)
  }, [properties, selectedStatus])

  // Get unique cities for filter (from fetched properties)
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
        return 'ACTIVE'
      default:
        return status.toUpperCase()
    }
  }

  // Convert property type enum to display text
  const getPropertyTypeText = (type: string) => {
    switch (type) {
      case 'detached':
        return 'House'
      case 'condo':
        return 'Condo'
      case 'townhouse':
        return 'Townhouse'
      case 'lot':
        return 'Land/Lot'
      case 'multi-res':
        return 'Multi-Family'
      default:
        return type
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#aa9578] mx-auto">
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
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="font-tenor-sans text-4xl md:text-5xl lg:text-6xl font-light text-[#473729] mb-6">
                Property Showcase
              </h1>
              <p className="font-manrope text-lg text-gray-600 max-w-2xl mx-auto">
                Discover exceptional properties in Toronto and surrounding areas
              </p>
            </motion.div>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto mb-12">
              {/* Search Bar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 pl-12 rounded-full border-gray-200"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="h-12 px-6 rounded-full border-gray-200"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Filter Options */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4"
                >
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="h-12 rounded-full">
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
                    <SelectTrigger className="h-12 rounded-full">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="detached">House</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="lot">Land/Lot</SelectItem>
                      <SelectItem value="multi-res">Multi-Family</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger className="h-12 rounded-full">
                      <SelectValue placeholder="Bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Beds</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={bathrooms} onValueChange={setBathrooms}>
                    <SelectTrigger className="h-12 rounded-full">
                      <SelectValue placeholder="Bathrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Baths</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="h-12 rounded-full">
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
                    <SelectTrigger className="h-12 rounded-full">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="0-500000">Under $500K</SelectItem>
                      <SelectItem value="500000-1000000">$500K - $1M</SelectItem>
                      <SelectItem value="1000000-2000000">$1M - $2M</SelectItem>
                      <SelectItem value="2000000-5000000">$2M - $5M</SelectItem>
                      <SelectItem value="5000000+">$5M+</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </div>

            {/* Results Count */}
            <div className="mb-8">
              <p className="text-gray-600 font-manrope">
                Showing {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
              </p>
            </div>

            {/* Properties Grid */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-64">
                        {property.heroImage || (property.mediaUrls && property.mediaUrls[0]) ? (
                          <Image
                            src={property.heroImage || property.mediaUrls![0]}
                            alt={property.address}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <MapPin className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                          <Badge className={`${getStatusColor(property.status)} border`}>
                            {getStatusText(property.status)}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="mb-2">
                          <span className="text-2xl font-semibold text-[#473729] font-tenor-sans">
                            {property.status === 'not_available' ? 'NOT AVAILABLE' : formatPrice(property.price)}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2 font-tenor-sans">{property.address}</h3>
                        <p className="text-gray-600 mb-4 font-manrope">{property.city}, {property.province}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <span className="font-medium">{getPropertyTypeText(property.propertyType)}</span>
                          </span>
                          <div className="flex items-center gap-4">
                            {property.bedrooms && (
                              <span className="flex items-center gap-1">
                                <Bed className="h-4 w-4" />
                                {property.bedrooms}
                              </span>
                            )}
                            {property.bathrooms && (
                              <span className="flex items-center gap-1">
                                <Bath className="h-4 w-4" />
                                {property.bathrooms}
                              </span>
                            )}
                            {property.squareFeet && (
                              <span className="flex items-center gap-1">
                                <Square className="h-4 w-4" />
                                {property.squareFeet?.toLocaleString()} sq ft
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <Link href={`/listings/${createAddressSlug(property.address || '')}-${property.id.slice(-8)}`}>
                          <Button className="w-full bg-[#aa9578] hover:bg-[#8a7a63] text-white rounded-full">
                            View Details
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
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
                    setBedrooms("all")
                    setBathrooms("all")
                  }}
                  className="bg-[#aa9578] hover:bg-[#8a7a63] text-white rounded-full"
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