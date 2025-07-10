import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { properties, propertyImages } from '@/lib/db/schema'
import { eq, ne } from 'drizzle-orm'
import { createAddressSlug, findPropertyBySlug } from '@/lib/utils'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    let propertyData = null

    // First try to get by UUID (for direct ID access)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    
    if (isUUID) {
      const [result] = await db
        .select()
        .from(properties)
        .where(eq(properties.id, id))
      propertyData = result
    }

    // If not found by UUID or not a UUID, try to find by slug
    if (!propertyData) {
      // Get all non-archived properties and search by slug
      const allProperties = await db
        .select()
        .from(properties)
        .where(ne(properties.status, 'archived'))

      propertyData = findPropertyBySlug(allProperties, id)
    }

    if (!propertyData) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Get images
    const images = await db
      .select()
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, propertyData.id))
      .orderBy(propertyImages.displayOrder)

    // Combine all data
    const property = {
      ...propertyData,
      images,
      // Convert CRM fields to frontend format for backward compatibility
      media_urls: propertyData.mediaUrls,
      hero_image: propertyData.heroImage,
      youtube_video: propertyData.youtubeVideo,
      square_feet: propertyData.squareFeet,
      year_built: propertyData.yearBuilt,
      property_type: propertyData.propertyType,
      postal_code: propertyData.postalCode,
      listing_date: propertyData.listingDate?.toISOString(),
      created_at: propertyData.createdAt?.toISOString(),
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}
