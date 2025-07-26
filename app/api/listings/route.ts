import { NextResponse } from 'next/server'
import { listingsDb } from '@/lib/db/listings-db'
import { listings, listingMedia } from '@/lib/db/listings-schema'
import { eq, like, and, or, desc, gte, lte, ne, isNotNull } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import { transformListingToProperty } from '@/lib/listings-transformer'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get filter parameters
    const search = searchParams.get('search')
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const bathrooms = searchParams.get('bathrooms')
    const propertyType = searchParams.get('propertyType')
    const priceRange = searchParams.get('priceRange')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build where conditions
    const conditions = []

    // Only show active listings
    conditions.push(eq(listings.standardStatus, 'Active'))

    // Ensure we have essential data
    conditions.push(isNotNull(listings.listPrice))
    conditions.push(isNotNull(listings.city))

    if (search) {
      const searchLower = search.toLowerCase()
      conditions.push(
        or(
          like(sql`lower(${listings.unparsedAddress})`, `%${searchLower}%`),
          like(sql`lower(${listings.formattedAddress})`, `%${searchLower}%`),
          like(sql`lower(${listings.city})`, `%${searchLower}%`),
          like(sql`lower(${listings.publicRemarks})`, `%${searchLower}%`)
        )
      )
    }

    if (city && city !== 'all') {
      conditions.push(like(sql`lower(${listings.city})`, `%${city.toLowerCase()}%`))
    }

    // Handle price range from hero section filters
    if (priceRange && priceRange !== '' && priceRange !== 'any' && priceRange !== 'all') {
      if (priceRange.includes('-')) {
        const [min, max] = priceRange.split('-').map(Number)
        if (min) conditions.push(gte(listings.listPrice, min.toString()))
        if (max) conditions.push(lte(listings.listPrice, max.toString()))
      } else if (priceRange.endsWith('+')) {
        const min = parseInt(priceRange.replace('+', ''))
        conditions.push(gte(listings.listPrice, min.toString()))
      }
    }

    // Handle individual price filters
    if (minPrice) {
      conditions.push(gte(listings.listPrice, minPrice))
    }

    if (maxPrice) {
      conditions.push(lte(listings.listPrice, maxPrice))
    }

    // Property type filtering (map from our internal types to MLS types)
    if (propertyType && propertyType !== 'all' && propertyType !== 'any') {
      const mlsTypeMap: Record<string, string[]> = {
        'detached': ['Detached', 'House', 'Single Family'],
        'condo': ['Condominium', 'Condo', 'Apartment'],
        'townhouse': ['Townhouse', 'Townhome', 'Row'],
        'lot': ['Vacant Land', 'Land', 'Lot'],
        'multi-res': ['Multi-Family', 'Duplex', 'Triplex', 'Fourplex']
      }
      
      const mlsTypes = mlsTypeMap[propertyType] || [propertyType]
      const typeConditions = mlsTypes.map(type => 
        like(sql`lower(${listings.propertyType})`, `%${type.toLowerCase()}%`)
      )
      conditions.push(or(...typeConditions))
    }

    // Bedroom filtering
    if (bedrooms && bedrooms !== 'all' && bedrooms !== 'any') {
      const bedroomCount = parseInt(bedrooms)
      if (!isNaN(bedroomCount)) {
        conditions.push(gte(listings.bedroomsTotal, bedroomCount))
      }
    }

    // Bathroom filtering
    if (bathrooms && bathrooms !== 'all' && bathrooms !== 'any') {
      const bathroomCount = parseInt(bathrooms)
      if (!isNaN(bathroomCount)) {
        conditions.push(gte(listings.bathroomsTotal, bathroomCount))
      }
    }

    // Fetch listings with media
    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined

    const listingsResult = await listingsDb
      .select()
      .from(listings)
      .leftJoin(listingMedia, eq(listings.id, listingMedia.listingId))
      .where(whereCondition)
      .orderBy(desc(listings.listDate))
      .limit(limit)

    // Group listings with their media
    const listingsMap = new Map()
    
    for (const row of listingsResult) {
      const listing = row.listings
      const media = row.listing_media
      
      if (!listingsMap.has(listing.id)) {
        listingsMap.set(listing.id, {
          listing,
          media: []
        })
      }
      
      if (media) {
        listingsMap.get(listing.id).media.push(media)
      }
    }

    // Transform to our internal format
    const transformedListings = Array.from(listingsMap.values()).map(({ listing, media }) => 
      transformListingToProperty(listing, media)
    )

    return NextResponse.json(transformedListings)
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
} 