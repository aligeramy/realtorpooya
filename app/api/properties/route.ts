import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { properties, propertyImages } from '@/lib/db/schema'
import { eq, like, and, or, desc, gte, lte, ne, sql, ilike } from 'drizzle-orm'
import { searchMLSProperties, mapMLSToCustomProperty } from '@/lib/mls-search'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || searchParams.get('q') // Support both 'search' and 'q' params
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const propertyType = searchParams.get('propertyType')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    // Build where conditions for custom properties
    const conditions = []

    // Only show non-archived properties on the website (following database documentation pattern)
    conditions.push(ne(properties.status, 'archived'))

    if (search) {
      // Search in address, city, postal code (description is JSONB and excluded from search)
      const searchPattern = `%${search}%`
      
      conditions.push(
        or(
          ilike(properties.address, searchPattern),
          ilike(properties.city, searchPattern),
          ilike(properties.postalCode, searchPattern)
        )
      )
    }

    if (city) {
      conditions.push(like(properties.city, `%${city}%`))
    }

    if (minPrice) {
      conditions.push(gte(properties.price, parseInt(minPrice)))
    }

    if (maxPrice) {
      conditions.push(lte(properties.price, parseInt(maxPrice)))
    }

    if (bedrooms) {
      conditions.push(eq(properties.bedrooms, bedrooms))
    }

    if (propertyType) {
      // Map frontend property types to CRM enum values
      const typeMap: Record<string, 'detached' | 'condo' | 'townhouse' | 'lot' | 'multi-res'> = {
        'house': 'detached',
        'condo': 'condo',
        'townhouse': 'townhouse',
        'land': 'lot',
        'multi-family': 'multi-res'
      }
      const mappedType = typeMap[propertyType.toLowerCase()]
      if (mappedType) {
        conditions.push(eq(properties.propertyType, mappedType))
      }
    }

    // Fetch custom properties and MLS properties in parallel
    const [customPropertiesResult, mlsSearchResult] = await Promise.allSettled([
      // Fetch custom properties from database
      db
        .select()
        .from(properties)
        .leftJoin(propertyImages, eq(properties.id, propertyImages.propertyId))
        .where(and(...conditions))
        .orderBy(desc(properties.displayOrder), desc(properties.createdAt)),
      
      // Fetch MLS properties from search API
      searchMLSProperties({
        q: search || undefined,
        city: city || undefined,
        minPrice: minPrice ? parseInt(minPrice) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
        bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
        propertyType: propertyType ? mapPropertyTypeToMLS(propertyType) : undefined,
        transactionType: 'for_sale', // Only show for sale properties
        limit: limit || 50, // Use provided limit or default to 50
        sortBy: 'newest',
      }),
    ])

    // Process custom properties
    const customPropertiesMap = new Map()
    
    if (customPropertiesResult.status === 'fulfilled') {
      for (const row of customPropertiesResult.value) {
        const property = row.properties
        const image = row.property_images
        
        if (!customPropertiesMap.has(property.id)) {
          customPropertiesMap.set(property.id, {
            ...property,
            images: [],
            source: 'custom', // Mark as custom property
          })
        }
        
        if (image) {
          customPropertiesMap.get(property.id).images.push(image)
        }
      }
    } else {
      console.error('Error fetching custom properties:', customPropertiesResult.reason)
    }

    // Process MLS properties
    const mlsProperties: any[] = []
    
    if (mlsSearchResult.status === 'fulfilled' && mlsSearchResult.value) {
      const mlsData = mlsSearchResult.value
      for (const mlsProperty of mlsData.data) {
        const mappedProperty = mapMLSToCustomProperty(mlsProperty)
        mlsProperties.push(mappedProperty)
      }
    } else {
      console.error('Error fetching MLS properties:', mlsSearchResult.status === 'rejected' ? mlsSearchResult.reason : 'No data')
    }

    // Combine results: custom properties first, then MLS properties
    const customPropertiesArray = Array.from(customPropertiesMap.values())
    const allProperties = [...customPropertiesArray, ...mlsProperties]

    return NextResponse.json(allProperties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

/**
 * Map frontend property type to MLS property type
 */
function mapPropertyTypeToMLS(propertyType: string): string {
  const typeMap: Record<string, string> = {
    'house': 'Residential',
    'detached': 'Residential',
    'condo': 'Residential',
    'townhouse': 'Residential',
    'land': 'Land',
    'lot': 'Land',
    'commercial': 'Commercial',
    'multi-family': 'Residential',
  }
  
  return typeMap[propertyType.toLowerCase()] || 'Residential'
}
