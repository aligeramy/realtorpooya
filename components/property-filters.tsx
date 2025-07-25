"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

type PropertyFiltersProps = {
  selectedCity: string
  selectedType: string
  selectedStatus: string
  priceRange: string
  bedrooms: string
  bathrooms: string
  onCityChange: (value: string) => void
  onTypeChange: (value: string) => void
  onStatusChange: (value: string) => void
  onPriceRangeChange: (value: string) => void
  onBedroomsChange: (value: string) => void
  onBathroomsChange: (value: string) => void
  uniqueCities?: string[]
  uniqueStatuses?: string[]
  variant?: 'default' | 'hero'
  className?: string
}

export default function PropertyFilters({
  selectedCity,
  selectedType,
  selectedStatus,
  priceRange,
  bedrooms,
  bathrooms,
  onCityChange,
  onTypeChange,
  onStatusChange,
  onPriceRangeChange,
  onBedroomsChange,
  onBathroomsChange,
  uniqueCities = [],
  uniqueStatuses = [],
  variant = 'default',
  className = ''
}: PropertyFiltersProps) {
  
  const isHero = variant === 'hero'
  
  const labelClass = isHero 
    ? "!text-white/90 font-tenor-sans text-shadow-md font-medium mb-2 block text-md"
    : "text-gray-700 font-medium mb-2 block"
    
  const selectTriggerClass = isHero
    ? "w-full h-12 rounded-full border-white/30 bg-white/90 backdrop-blur-sm"
    : "h-12 rounded-full border-gray-200"

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

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 ${className}`}>
      {/* City Filter */}
      <div>
        <Label className={labelClass}>City</Label>
        <Select value={selectedCity} onValueChange={onCityChange}>
          <SelectTrigger className={selectTriggerClass}>
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {uniqueCities.map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Property Type */}
      <div>
        <Label className={labelClass}>Property Type</Label>
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className={selectTriggerClass}>
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
      </div>

      {/* Bedrooms */}
      <div>
        <Label className={labelClass}>Bedrooms</Label>
        <Select value={bedrooms} onValueChange={onBedroomsChange}>
          <SelectTrigger className={selectTriggerClass}>
            <SelectValue placeholder="Any Beds" />
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
      </div>

      {/* Bathrooms */}
      <div>
        <Label className={labelClass}>Bathrooms</Label>
        <Select value={bathrooms} onValueChange={onBathroomsChange}>
          <SelectTrigger className={selectTriggerClass}>
            <SelectValue placeholder="Any Baths" />
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
      </div>

      {/* Status Filter */}
      <div>
        <Label className={labelClass}>Status</Label>
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className={selectTriggerClass}>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {uniqueStatuses.map(status => (
              <SelectItem key={status} value={status}>{getStatusText(status)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <Label className={labelClass}>Price Range</Label>
        <Select value={priceRange} onValueChange={onPriceRangeChange}>
          <SelectTrigger className={selectTriggerClass}>
            <SelectValue placeholder="Any Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Price</SelectItem>
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