import type { Listing, Media } from './db/listings-schema'

// Transform MLS listing to internal property format
export function transformListingToProperty(listing: Listing, media: Media[] = []) {
  // Get preferred image or first available image
  const preferredMedia = media.find(m => m.isPreferred) || media.find(m => m.mediaType === 'Photo') || media[0]
  
  // Build address - use formattedAddress if standardized, otherwise build from components
  const address = listing.addressstandardized && listing.formattedaddress 
    ? listing.formattedaddress
    : listing.unparsedAddress 
    ? listing.unparsedAddress
    : `${listing.streetNumber || ''} ${listing.streetName || ''} ${listing.streetSuffix || ''}`.trim()

  // Map property types to our internal enum
  const mapPropertyType = (type?: string): string => {
    if (!type) return 'detached'
    
    const typeMap: Record<string, string> = {
      'Detached': 'detached',
      'Condominium': 'condo', 
      'Condo': 'condo',
      'Townhouse': 'townhouse',
      'Townhome': 'townhouse',
      'Vacant Land': 'lot',
      'Land': 'lot',
      'Multi-Family': 'multi-res',
      'Duplex': 'multi-res',
      'Triplex': 'multi-res',
      'Fourplex': 'multi-res'
    }
    
    // Check exact matches first
    if (typeMap[type]) return typeMap[type]
    
    // Check partial matches
    const typeLower = type.toLowerCase()
    if (typeLower.includes('condo')) return 'condo'
    if (typeLower.includes('town')) return 'townhouse'
    if (typeLower.includes('land') || typeLower.includes('lot')) return 'lot'
    if (typeLower.includes('multi') || typeLower.includes('duplex')) return 'multi-res'
    
    return 'detached' // Default
  }

  // Map status to our internal format
  const mapStatus = (status?: string): string => {
    if (!status) return 'active'
    
    const statusMap: Record<string, string> = {
      'Active': 'active',
      'Sold': 'sold',
      'Pending': 'conditional',
      'Conditional': 'conditional',
      'Leased': 'leased',
      'Expired': 'not_available',
      'Withdrawn': 'not_available',
      'Coming Soon': 'coming_soon'
    }
    
    return statusMap[status] || 'active'
  }

  // Convert price to number
  const price = listing.listPrice ? Number(listing.listPrice) : 0

  return {
    id: listing.id,
    // Mark as MLS listing for identification
    source: 'mls' as const,
    
    // Address and location
    address,
    city: listing.city || '',
    province: listing.province || 'ON',
    postalCode: listing.postalCode || '',
    
    // Property details
    propertyType: mapPropertyType(listing.propertyType),
    status: mapStatus(listing.standardStatus || listing.contractStatus),
    price,
    
    // Room counts
    bedrooms: listing.bedroomsTotal || 0,
    bathrooms: listing.bathroomsTotal || 0,
    
    // Dimensions
    squareFeet: listing.livingArea ? Math.round(Number(listing.livingArea)) : undefined,
    yearBuilt: listing.yearBuilt || undefined,
    
    // Media
    heroImage: preferredMedia?.mediaUrl || null,
    mediaUrls: media.map(m => m.mediaUrl).filter(Boolean),
    virtualTourUrl: listing.virtualTourUrl || undefined,
    
    // Description
    description: listing.publicRemarks || '',
    
    // Dates
    listingDate: listing.listDate || new Date(),
    createdAt: listing.createdAt || new Date(),
    
    // Features (combine all feature arrays)
    features: [
      ...(listing.interiorFeatures || []),
      ...(listing.exteriorFeatures || []),
      ...(listing.parkingFeatures || []),
      ...(listing.waterFeatures || [])
    ].filter(Boolean),
    
    // Additional fields that might be useful
    originalListPrice: listing.originalListPrice ? Number(listing.originalListPrice) : undefined,
    closePrice: listing.closePrice ? Number(listing.closePrice) : undefined,
    associationFee: listing.associationFee ? Number(listing.associationFee) : undefined,
    taxAnnualAmount: listing.taxAnnualAmount ? Number(listing.taxAnnualAmount) : undefined,
    lotDimensions: listing.lotSizeArea ? `${listing.lotSizeArea} ${listing.lotSizeUnits || 'sq ft'}` : undefined,
    
    // Keep track of source data
    mlsData: {
      originalType: listing.propertyType,
      originalStatus: listing.standardStatus || listing.contractStatus,
      transactionType: listing.transactionType,
      propertySubType: listing.propertySubType
    }
  }
}

// Helper function to generate slug for MLS listings
export function generateMLSSlug(listing: any): string {
  const addressPart = listing.address
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'property'
  
  // Use the full ID for uniqueness (MLS IDs are already unique)
  const idPart = listing.id
  
  return `${addressPart}-${idPart}`
} 