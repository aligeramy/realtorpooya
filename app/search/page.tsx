"use client"

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, SlidersHorizontal, MapPin, Home, DollarSign, Bed, Bath, Square, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import PropertyCard from '@/components/property-card';
import SearchBar from '@/components/search-bar';
import TopNavMenu from '@/components/top-nav-menu';
import SiteFooter from '@/components/site-footer';
import { Facebook, Instagram, Linkedin, Phone } from 'lucide-react';
import type { Property } from '@/types/property';
import type { SearchFilters, SearchSuggestion } from '@/types/listing';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  
  // Filter states - include page from URL params
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || undefined,
    city: searchParams.get('city') || undefined,
    property_type: searchParams.get('property_type') || undefined,
    min_price: undefined,
    max_price: undefined,
    min_bedrooms: undefined,
    max_bedrooms: undefined,
    min_bathrooms: undefined,
    max_bathrooms: undefined,
    sort_by: 'date_desc',
    page: parseInt(searchParams.get('page') || '1'),
    page_size: 12
  });

  // Filter options (these would normally come from an API)
  const [filterOptions, setFilterOptions] = useState({
    cities: [],
    propertyTypes: [],
    priceRange: { min_price: 0, max_price: 10000000 }
  });

  // Fetch search results
  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      // Add all filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        // Transform the API response to match Property type
        const transformedProperties = data.data.listings.map((listing: any) => ({
          id: listing.id,
          address: `${listing.street_number} ${listing.street_name} ${listing.street_suffix || ''}`.trim(),
          city: listing.city,
          province: listing.province,
          postal_code: listing.postal_code,
          property_type: listing.property_type?.toLowerCase() || 'house',
          price: parseFloat(listing.list_price || 0),
          bedrooms: listing.bedrooms_total || 0,
          bathrooms: listing.bathrooms_total || 0,
          square_feet: listing.living_area || 0,
          hero_image: listing.primary_image_url || '/placeholder.jpg',
          status: 'for_sale',
          listing_date: listing.list_date || new Date().toISOString(),
          description: listing.public_remarks || '',
          total_images: listing.total_images || 0
        }));

        setProperties(transformedProperties);
        setTotalResults(data.data.total);
        setSuggestions(data.data.suggestions || []);
      } else {
        setError(data.error || 'Failed to fetch properties');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to load search results');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('/api/search/filters');
        const data = await response.json();
        if (data.success) {
          setFilterOptions(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch filter options:', err);
      }
    };
    
    fetchFilterOptions();
  }, []);

  // Fetch results when filters change
  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Update filters when URL params change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      query: searchParams.get('q') || undefined,
      city: searchParams.get('city') || undefined,
      property_type: searchParams.get('property_type') || undefined,
      page: parseInt(searchParams.get('page') || '1')
    }));
  }, [searchParams]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1 // Reset to first page when filters change, except when changing page itself
    }));
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({
      ...prev,
      query,
      page: 1
    }));
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / (filters.page_size || 12));
  const currentPage = filters.page || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <Image
                src="/images/logo-color.png"
                alt="Pooya Pirayesh Luxury Real Estate"
                width={180}
                height={60}
                className="h-auto"
              />
            </Link>

            {/* Navigation */}
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center text-gray-700 font-manrope">
                <Phone className="h-4 w-4 mr-2" />
                <span>416-553-7707</span>
              </div>
              
              <TopNavMenu />
              
              {/* Social Media */}
              <div className="hidden md:flex items-center space-x-4">
                <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search by city, neighborhood, address, or property type..."
            />
          </div>
          
          {/* Quick Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <p className="text-sm text-gray-600 mr-2">Popular searches:</p>
              {suggestions.slice(0, 5).map((suggestion) => (
                <button
                  key={`${suggestion.type}-${suggestion.value}`}
                  onClick={() => handleSearch(suggestion.value)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                >
                  {suggestion.value}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Filters and Results */}
      <section className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="font-tenor-sans text-3xl md:text-4xl text-gray-900 mb-2">
              {filters.query || filters.city || 'All'} Properties
            </h1>
            <p className="text-gray-600">
              {totalResults} {totalResults === 1 ? 'property' : 'properties'} found
              {currentPage > 1 && ` • Page ${currentPage} of ${totalPages}`}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Sort Dropdown */}
            <Select value={filters.sort_by} onValueChange={(value) => handleFilterChange('sort_by', value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Newest First</SelectItem>
                <SelectItem value="date_asc">Oldest First</SelectItem>
                <SelectItem value="price_desc">Price High to Low</SelectItem>
                <SelectItem value="price_asc">Price Low to High</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <Select value={filters.property_type || ''} onValueChange={(value) => handleFilterChange('property_type', value || undefined)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="Detached">Detached</SelectItem>
                    <SelectItem value="Semi-Detached">Semi-Detached</SelectItem>
                    <SelectItem value="Condo">Condo</SelectItem>
                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <Select value={filters.city || ''} onValueChange={(value) => handleFilterChange('city', value || undefined)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Cities</SelectItem>
                    <SelectItem value="Toronto">Toronto</SelectItem>
                    <SelectItem value="North York">North York</SelectItem>
                    <SelectItem value="Mississauga">Mississauga</SelectItem>
                    <SelectItem value="Etobicoke">Etobicoke</SelectItem>
                    <SelectItem value="Scarborough">Scarborough</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <div className="flex space-x-2">
                  <Select value={filters.min_bedrooms?.toString() || ''} onValueChange={(value) => handleFilterChange('min_bedrooms', value ? parseInt(value) : undefined)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Min</SelectItem>
                      {[1, 2, 3, 4, 5].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}+</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filters.max_bedrooms?.toString() || ''} onValueChange={(value) => handleFilterChange('max_bedrooms', value ? parseInt(value) : undefined)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Max" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Max</SelectItem>
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <div className="flex space-x-2">
                  <Select value={filters.min_bathrooms?.toString() || ''} onValueChange={(value) => handleFilterChange('min_bathrooms', value ? parseInt(value) : undefined)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Min</SelectItem>
                      {[1, 2, 3, 4].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}+</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filters.max_bathrooms?.toString() || ''} onValueChange={(value) => handleFilterChange('max_bathrooms', value ? parseInt(value) : undefined)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Max" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Max</SelectItem>
                      {[1, 2, 3, 4, 5].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price Range */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ${filters.min_price?.toLocaleString() || '0'} - ${filters.max_price?.toLocaleString() || '10,000,000'}
                </label>
                <div className="px-4 py-2">
                  <Slider
                    min={0}
                    max={10000000}
                    step={100000}
                    value={[filters.min_price || 0, filters.max_price || 10000000]}
                    onValueChange={([min, max]) => {
                      handleFilterChange('min_price', min);
                      handleFilterChange('max_price', max);
                    }}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Area */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Living Area (sq ft)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.min_area || ''}
                    onChange={(e) => handleFilterChange('min_area', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#aa9578]"
                  />
                  <span className="self-center">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.max_area || ''}
                    onChange={(e) => handleFilterChange('max_area', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#aa9578]"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-6 flex justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setFilters({
                    query: filters.query,
                    sort_by: 'date_desc',
                    page: 1,
                    page_size: 12
                  });
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#aa9578]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-600">{error}</p>
            <Button onClick={fetchResults} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => {
                      handleFilterChange('page', currentPage - 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Previous
                  </Button>
                  
                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <Button
                          variant={currentPage === page ? 'default' : 'outline'}
                          onClick={() => {
                            handleFilterChange('page', page);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={currentPage === page ? 'bg-[#aa9578] hover:bg-[#9a8568]' : ''}
                        >
                          {page}
                        </Button>
                      </div>
                    ))}
                  
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      handleFilterChange('page', currentPage + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
} 