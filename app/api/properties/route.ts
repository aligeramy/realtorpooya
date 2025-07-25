import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { properties, propertyImages } from '@/lib/db/schema'
import { eq, like, and, or, desc, gte, lte, ne } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

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

    // Build the query with conditional where
    const allProperties = await db
      .select()
      .from(properties)
      .leftJoin(propertyImages, eq(properties.id, propertyImages.propertyId))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(properties.listingDate))

    // Group images by property
    const propertiesMap = new Map()
    
    for (const row of allProperties) {
      const property = row.properties
      const image = row.property_images
      
      if (!propertiesMap.has(property.id)) {
        propertiesMap.set(property.id, {
          ...property,
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

    const result = Array.from(propertiesMap.values())

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}
