import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { properties, propertyImages } from '@/lib/db/schema'
import { eq, like, and, or, desc, gte, lte, ne } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const propertyType = searchParams.get('propertyType')

    // Build where conditions
    const conditions = []

    // Only show non-archived properties on the website (following database documentation pattern)
    conditions.push(ne(properties.status, 'archived'))

    if (search) {
      conditions.push(
        or(
          like(properties.address, `%${search}%`),
          like(properties.city, `%${search}%`),
          like(properties.description, `%${search}%`)
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

    // Build the query with conditional where
    const allProperties = await db
      .select()
      .from(properties)
      .leftJoin(propertyImages, eq(properties.id, propertyImages.propertyId))
      .where(and(...conditions))
      .orderBy(desc(properties.displayOrder), desc(properties.createdAt))

    // Group images by property
    const propertiesMap = new Map()
    
    for (const row of allProperties) {
      const property = row.properties
      const image = row.property_images
      
      if (!propertiesMap.has(property.id)) {
        propertiesMap.set(property.id, {
          ...property,
          images: []
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
