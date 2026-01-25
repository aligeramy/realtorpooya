"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Search, MapPin, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SearchSuggestion {
  id: string
  address: string
  city: string
  price?: number
  bedrooms?: number
  bathrooms?: number
  propertyType?: string
  source: 'custom' | 'mls'
}

interface PropertySearchProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (suggestion: SearchSuggestion) => void
  placeholder?: string
  className?: string
  debounceMs?: number
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function PropertySearch({
  value,
  onChange,
  onSelect,
  placeholder = "Search by address, unit number, city, postal code, or MLS number...",
  className,
  debounceMs = 300,
}: PropertySearchProps) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebounce(value, debounceMs)

  // Fetch search suggestions
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('q', query) // Use 'q' for MLS full-text search
      params.append('search', query) // Also include 'search' for custom properties
      params.append('limit', '8') // Limit suggestions to 8

      const response = await fetch(`/api/properties?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        
        // Transform to suggestions format
        const transformed: SearchSuggestion[] = data.map((prop: any) => {
          // Build address string with unit number if available
          let address = prop.address || prop.formattedAddress || ''
          if (prop.unitNumber && !address.includes(prop.unitNumber)) {
            // Add unit number to address if not already included
            address = `${address}${address ? ' ' : ''}Unit ${prop.unitNumber}`
          }
          
          return {
            id: prop.id,
            address,
            city: prop.city || '',
            price: prop.price || prop.listPrice,
            bedrooms: prop.bedrooms || prop.bedroomsTotal,
            bathrooms: prop.bathrooms || prop.bathroomsTotalInteger,
            propertyType: prop.propertyType || prop.propertySubType || '',
            source: prop.source || 'custom',
          }
        })

        setSuggestions(transformed)
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length >= 2) {
      setShowSuggestions(true)
      fetchSuggestions(debouncedQuery)
    } else {
      setSuggestions([])
      if (!debouncedQuery || debouncedQuery.length === 0) {
        setShowSuggestions(false)
      }
    }
  }, [debouncedQuery, fetchSuggestions])

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setShowSuggestions(true)
    setHighlightedIndex(-1)
  }, [onChange])

  // Handle suggestion select
  const handleSelectSuggestion = useCallback((suggestion: SearchSuggestion) => {
    onChange(suggestion.address)
    setShowSuggestions(false)
    if (onSelect) {
      onSelect(suggestion)
    }
    inputRef.current?.blur()
  }, [onChange, onSelect])

  // Handle focus - memoized to prevent unnecessary re-renders
  const handleFocus = useCallback(() => {
    if (value.length >= 2) {
      setShowSuggestions(true)
      // Fetch suggestions if we have a query but no suggestions yet
      if (suggestions.length === 0 && debouncedQuery.length >= 2) {
        fetchSuggestions(debouncedQuery)
      }
    }
  }, [value.length, suggestions.length, debouncedQuery, fetchSuggestions])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter' && value.trim()) {
        e.preventDefault() // Prevent form submission
        setShowSuggestions(false)
        inputRef.current?.blur()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault() // Prevent form submission
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[highlightedIndex])
        } else if (value.trim()) {
          setShowSuggestions(false)
          inputRef.current?.blur()
        }
        break
      case 'Escape':
        e.preventDefault()
        setShowSuggestions(false)
        inputRef.current?.blur()
        break
    }
  }, [showSuggestions, suggestions, highlightedIndex, value, handleSelectSuggestion])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Format price helper
  const formatPrice = useCallback((price?: number) => {
    if (!price) return null
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }, [])

  // Memoized suggestion items
  const suggestionItems = useMemo(() => {
    return suggestions.map((suggestion, index) => (
      <button
        key={suggestion.id}
        type="button"
        onClick={() => handleSelectSuggestion(suggestion)}
        className={cn(
          "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors",
          "border-b border-gray-100 last:border-b-0",
          highlightedIndex === index && "bg-gray-50"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="font-medium text-gray-900 truncate">
                {suggestion.address}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>{suggestion.city}</span>
              {suggestion.bedrooms && (
                <span>{suggestion.bedrooms} bed{suggestion.bedrooms !== 1 ? 's' : ''}</span>
              )}
              {suggestion.bathrooms && (
                <span>{suggestion.bathrooms} bath{suggestion.bathrooms !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {suggestion.price && (
              <span className="font-semibold text-[#aa9578] text-sm">
                {formatPrice(suggestion.price)}
              </span>
            )}
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                suggestion.source === 'mls' && "border-blue-200 text-blue-700"
              )}
            >
              {suggestion.source === 'mls' ? 'MLS' : 'Featured'}
            </Badge>
          </div>
        </div>
      </button>
    ))
  }, [suggestions, highlightedIndex, handleSelectSuggestion, formatPrice])

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="pl-10 pr-10 h-12 rounded-full border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578]"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('')
              setShowSuggestions(false)
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && value.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {isLoading && suggestions.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-sm">Searching...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestionItems}
            </div>
          ) : debouncedQuery.length >= 2 && !isLoading ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <p className="text-sm">No properties found</p>
              <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
