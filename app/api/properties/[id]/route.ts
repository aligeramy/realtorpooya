import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { properties, propertyImages } from '@/lib/db/schema'
import { listingsDb } from '@/lib/db/listings-db'
import { listings, listingMedia } from '@/lib/db/listings-schema'
import { eq, ne } from 'drizzle-orm'
import { createAddressSlug, findPropertyBySlug } from '@/lib/utils'
import { transformListingToProperty, generateMLSSlug } from '@/lib/listings-transformer'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: originalId } = await params
    let id = originalId
    let propertyData = null
    let propertySource = null

    console.log('Looking for property with ID/slug:', originalId)

    // If the slug ends with -MLSID, extract the MLS ID
    // MLS IDs can start with various letters (X, E, etc.) followed by numbers
    const mlsIdMatch = id.match(/-([A-Z][0-9A-Za-z]+)$/)
    if (mlsIdMatch) {
      id = mlsIdMatch[1]
      console.log('Extracted MLS ID:', id)
    }

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
        propertySource = 'crm'
        console.log('Found CRM property')
      }
    }

    // If not found in CRM, try MLS database by exact ID
    if (!propertyData) {
      console.log('Searching MLS database for ID:', id)
      const [mlsResult] = await listingsDb
        .select()
        .from(listings)
        .where(eq(listings.id, id))
      
      if (mlsResult) {
        propertyData = mlsResult
        propertySource = 'mls'
        console.log('Found MLS property')
      } else {
        console.log('No MLS property found with exact ID')
      }
    }

    // If still not found, try to find by slug in both databases
    if (!propertyData) {
      // Try CRM database first
      const allProperties = await db
        .select()
        .from(properties)
        .where(ne(properties.status, 'archived'))

      propertyData = findPropertyBySlug(allProperties, id)
      if (propertyData) {
        propertySource = 'crm'
      } else {
        // Try MLS database by slug
        const allListings = await listingsDb
          .select()
          .from(listings)
          .where(eq(listings.standardStatus, 'Active'))

        // Transform listings to find matching slug
        for (const listing of allListings) {
          const transformed = transformListingToProperty(listing, [])
          const slug = generateMLSSlug(transformed)
          // Check if the provided ID matches the generated slug or ends with the full MLS ID
          if (slug === id || id.endsWith(`-${listing.id}`)) {
            propertyData = listing
            propertySource = 'mls'
            break
          }
        }
      }
    }

    if (!propertyData) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Handle response based on data source
    if (propertySource === 'crm') {
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
    } else {
      // Handle MLS listing
      const media = await listingsDb
        .select()
        .from(listingMedia)
        .where(eq(listingMedia.listingId, propertyData.id))
        .orderBy(listingMedia.displayOrder)

      // Transform to our internal format
      const transformedListing = transformListingToProperty(propertyData, media)

      // Add additional fields for the detail view
      const listingDetails = {
        ...transformedListing,
        // Add more detailed information for the listing page
        lotSize: propertyData.lotSizeArea ? `${propertyData.lotSizeArea} ${propertyData.lotSizeUnits || 'sq ft'}` : null,
        directions: propertyData.directions,
        virtualTourUrl: propertyData.virtualTourUrl,
        buildingName: propertyData.buildingName,
        zoning: propertyData.zoning,
        businessType: propertyData.businessType,
        
        // Dates
        listDate: propertyData.listDate && !isNaN(propertyData.listDate.getTime()) 
          ? propertyData.listDate.toISOString() 
          : null,
        expirationDate: propertyData.expirationDate && !isNaN(propertyData.expirationDate.getTime()) 
          ? propertyData.expirationDate.toISOString() 
          : null,
        closeDate: propertyData.closeDate && !isNaN(propertyData.closeDate.getTime()) 
          ? propertyData.closeDate.toISOString() 
          : null,
        
        // Convert to CRM-compatible fields for frontend compatibility
        images: media.map(m => ({ url: m.mediaUrl, displayOrder: m.displayOrder })),
        media_urls: media.map(m => m.mediaUrl).filter(Boolean),
        hero_image: transformedListing.heroImage,
        square_feet: transformedListing.squareFeet,
        year_built: transformedListing.yearBuilt,
        property_type: transformedListing.propertyType,
        postal_code: transformedListing.postalCode,
        listing_date: transformedListing.listingDate?.toISOString(),
        created_at: transformedListing.createdAt?.toISOString(),
        
        // Raw data for debugging (only in development)
        ...(process.env.NODE_ENV === 'development' && { 
          rawData: propertyData 
        })
      }

      return NextResponse.json(listingDetails)
    }
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}
