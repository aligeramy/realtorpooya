import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { properties, propertyImages } from '@/lib/db/schema'
import { listingsDb } from '@/lib/db/listings-db'
import { listings, listingMedia } from '@/lib/db/listings-schema'
import { eq, like, and, or, desc, gte, lte, ne, isNotNull } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import { transformListingToProperty } from '@/lib/listings-transformer'

// Helper function to fetch MLS listings with the same filters
async function fetchMLSListings(searchParams: URLSearchParams) {
  try {
    const search = searchParams.get('search')
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const bathrooms = searchParams.get('bathrooms')
    const propertyType = searchParams.get('propertyType')
    const priceRange = searchParams.get('priceRange')
    const limit = parseInt(searchParams.get('limit') || '25') // Limit MLS results

    // Build MLS where conditions
    const mlsConditions = []

    // Only show active listings
    mlsConditions.push(eq(listings.standardStatus, 'Active'))
    mlsConditions.push(isNotNull(listings.listPrice))
    mlsConditions.push(isNotNull(listings.city))

    if (search) {
      const searchLower = search.toLowerCase()
      mlsConditions.push(
        or(
          like(sql`lower(${listings.unparsedAddress})`, `%${searchLower}%`),
          like(sql`lower(${listings.formattedAddress})`, `%${searchLower}%`),
          like(sql`lower(${listings.city})`, `%${searchLower}%`),
          like(sql`lower(${listings.publicRemarks})`, `%${searchLower}%`)
        )
      )
    }

    if (city && city !== 'all') {
      mlsConditions.push(like(sql`lower(${listings.city})`, `%${city.toLowerCase()}%`))
    }

    // Handle price range
    if (priceRange && priceRange !== '' && priceRange !== 'any' && priceRange !== 'all') {
      if (priceRange.includes('-')) {
        const [min, max] = priceRange.split('-').map(Number)
        if (min) mlsConditions.push(gte(listings.listPrice, min.toString()))
        if (max) mlsConditions.push(lte(listings.listPrice, max.toString()))
      } else if (priceRange.endsWith('+')) {
        const min = parseInt(priceRange.replace('+', ''))
        mlsConditions.push(gte(listings.listPrice, min.toString()))
      }
    }

    // Individual price filters
    if (minPrice) {
      mlsConditions.push(gte(listings.listPrice, minPrice))
    }
    if (maxPrice) {
      mlsConditions.push(lte(listings.listPrice, maxPrice))
    }

    // Property type filtering
    if (propertyType && propertyType !== 'all' && propertyType !== 'any' && propertyType !== '') {
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
      mlsConditions.push(or(...typeConditions))
    }

    // Bedroom filtering
    if (bedrooms && bedrooms !== 'all' && bedrooms !== 'any' && bedrooms !== '') {
      const bedroomCount = parseInt(bedrooms)
      if (!isNaN(bedroomCount)) {
        mlsConditions.push(gte(listings.bedroomsTotal, bedroomCount))
      }
    }

    // Bathroom filtering
    if (bathrooms && bathrooms !== 'all' && bathrooms !== 'any' && bathrooms !== '') {
      const bathroomCount = parseInt(bathrooms)
      if (!isNaN(bathroomCount)) {
        mlsConditions.push(gte(listings.bathroomsTotal, bathroomCount))
      }
    }

    // Fetch MLS listings with media
    const whereCondition = mlsConditions.length > 0 ? and(...mlsConditions) : undefined

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
    return Array.from(listingsMap.values()).map(({ listing, media }) => 
      transformListingToProperty(listing, media)
    )
  } catch (error) {
    console.error('Error fetching MLS listings:', error)
    return [] // Return empty array on error to not break the main request
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get filter parameters (support both hero section and existing parameters)
    const search = searchParams.get('search')
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const bathrooms = searchParams.get('bathrooms')
    const propertyType = searchParams.get('propertyType')
    const priceRange = searchParams.get('priceRange')

    // Build where conditions
    const conditions = []

    // Only show non-archived properties on the website (following database documentation pattern)
    conditions.push(ne(properties.status, 'archived'))

    if (search) {
      // Convert search to lowercase for case-insensitive search
      const searchLower = search.toLowerCase()
      conditions.push(
        or(
          like(sql`lower(${properties.address})`, `%${searchLower}%`),
          like(sql`lower(${properties.city})`, `%${searchLower}%`)
          // Note: description is JSONB field, so we can't use LIKE on it directly
          // We'll handle description search in a future update with proper JSONB queries
        )
      )
    }

    if (city) {
      conditions.push(like(properties.city, `%${city}%`))
    }

    // Handle price range from hero section filters
    if (priceRange && priceRange !== '' && priceRange !== 'any' && priceRange !== 'all') {
      if (priceRange.includes('-')) {
        const [min, max] = priceRange.split('-').map(Number)
        if (min) conditions.push(gte(properties.price, min))
        if (max) conditions.push(lte(properties.price, max))
      } else if (priceRange.endsWith('+')) {
        // Handle "5000000+" format
        const min = parseInt(priceRange.replace('+', ''))
        conditions.push(gte(properties.price, min))
      }
    }

    // Handle individual price filters (for backward compatibility)
    if (minPrice) {
      conditions.push(gte(properties.price, parseInt(minPrice)))
    }

    if (maxPrice) {
      conditions.push(lte(properties.price, parseInt(maxPrice)))
    }

    // Handle bedrooms filter - database uses text field to support "3+1", "4+x" format
    if (bedrooms && bedrooms !== '' && bedrooms !== 'any' && bedrooms !== 'all') {
      const bedroomNum = parseInt(bedrooms)
      // Match properties that have >= the specified number of bedrooms
      // This handles formats like "3", "3+1", "4+1", etc.
      conditions.push(
        or(
          // Exact match or starts with number
          like(properties.bedrooms, `${bedroomNum}%`),
          // Higher numbers
          like(properties.bedrooms, `${bedroomNum + 1}%`),
          like(properties.bedrooms, `${bedroomNum + 2}%`),
          like(properties.bedrooms, `${bedroomNum + 3}%`),
          like(properties.bedrooms, `${bedroomNum + 4}%`),
          like(properties.bedrooms, `${bedroomNum + 5}%`),
          like(properties.bedrooms, `${bedroomNum + 6}%`),
          like(properties.bedrooms, `${bedroomNum + 7}%`),
          like(properties.bedrooms, `${bedroomNum + 8}%`),
          like(properties.bedrooms, `${bedroomNum + 9}%`)
        )
      )
    }

    // Handle bathrooms filter - database uses integer field
    if (bathrooms && bathrooms !== '' && bathrooms !== 'any' && bathrooms !== 'all') {
      conditions.push(gte(properties.bathrooms, parseInt(bathrooms)))
    }

    // Handle property type filter - use exact database enum values
    if (propertyType && propertyType !== '' && propertyType !== 'any' && propertyType !== 'all') {
      // Database uses: 'detached', 'condo', 'townhouse', 'lot', 'multi-res'
      // These now match our hero section filter values
      conditions.push(eq(properties.propertyType, propertyType as 'detached' | 'condo' | 'townhouse' | 'lot' | 'multi-res'))
    }

    // Fetch from both databases in parallel
    const [crmPropertiesResult, mlsListingsResult] = await Promise.all([
      // Fetch from CRM database
      db
        .select()
        .from(properties)
        .leftJoin(propertyImages, eq(properties.id, propertyImages.propertyId))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(properties.listingDate)),
      
      // Fetch from MLS database
      fetchMLSListings(searchParams)
    ])

    // Process CRM properties
    const propertiesMap = new Map()
    
    for (const row of crmPropertiesResult) {
      const property = row.properties
      const image = row.property_images
      
      if (!propertiesMap.has(property.id)) {
        propertiesMap.set(property.id, {
          ...property,
          source: 'crm',
          images: [],
          // Add MLS-compatible field mappings for future integration
          ListingKey: property.mlsId || property.id,
          ListPrice: property.price,
          PropertyType: property.propertyType,
          BedroomsTotal: property.bedrooms,
          BathroomsTotalInteger: property.bathrooms,
          LivingArea: property.squareFeet,
          City: property.city,
          StateOrProvince: property.province,
          PostalCode: property.postalCode,
          StreetName: property.address,
          YearBuilt: property.yearBuilt,
          ListingDate: property.listingDate,
          PropertySubType: property.propertyType,
          // Keep original fields for backward compatibility
          media_urls: property.mediaUrls,
          hero_image: property.heroImage,
          youtube_video: property.youtubeVideo,
          square_feet: property.squareFeet,
          year_built: property.yearBuilt,
          property_type: property.propertyType,
          postal_code: property.postalCode,
          listing_date: property.listingDate?.toISOString(),
          created_at: property.createdAt?.toISOString(),
        })
      }
      
      if (image) {
        propertiesMap.get(property.id).images.push(image)
      }
    }

    // Combine CRM properties and MLS listings
    const crmProperties = Array.from(propertiesMap.values())
    const allResults = [...crmProperties, ...mlsListingsResult]

    // Sort combined results by listing date (newest first)
    allResults.sort((a, b) => {
      const dateA = new Date(a.listingDate || a.listing_date || 0)
      const dateB = new Date(b.listingDate || b.listing_date || 0)
      return dateB.getTime() - dateA.getTime()
    })

    return NextResponse.json(allResults)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}
