import { NextResponse } from 'next/server'
import { listingsDb } from '@/lib/db/listings-db'
import { listings, listingMedia } from '@/lib/db/listings-schema'
import { eq, isNotNull, desc } from 'drizzle-orm'
import { transformListingToProperty } from '@/lib/listings-transformer'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    // Get featured active listings with media
    const featuredListings = await listingsDb
      .select()
      .from(listings)
      .leftJoin(listingMedia, eq(listings.id, listingMedia.listingId))
      .where(
        eq(listings.standardStatus, 'Active')
      )
      .orderBy(desc(listings.listDate))
      .limit(limit * 3) // Get more to ensure we have enough with images

    // Group images by listing
    const listingsMap = new Map()
    
    for (const row of featuredListings) {
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

    // Transform to our internal format and prioritize listings with images
    const transformedListings = Array.from(listingsMap.values())
      .map(({ listing, media }) => transformListingToProperty(listing, media))
      .filter(listing => listing.heroImage) // Only include listings with images
      .slice(0, limit) // Limit final results

    return NextResponse.json(transformedListings)
  } catch (error) {
    console.error('Error fetching featured listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured listings' },
      { status: 500 }
    )
  }
} 