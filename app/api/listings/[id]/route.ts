import { NextResponse } from 'next/server'
import { listingsDb } from '@/lib/db/listings-db'
import { listings, listingMedia } from '@/lib/db/listings-schema'
import { eq } from 'drizzle-orm'
import { transformListingToProperty, generateMLSSlug } from '@/lib/listings-transformer'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    let listingData = null

    // First try to get by exact ID
    const [result] = await listingsDb
      .select()
      .from(listings)
      .where(eq(listings.id, id))

    if (result) {
      listingData = result
    } else {
      // If not found by exact ID, try to find by slug
      // Get all active listings and search by slug
      const allListings = await listingsDb
        .select()
        .from(listings)
        .where(eq(listings.standardStatus, 'Active'))

      // Transform listings to find matching slug
      for (const listing of allListings) {
        const transformed = transformListingToProperty(listing, [])
        const slug = generateMLSSlug(transformed)
        
        // Check if the provided ID matches the generated slug
        if (slug === id || id.endsWith(`-${listing.id.slice(0, 8)}`)) {
          listingData = listing
          break
        }
      }
    }

    if (!listingData) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Get media for this listing
    const media = await listingsDb
      .select()
      .from(listingMedia)
      .where(eq(listingMedia.listingId, listingData.id))
      .orderBy(listingMedia.displayOrder)

    // Transform to our internal format
    const transformedListing = transformListingToProperty(listingData, media)

    // Add additional fields for the detail view
    const listingDetails = {
      ...transformedListing,
      // Add more detailed information for the listing page
      lotSize: listingData.lotSizeArea ? `${listingData.lotSizeArea} ${listingData.lotSizeUnits || 'sq ft'}` : null,
      directions: listingData.directions,
      virtualTourUrl: listingData.virtualTourUrl,
      buildingName: listingData.buildingName,
      zoning: listingData.zoning,
      businessType: listingData.businessType,
      
      // Dates
      listDate: listingData.listDate?.toISOString(),
      expirationDate: listingData.expirationDate?.toISOString(),
      closeDate: listingData.closeDate?.toISOString(),
      
      // Raw data for debugging (only in development)
      ...(process.env.NODE_ENV === 'development' && { 
        rawData: listingData 
      })
    }

    return NextResponse.json(listingDetails)
  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    )
  }
} 