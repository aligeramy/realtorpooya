import { NextRequest, NextResponse } from 'next/server';
import { ListingSearchService } from '@/lib/services/listing-search';
import { MediaService } from '@/lib/services/media-service';
import type { SearchFilters } from '@/types/listing';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract search filters from query parameters
    const filters: SearchFilters = {
      query: searchParams.get('q') || undefined,
      city: searchParams.get('city') || undefined,
      property_type: searchParams.get('property_type') || undefined,
      min_price: searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined,
      max_price: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
      min_bedrooms: searchParams.get('min_bedrooms') ? parseInt(searchParams.get('min_bedrooms')!) : undefined,
      max_bedrooms: searchParams.get('max_bedrooms') ? parseInt(searchParams.get('max_bedrooms')!) : undefined,
      min_bathrooms: searchParams.get('min_bathrooms') ? parseInt(searchParams.get('min_bathrooms')!) : undefined,
      max_bathrooms: searchParams.get('max_bathrooms') ? parseInt(searchParams.get('max_bathrooms')!) : undefined,
      min_area: searchParams.get('min_area') ? parseFloat(searchParams.get('min_area')!) : undefined,
      max_area: searchParams.get('max_area') ? parseFloat(searchParams.get('max_area')!) : undefined,
      sort_by: searchParams.get('sort_by') as any || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      page_size: searchParams.get('page_size') ? parseInt(searchParams.get('page_size')!) : 20,
    };

    // Perform search
    const searchResult = await ListingSearchService.search(filters);

    // Get media for all listings efficiently
    const listingIds = searchResult.listings.map(l => l.id);
    const mediaMap = await MediaService.getBatchListingMedia(listingIds);
    
    // Add primary image URL to each listing
    const listingsWithMedia = await Promise.all(
      searchResult.listings.map(async (listing) => {
        const media = mediaMap.get(listing.id) || [];
        const primaryMedia = media.find(m => m.is_preferred) || media[0];
        const primaryImageUrl = primaryMedia?.media_url || null;
        
        return {
          ...listing,
          primary_image_url: primaryImageUrl,
          total_images: media.filter(m => 
            m.media_type?.includes('image') || 
            m.media_type === 'Photo' || 
            m.media_category === 'Photo'
          ).length
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        ...searchResult,
        listings: listingsWithMedia
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to perform search',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 