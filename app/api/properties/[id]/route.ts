import { NextResponse } from 'next/server'
import { loadListing } from '@/lib/listing/load'
import { MLS_SEARCH_ENABLED, getMLSPropertyById, getMLSPropertyMedia, searchMLSProperties, mapMLSToCustomProperty } from '@/lib/mls-search'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // CRM listings (by UUID or public slug) come from the shared loader that
    // also powers the listing pages, so the payload shape stays identical.
    const listing = await loadListing(id)
    if (listing) {
      return NextResponse.json(listing)
    }

    // Not a CRM listing: try the MLS API (skipped while MLS search is disabled;
    // the site then only serves properties added manually in the CRM)
    let mlsProperty = null
    let mlsMedia: string[] = []
    if (MLS_SEARCH_ENABLED) {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
      const parts = id.split('-')
      const lastPart = parts[parts.length - 1]
      const isSlugFormat = lastPart && lastPart.length === 8 && /^[0-9a-f]{8}$/i.test(lastPart)

      if (isSlugFormat) {
        // It's a slug format - search MLS by address
        const addressSlug = parts.slice(0, -1).join('-')
        const addressPattern = addressSlug.replace(/-/g, ' ')

        try {
          const mlsResults = await searchMLSProperties({
            q: addressPattern,
            limit: 50,
            transactionType: 'for_sale'
          })

          if (mlsResults && mlsResults.data) {
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

    if (!mlsProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    const media = mlsMedia.length > 0 ? mlsMedia : mlsProperty.heroImage ? [mlsProperty.heroImage] : []
    const property = {
      ...mlsProperty,
      images: [],
      floorPlans: [],
      floor_plans: [],
      mediaUrls: media,
      media_urls: media,
      hero_image: mlsProperty.heroImage || (mlsMedia.length > 0 ? mlsMedia[0] : null),
      youtube_video: mlsProperty.youtubeVideo,
      square_feet: mlsProperty.squareFeet || mlsProperty.livingArea,
      year_built: mlsProperty.yearBuilt,
      property_type: mlsProperty.propertyType,
      postal_code: mlsProperty.postalCode,
      listing_date: mlsProperty.listingDate instanceof Date
        ? mlsProperty.listingDate.toISOString()
        : mlsProperty.listingDate,
      created_at: mlsProperty.createdAt instanceof Date
        ? mlsProperty.createdAt.toISOString()
        : mlsProperty.createdAt,
      source: 'mls',
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
