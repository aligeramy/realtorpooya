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

export function PropertySearch({
  value,
  onChange,
  onSelect,
  placeholder = "Search by address, unit number, city, postal code, or MLS number...",
  className,
  debounceMs = 500,
}: PropertySearchProps) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [localValue, setLocalValue] = useState(value)

  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Sync local value with prop value (for controlled component behavior)
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Fetch search suggestions
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([])
      setIsLoading(false)
      return
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('q', query)
      params.append('limit', '8')

      const response = await fetch(`/api/properties?${params.toString()}`, {
        signal: abortControllerRef.current.signal
      })

      if (response.ok) {
        const data = await response.json()

        // Transform to suggestions format
        const transformed: SearchSuggestion[] = data.map((prop: any) => {
          // Build address string with unit number if available
          let address = prop.address || prop.formattedAddress || ''
          if (prop.unitNumber && !address.includes(prop.unitNumber)) {
            address = `Unit ${prop.unitNumber} - ${address}`
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
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching suggestions:', error)
        setSuggestions([])
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounce suggestion fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue && localValue.length >= 2 && showSuggestions) {
        fetchSuggestions(localValue)
      } else {
        setSuggestions([])
        setIsLoading(false)
      }
    }, debounceMs)

    return () => {
      clearTimeout(timer)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [localValue, showSuggestions, debounceMs, fetchSuggestions])

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    onChange(newValue) // Immediately notify parent
    setShowSuggestions(true)
    setHighlightedIndex(-1)

    if (newValue.length >= 2) {
      setIsLoading(true)
    }
  }, [onChange])

  // Handle suggestion select
  const handleSelectSuggestion = useCallback((suggestion: SearchSuggestion) => {
    setLocalValue(suggestion.address)
    onChange(suggestion.address)
    setShowSuggestions(false)
    setSuggestions([])
    setHighlightedIndex(-1)

    if (onSelect) {
      onSelect(suggestion)
    }

    inputRef.current?.blur()
  }, [onChange, onSelect])

  // Handle focus
  const handleFocus = useCallback(() => {
    if (localValue.length >= 2) {
      setShowSuggestions(true)
      if (suggestions.length === 0) {
        setIsLoading(true)
        fetchSuggestions(localValue)
      }
    }
  }, [localValue, suggestions.length, fetchSuggestions])

  // Handle blur - delay to allow click on suggestions
  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setShowSuggestions(false)
    }, 200)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault()
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
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[highlightedIndex])
        } else {
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
  }, [showSuggestions, suggestions, highlightedIndex, handleSelectSuggestion])

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

  // Clear input
  const handleClear = useCallback(() => {
    setLocalValue('')
    onChange('')
    setSuggestions([])
    setShowSuggestions(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }, [onChange])

  // Format price
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
        onMouseEnter={() => setHighlightedIndex(index)}
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
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="pl-12 pr-12 h-12 rounded-full border-gray-300 focus:border-[#aa9578] focus:ring-[#aa9578] text-base"
          autoComplete="off"
        />
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {isLoading && !localValue && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && localValue.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
          {isLoading && suggestions.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-sm">Searching properties...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestionItems}
            </div>
          ) : !isLoading ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <p className="text-sm font-medium">No properties found</p>
              <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
