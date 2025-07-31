import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { properties, propertyImages } from '@/lib/db/schema'
import { eq, ne } from 'drizzle-orm'
import { createAddressSlug, findPropertyBySlug } from '@/lib/utils'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: originalId } = await params
    let id = originalId
    let propertyData = null

    console.log('Looking for property with ID/slug:', originalId)

    // First try to get by UUID from CRM database
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    
    console.log('Is UUID?', isUUID)
    
    if (isUUID) {
      const [result] = await db
        .select()
        .from(properties)
        .where(eq(properties.id, id))
      
      if (result) {
        propertyData = result
        console.log('Found CRM property')
      }
    }

    // If not found, try to find by slug in CRM database
    if (!propertyData) {
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

    // Get images for CRM property
    const images = await db
      .select()
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, propertyData.id))
      .orderBy(propertyImages.displayOrder)

    // Combine all data for CRM property
    const property = {
      ...propertyData,
      source: 'crm',
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
