import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { properties, propertyImages } from '@/lib/db/schema'
import { eq, ne } from 'drizzle-orm'
import { createAddressSlug, findPropertyBySlug } from '@/lib/utils'
import { getMLSPropertyById, getMLSPropertyMedia, searchMLSProperties, mapMLSToCustomProperty } from '@/lib/mls-search'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      const allPropertiesRows = await db
        .select()
        .from(properties)
        .where(ne(properties.status, 'archived'))

      // Extract unique properties (in case of duplicates)
      const propertiesMap = new Map()
      for (const row of allPropertiesRows) {
        if (!propertiesMap.has(row.id)) {
          propertiesMap.set(row.id, row)
        }
      }
      const allProperties = Array.from(propertiesMap.values())

      propertyData = findPropertyBySlug(allProperties, id)
    }

    // If still not found, try MLS API
    let mlsProperty = null
    let mlsMedia: string[] = []
    if (!propertyData) {
      // Extract address from slug if it's a slug format
      const parts = id.split('-')
      const lastPart = parts[parts.length - 1]
      const isSlugFormat = lastPart && lastPart.length === 8 && /^[0-9a-f]{8}$/i.test(lastPart)
      
      if (isSlugFormat) {
        // It's a slug format - search MLS by address
        const addressSlug = parts.slice(0, -1).join('-')
        const addressPattern = addressSlug.replace(/-/g, ' ')
        
        try {
          // Search MLS properties by address
          const mlsResults = await searchMLSProperties({
            q: addressPattern,
            limit: 50,
            transactionType: 'for_sale'
          })
          
          if (mlsResults && mlsResults.data) {
            // Find property matching the ID suffix
            const targetIdSuffix = lastPart.toLowerCase()
            mlsProperty = mlsResults.data
              .map(mapMLSToCustomProperty)
              .find((p: any) => p.id && p.id.slice(-8).toLowerCase() === targetIdSuffix)
            
            if (mlsProperty) {
              mlsMedia = await getMLSPropertyMedia(mlsProperty.id)
            }
          }
        } catch (error) {
          console.error('MLS search by address failed:', error)
        }
      } else {
        // Try direct MLS lookup by ID (UUID or MLS listing key)
        const looksLikeMLSId = isUUID || /^[CE]\d+$/i.test(id)
        if (looksLikeMLSId) {
          try {
            mlsProperty = await getMLSPropertyById(id)
            if (mlsProperty) {
              mlsMedia = await getMLSPropertyMedia(id)
            }
          } catch (error) {
            console.error('MLS property lookup failed:', error)
          }
        }
      }
    }

    if (!propertyData && !mlsProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Use MLS property if custom property not found
    const finalProperty = propertyData || mlsProperty

    // Get images (only for custom properties)
    let images: any[] = []
    if (propertyData) {
      images = await db
        .select()
        .from(propertyImages)
        .where(eq(propertyImages.propertyId, propertyData.id))
        .orderBy(propertyImages.displayOrder)
    }

    // Combine all data
    const property = {
      ...finalProperty,
      images: propertyData ? images : [],
      // Use MLS media if available
      mediaUrls: propertyData 
        ? propertyData.mediaUrls 
        : mlsMedia.length > 0 
          ? mlsMedia 
          : finalProperty.heroImage 
            ? [finalProperty.heroImage] 
            : [],
      // Convert CRM fields to frontend format for backward compatibility
      media_urls: propertyData 
        ? propertyData.mediaUrls 
        : mlsMedia.length > 0 
          ? mlsMedia 
          : finalProperty.heroImage 
            ? [finalProperty.heroImage] 
            : [],
      hero_image: finalProperty.heroImage || (mlsMedia.length > 0 ? mlsMedia[0] : null),
      youtube_video: finalProperty.youtubeVideo,
      square_feet: finalProperty.squareFeet || finalProperty.livingArea,
      year_built: finalProperty.yearBuilt,
      property_type: finalProperty.propertyType,
      postal_code: finalProperty.postalCode,
      listing_date: finalProperty.listingDate instanceof Date 
        ? finalProperty.listingDate.toISOString() 
        : finalProperty.listingDate,
      created_at: finalProperty.createdAt instanceof Date 
        ? finalProperty.createdAt.toISOString() 
        : finalProperty.createdAt,
      source: propertyData ? 'custom' : 'mls',
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
