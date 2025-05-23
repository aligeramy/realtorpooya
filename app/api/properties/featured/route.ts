import { NextRequest, NextResponse } from 'next/server';
import { ListingSearchService } from '@/lib/services/listing-search';
import { MediaService } from '@/lib/services/media-service';

export async function GET(request: NextRequest) {
  try {
    // Get featured listings from the database
    const featuredListings = await ListingSearchService.getFeaturedListings(3);
    
    // Get media for all listings
    const listingIds = featuredListings.map(l => l.id);
    const mediaMap = await MediaService.getBatchListingMedia(listingIds);
    
    // Transform to match Property type and add media
    const properties = featuredListings.map(listing => {
      const media = mediaMap.get(listing.id) || [];
      const primaryMedia = media.find(m => m.is_preferred) || media[0];
      const primaryImageUrl = primaryMedia?.media_url || '/placeholder.jpg';
      
      return {
        id: listing.id,
        address: `${listing.street_number} ${listing.street_name} ${listing.street_suffix || ''}`.trim(),
        city: listing.city,
        province: listing.province,
        postal_code: listing.postal_code,
        property_type: listing.property_type?.toLowerCase() || 'house',
        price: parseFloat(listing.list_price?.toString() || '0'),
        bedrooms: listing.bedrooms_total || 0,
        bathrooms: listing.bathrooms_total || 0,
        square_feet: listing.living_area || 0,
        hero_image: primaryImageUrl,
        status: 'for_sale',
        listing_date: listing.list_date || new Date().toISOString(),
        description: listing.public_remarks || '',
        media_urls: media
          .filter(m => m.media_type?.includes('image') || m.media_type === 'Photo')
          .map(m => m.media_url)
          .filter(Boolean)
      };
    });

    return NextResponse.json({
      success: true,
      data: properties
    });
  } catch (error) {
    console.error('Featured properties error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch featured properties' 
      },
      { status: 500 }
    );
  }
}
