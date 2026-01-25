/**
 * MLS Search Service Client
 * Connects to the MLS search API hosted on search.realtorpooya.com
 */

const MLS_SEARCH_BASE_URL = 'https://search.realtorpooya.com/api/v1'
const MLS_API_KEY = process.env.MLS_SEARCH_API_KEY || '627894f6c365c83c6a3082809c4b95b960cf97121e303007ee27cea1686a6643'

export interface MLSSearchParams {
  q?: string
  city?: string
  neighbourhood?: string
  postalCode?: string
  transactionType?: 'for_sale' | 'for_rent' | 'sold'
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  propertyType?: string
  minSquareFootage?: number
  maxSquareFootage?: number
  minLandSize?: number
  maxLandSize?: number
  minYearBuilt?: number
  maxYearBuilt?: number
  lat?: number
  lng?: number
  radius?: number
  page?: number
  limit?: number
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest'
}

export interface MLSProperty {
  id: string
  listingKey: string
  listPrice: number
  bedroomsTotal: number
  bathroomsTotalInteger: number
  livingArea?: number
  propertyType: string
  city: string
  postalCode: string
  latitude: number
  longitude: number
  formattedAddress: string
  standardStatus: string
  modificationTimestamp: string
  imageUrl?: string
  hasImages: boolean
}

export interface MLSSearchResponse {
  data: MLSProperty[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  meta: {
    queryTime: number
    filters: Record<string, any>
  }
}

/**
 * Search MLS properties
 */
export async function searchMLSProperties(
  params: MLSSearchParams
): Promise<MLSSearchResponse | null> {
  try {
    const searchParams = new URLSearchParams()
    
    // Add all non-undefined parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })

    const url = `${MLS_SEARCH_BASE_URL}/search?${searchParams.toString()}`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${MLS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      console.error(`MLS Search API error: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching MLS properties:', error)
    return null
  }
}

/**
 * Map MLS property to custom property format
 */
export function mapMLSToCustomProperty(mlsProperty: MLSProperty): any {
  return {
    id: mlsProperty.id,
    // Use listingKey as a unique identifier for MLS properties
    mlsListingKey: mlsProperty.listingKey,
    address: mlsProperty.formattedAddress.split(',')[0] || mlsProperty.formattedAddress,
    city: mlsProperty.city,
    province: 'ON', // Default to Ontario, could be extracted from formattedAddress
    postalCode: mlsProperty.postalCode,
    price: mlsProperty.listPrice,
    bedrooms: mlsProperty.bedroomsTotal,
    bathrooms: mlsProperty.bathroomsTotalInteger,
    squareFeet: mlsProperty.livingArea,
    propertyType: mapMLSPropertyType(mlsProperty.propertyType),
    status: mapMLSStatus(mlsProperty.standardStatus),
    heroImage: mlsProperty.imageUrl,
    mediaUrls: mlsProperty.hasImages && mlsProperty.imageUrl ? [mlsProperty.imageUrl] : [],
    latitude: mlsProperty.latitude,
    longitude: mlsProperty.longitude,
    // Mark as MLS property
    source: 'mls',
    createdAt: mlsProperty.modificationTimestamp,
    updatedAt: mlsProperty.modificationTimestamp,
  }
}

/**
 * Map MLS property type to custom property type
 */
function mapMLSPropertyType(mlsType: string): string {
  const typeMap: Record<string, string> = {
    'Residential': 'detached',
    'Residential Condo & Other': 'condo',
    'Residential Freehold': 'detached',
    'Commercial': 'commercial',
    'Land': 'lot',
  }
  
  // Check if it starts with Residential
  if (mlsType.startsWith('Residential')) {
    if (mlsType.includes('Condo')) {
      return 'condo'
    }
    if (mlsType.includes('Freehold')) {
      return 'detached'
    }
    return 'detached'
  }
  
  return typeMap[mlsType] || mlsType.toLowerCase()
}

/**
 * Map MLS status to custom status
 */
function mapMLSStatus(mlsStatus: string): string {
  const statusMap: Record<string, string> = {
    'Active': 'active',
    'Pending': 'conditional',
    'Sold': 'sold',
    'Expired': 'not_available',
    'Cancelled': 'not_available',
  }
  
  return statusMap[mlsStatus] || 'active'
}

/**
 * Get MLS property details by ID or listing key
 */
export async function getMLSPropertyById(id: string): Promise<any | null> {
  try {
    const url = `${MLS_SEARCH_BASE_URL}/properties/${encodeURIComponent(id)}`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${MLS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      // Don't log 404s as errors - property just doesn't exist in MLS
      if (response.status === 404) {
        return null
      }
      // Log other errors but don't throw
      const errorText = await response.text().catch(() => 'Unknown error')
      console.error(`MLS Property API error: ${response.status} ${response.statusText}`, errorText.substring(0, 200))
      return null
    }

    const data = await response.json()
    return data.data ? mapMLSToCustomProperty(data.data) : null
  } catch (error) {
    // Handle timeout and network errors gracefully
    if (error instanceof Error && error.name === 'TimeoutError') {
      console.error('MLS Property API timeout:', id)
    } else {
      console.error('Error fetching MLS property:', error)
    }
    return null
  }
}

/**
 * Get MLS property media by ID or listing key
 */
export async function getMLSPropertyMedia(id: string): Promise<string[]> {
  try {
    const url = `${MLS_SEARCH_BASE_URL}/properties/${encodeURIComponent(id)}/media`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${MLS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      // Silently return empty array for 404s or other errors
      return []
    }

    const data = await response.json()
    if (data.data && Array.isArray(data.data)) {
      return data.data
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
        .map((item: any) => item.url)
        .filter(Boolean)
    }
    
    return []
  } catch (error) {
    // Silently handle errors - media is optional
    if (error instanceof Error && error.name === 'TimeoutError') {
      console.error('MLS Property Media API timeout:', id)
    }
    return []
  }
}
