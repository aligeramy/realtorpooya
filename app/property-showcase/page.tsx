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
  const [showFilters, setShowFilters] = useState(false)

  // Fetch all properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties')
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
  }, [])

  // Filter properties based on search and filters
  useEffect(() => {
    let filtered = properties

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(property =>
        property.address?.toLowerCase().includes(query) ||
        property.city?.toLowerCase().includes(query) ||
        (typeof property.description === 'string' && property.description.toLowerCase().includes(query))
      )
    }

    // City filter
    if (selectedCity && selectedCity !== "all") {
      filtered = filtered.filter(property => property.city === selectedCity)
    }

    // Property type filter
    if (selectedType && selectedType !== "all") {
      filtered = filtered.filter(property => property.propertyType === selectedType)
    }

    // Status filter
    if (selectedStatus && selectedStatus !== "all") {
      filtered = filtered.filter(property => property.status === selectedStatus)
    }

    // Price range filter
    if (priceRange && priceRange !== "all") {
      const [min, max] = priceRange.split('-').map(Number)
      filtered = filtered.filter(property => {
        if (!property.price) return false
        if (max) {
          return property.price >= min && property.price <= max
        } else {
          return property.price >= min
        }
      })
    }

    setFilteredProperties(filtered)
  }, [properties, searchQuery, selectedCity, selectedType, selectedStatus, priceRange])

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
              className="text-center mb-12"
            >
              <h1 className="font-tenor-sans text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4">
                Property Showcase
              </h1>
              <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-8">
                Discover exceptional properties in Toronto's luxury market
              </p>
              <div className="text-2xl font-semibold text-[#aa9578]">
                {filteredProperties.length} Properties Available
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-[#f9f6f1]">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search properties by address, city, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-full border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578]"
                />
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-6 rounded-full border-gray-200 hover:bg-gray-50"
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
                     {uniqueTypes.map(type => (
                       <SelectItem key={type} value={type}>{type}</SelectItem>
                     ))}
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
                   className="h-12 rounded-full"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={property.heroImage || property.mediaUrls?.[0] || "/placeholder.svg"}
                          alt={property.address || 'Property'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className={`${getStatusColor(property.status)} px-3 py-1 text-xs font-semibold`}>
                            {getStatusText(property.status)}
                          </Badge>
                        </div>
                        {property.youtubeVideo && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-black/70 text-white px-3 py-1 text-xs">
                              Video Tour
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <div className="text-2xl font-bold text-[#aa9578] mb-2">
                            {property.status === 'not_available' ? 'NOT AVAILABLE' : 
                             property.price ? formatPrice(property.price) : 'Price upon request'}
                          </div>
                          <h3 className="font-tenor-sans text-xl text-gray-900 mb-2 line-clamp-2">
                            {property.address}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-4">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{property.city}, {property.province}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-gray-600 mb-6">
                          {property.bedrooms && (
                            <div className="flex items-center">
                              <Bed className="h-4 w-4 mr-1" />
                              <span className="text-sm">{property.bedrooms}</span>
                            </div>
                          )}
                          {property.bathrooms && (
                            <div className="flex items-center">
                              <Bath className="h-4 w-4 mr-1" />
                              <span className="text-sm">{property.bathrooms}</span>
                            </div>
                          )}
                          {property.squareFeet && (
                            <div className="flex items-center">
                              <Square className="h-4 w-4 mr-1" />
                              <span className="text-sm">{property.squareFeet?.toLocaleString()} sq ft</span>
                            </div>
                          )}
                          {property.more && typeof property.more === 'object' && (property.more as Record<string, any>).tps && (
                            <div className="flex items-center">
                              <Car className="h-4 w-4 mr-1" />
                              <span className="text-sm">{(property.more as Record<string, any>).tps}</span>
                            </div>
                          )}
                        </div>

                        <Link href={`/listings/${generateSlug(property)}`}>
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