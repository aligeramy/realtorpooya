import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { properties, propertyImages } from '@/lib/db/schema'
import { eq, ne, asc } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    // Get non-archived properties for the website (following the database documentation pattern)
    // Reversed order: show oldest properties first
    const featuredProperties = await db
      .select()
      .from(properties)
      .leftJoin(propertyImages, eq(properties.id, propertyImages.propertyId))
      .where(ne(properties.status, 'archived'))
      .orderBy(asc(properties.displayOrder), asc(properties.createdAt))

    // Group images by property
    const propertiesMap = new Map()
    
    for (const row of featuredProperties) {
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
    console.error('Error fetching featured properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured properties' },
      { status: 500 }
    )
  }
}
