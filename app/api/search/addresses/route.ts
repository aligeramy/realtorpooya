import { NextResponse } from 'next/server'
import { listingsDb } from '@/lib/db/listings-db'
import { listings, listingMedia } from '@/lib/db/listings-schema'
import { eq, like, and, or, desc, gte, lte, sql, isNotNull } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const query = searchParams.get('query')
    const city = searchParams.get('city')
    const province = searchParams.get('province')
    const postalCode = searchParams.get('postalCode')
    const radius = searchParams.get('radius')
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0)
    const searchType = searchParams.get('searchType') || 'fuzzy'

    const startTime = Date.now()

    // Build search conditions - focus on standardized addresses
    const conditions = []
    
    // Only search standardized addresses for better quality
    conditions.push(eq(listings.addressStandardized, true))
    conditions.push(isNotNull(listings.formattedAddress))
    conditions.push(eq(listings.standardStatus, 'Active'))
    conditions.push(isNotNull(listings.listPrice))

    // Main address search - prioritize formattedAddress
    if (query) {
      const searchLower = query.toLowerCase()
      
      if (searchType === 'exact') {
        conditions.push(
          like(sql`lower(${listings.formattedAddress})`, `%${searchLower}%`)
        )
      } else if (searchType === 'prefix') {
        conditions.push(
          like(sql`lower(${listings.formattedAddress})`, `${searchLower}%`)
        )
      } else { // fuzzy search - default
        conditions.push(
          or(
            like(sql`lower(${listings.formattedAddress})`, `%${searchLower}%`),
            like(sql`lower(${listings.city})`, `%${searchLower}%`),
            // Also search individual address components for flexibility
            like(sql`lower(${listings.streetName})`, `%${searchLower}%`),
            like(sql`lower(CONCAT(${listings.streetNumber}, ' ', ${listings.streetName}))`, `%${searchLower}%`)
          )
        )
      }
    }

    // Location filters
    if (city) {
      conditions.push(like(sql`lower(${listings.city})`, `%${city.toLowerCase()}%`))
    }

    if (province) {
      conditions.push(like(sql`lower(${listings.province})`, `%${province.toLowerCase()}%`))
    }

    if (postalCode) {
      conditions.push(like(listings.postalCode, `${postalCode}%`))
    }

    // Radius search (if coordinates provided)
    if (radius && lat && lng) {
      const radiusKm = parseFloat(radius)
      const latitude = parseFloat(lat)
      const longitude = parseFloat(lng)
      
      if (!isNaN(radiusKm) && !isNaN(latitude) && !isNaN(longitude)) {
        // Use Haversine formula for distance calculation
        conditions.push(
          sql`(
            6371 * acos(
              cos(radians(${latitude})) * 
              cos(radians(${listings.latitude})) * 
              cos(radians(${listings.longitude}) - radians(${longitude})) + 
              sin(radians(${latitude})) * 
              sin(radians(${listings.latitude}))
            )
          ) <= ${radiusKm}`
        )
      }
    }

    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined

    // Get total count for pagination
    const countResult = await listingsDb
      .select({ count: sql`COUNT(*)::int` })
      .from(listings)
      .where(whereCondition)

    const total = countResult[0]?.count || 0

    // Get results with proper ordering
    let orderClause = [desc(listings.listDate)]
    
    // For fuzzy search with query, add relevance scoring
    const selectFields = {
      id: listings.id,
      formattedAddress: listings.formattedAddress,
      streetNumber: listings.streetNumber,
      streetName: listings.streetName,
      streetSuffix: listings.streetSuffix,
      unitNumber: listings.unitNumber,
      city: listings.city,
      province: listings.province,
      postalCode: listings.postalCode,
      latitude: listings.latitude,
      longitude: listings.longitude,
      propertyType: listings.propertyType,
      listPrice: listings.listPrice,
      bedroomsTotal: listings.bedroomsTotal,
      bathroomsTotal: listings.bathroomsTotal,
      livingArea: listings.livingArea,
      listDate: listings.listDate,
      standardStatus: listings.standardStatus,
      publicRemarks: listings.publicRemarks
    }

    const listingsResult = await listingsDb
      .select(selectFields)
      .from(listings)
      .where(whereCondition)
      .orderBy(...orderClause)
      .limit(limit)
      .offset(offset)

    // Transform results to standard format
    const transformedResults = listingsResult.map(listing => {
      // Add relevance score based on search match quality
      let relevanceScore = 1.0
      if (query && listing.formattedAddress) {
        const queryLower = query.toLowerCase()
        const addressLower = listing.formattedAddress.toLowerCase()
        
        if (addressLower.includes(queryLower)) {
          // Higher score for exact substring matches
          relevanceScore = 0.9
          if (addressLower.startsWith(queryLower)) {
            relevanceScore = 0.95
          }
        } else if (listing.streetName?.toLowerCase().includes(queryLower)) {
          relevanceScore = 0.8
        } else if (listing.city?.toLowerCase().includes(queryLower)) {
          relevanceScore = 0.7
        }
      }

      // Convert to our property format but keep search-specific fields
      return {
        id: listing.id,
        source: 'mls' as const,
        formattedAddress: listing.formattedAddress,
        address: listing.formattedAddress || `${listing.streetNumber || ''} ${listing.streetName || ''} ${listing.streetSuffix || ''}`.trim(),
        streetNumber: listing.streetNumber,
        streetName: listing.streetName,
        streetSuffix: listing.streetSuffix,
        unitNumber: listing.unitNumber,
        city: listing.city || '',
        province: listing.province || 'ON',
        postalCode: listing.postalCode || '',
        latitude: listing.latitude,
        longitude: listing.longitude,
        propertyType: mapPropertyType(listing.propertyType),
        status: 'active',
        price: listing.listPrice ? Number(listing.listPrice) : 0,
        bedrooms: listing.bedroomsTotal || 0,
        bathrooms: listing.bathroomsTotal || 0,
        squareFeet: listing.livingArea ? Math.round(Number(listing.livingArea)) : undefined,
        listingDate: listing.listDate || new Date(),
        description: listing.publicRemarks || '',
        heroImage: null,
        mediaUrls: [],
        relevanceScore
      }
    })

    // Sort by relevance score if we have a query
    if (query) {
      transformedResults.sort((a, b) => b.relevanceScore - a.relevanceScore)
    }

    const executionTime = Date.now() - startTime

    const response = {
      success: true,
      data: {
        results: transformedResults,
        pagination: {
          total,
          count: transformedResults.length,
          limit,
          offset,
          hasMore: offset + transformedResults.length < total
        },
        searchMetadata: {
          query,
          searchType,
          executionTimeMs: executionTime,
          addressesSearched: 'formattedAddress (standardized)',
          filtersApplied: {
            city: !!city,
            province: !!province,
            postalCode: !!postalCode,
            radius: !!radius,
            coordinates: !!(lat && lng)
          }
        }
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Address search error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Address search failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Helper function to map property types
function mapPropertyType(type?: string): string {
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