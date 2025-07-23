interface AMPProperty {
  ListingKey?: string
  ListingId?: string
  MlsNumber?: string
  UnparsedAddress?: string
  StreetName?: string
  StreetNumber?: string
  City?: string
  StateOrProvince?: string
  PostalCode?: string
  PropertyType?: string
  PropertySubType?: string
  ListPrice?: number
  BedroomsTotal?: number
  BathroomsTotalInteger?: number
  LivingArea?: number
  YearBuilt?: number
  PublicRemarks?: string
  ListingContractDate?: string
  CloseDate?: string
  LotSizeSquareFeet?: number
  ListingStatus?: string
  StandardStatus?: string
  // Add more fields as needed based on RESO Data Dictionary
}

interface AMPResponse<T> {
  value: T[]
  '@odata.count'?: number
  '@odata.nextLink'?: string
}

class AMPAPIService {
  private baseUrl = 'https://query.ampre.ca/odata'
  private apiKey: string

  constructor() {
    this.apiKey = process.env.TREB_KEY || ''
    // Only throw error when actually using the service, not during module loading
  }

  private checkApiKey() {
    if (!this.apiKey) {
      throw new Error('TREB_KEY environment variable is required')
    }
  }

  private async makeRequest<T>(endpoint: string): Promise<AMPResponse<T>> {
    this.checkApiKey()
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`AMP API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getPropertyByMLS(mlsNumber: string): Promise<AMPProperty | null> {
    try {
      // Try different MLS number field names that might be used
      const possibleFields = ['MlsNumber', 'ListingId', 'ListingKey']
      
      for (const field of possibleFields) {
        try {
          const endpoint = `/Property?$filter=${field} eq '${encodeURIComponent(mlsNumber)}'&$top=1`
          const response = await this.makeRequest<AMPProperty>(endpoint)
          
          if (response.value.length > 0) {
            return response.value[0]
          }
        } catch (fieldError) {
          // Try next field if this one fails
          continue
        }
      }
      
      return null
    } catch (error) {
      console.error('Error fetching property from AMP API:', error)
      throw error
    }
  }

  async searchProperties(filters: {
    city?: string
    minPrice?: number
    maxPrice?: number
    propertyType?: string
    bedrooms?: number
    limit?: number
  }): Promise<AMPProperty[]> {
    try {
      const filterConditions: string[] = []
      
      if (filters.city) {
        filterConditions.push(`City eq '${encodeURIComponent(filters.city)}'`)
      }
      if (filters.minPrice) {
        filterConditions.push(`ListPrice ge ${filters.minPrice}`)
      }
      if (filters.maxPrice) {
        filterConditions.push(`ListPrice le ${filters.maxPrice}`)
      }
      if (filters.propertyType) {
        filterConditions.push(`PropertyType eq '${encodeURIComponent(filters.propertyType)}'`)
      }
      if (filters.bedrooms) {
        filterConditions.push(`BedroomsTotal eq ${filters.bedrooms}`)
      }

      const filterString = filterConditions.length > 0 ? `$filter=${filterConditions.join(' and ')}` : ''
      const topString = `$top=${filters.limit || 50}`
      const queryParams = [filterString, topString].filter(Boolean).join('&')
      
      const endpoint = `/Property?${queryParams}`
      const response = await this.makeRequest<AMPProperty>(endpoint)
      
      return response.value
    } catch (error) {
      console.error('Error searching properties from AMP API:', error)
      throw error
    }
  }

  async getPropertyTypes(): Promise<string[]> {
    try {
      const endpoint = `/Lookup?$filter=LookupName eq 'PropertyType'`
      const response = await this.makeRequest<{ LookupValue: string }>(endpoint)
      
      return response.value.map(item => item.LookupValue)
    } catch (error) {
      console.error('Error fetching property types from AMP API:', error)
      return []
    }
  }

  // Convert AMP property data to our internal format
  convertToInternalFormat(ampProperty: AMPProperty) {
    // Build address from components if UnparsedAddress not available
    const address = ampProperty.UnparsedAddress || 
      (ampProperty.StreetNumber && ampProperty.StreetName ? 
        `${ampProperty.StreetNumber} ${ampProperty.StreetName}` : '')
    
    return {
      title: address || `${ampProperty.PropertyType || 'Property'} in ${ampProperty.City || ''}`,
      address: address,
      city: ampProperty.City || '',
      province: ampProperty.StateOrProvince || 'ON',
      postal_code: ampProperty.PostalCode || '',
      property_type: this.mapPropertyType(ampProperty.PropertyType || ampProperty.PropertySubType),
      price: ampProperty.ListPrice?.toString() || '',
      bedrooms: ampProperty.BedroomsTotal?.toString() || '',
      bathrooms: ampProperty.BathroomsTotalInteger?.toString() || '',
      square_feet: ampProperty.LivingArea?.toString() || '',
      year_built: ampProperty.YearBuilt?.toString() || '',
      description: ampProperty.PublicRemarks || '',
      listing_date: ampProperty.ListingContractDate || '',
      closing_date: ampProperty.CloseDate || '',
      lot_dimensions: ampProperty.LotSizeSquareFeet ? `${ampProperty.LotSizeSquareFeet} sq ft` : '',
      status: this.mapStatus(ampProperty.ListingStatus || ampProperty.StandardStatus),
    }
  }

  private mapPropertyType(ampType?: string): string {
    if (!ampType) return ''
    
    // Map AMP property types to our internal enum values
    const typeMap: Record<string, string> = {
      'Residential': 'HOUSE',
      'Condominium': 'CONDO',
      'Townhouse': 'TOWNHOUSE',
      'Apartment': 'APARTMENT',
      'Vacant Land': 'LAND',
      'Commercial': 'COMMERCIAL',
      'Industrial': 'INDUSTRIAL'
    }
    
    return typeMap[ampType] || 'HOUSE'
  }

  private mapStatus(ampStatus?: string): string {
    if (!ampStatus) return 'FOR_SALE'
    
    // Map AMP status to our internal enum values
    const statusMap: Record<string, string> = {
      'Active': 'FOR_SALE',
      'Sold': 'SOLD',
      'Pending': 'PENDING',
      'Expired': 'OFF_MARKET',
      'Withdrawn': 'OFF_MARKET',
      'Coming Soon': 'COMING_SOON'
    }
    
    return statusMap[ampStatus] || 'FOR_SALE'
  }
}

export const ampAPI = new AMPAPIService()
export type { AMPProperty } 