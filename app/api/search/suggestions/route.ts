import { NextRequest, NextResponse } from 'next/server';
import { ListingSearchService } from '@/lib/services/listing-search';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: {
          suggestions: []
        }
      });
    }

    // Get suggestions
    const suggestions = await ListingSearchService.getSuggestions(query);

    return NextResponse.json({
      success: true,
      data: {
        suggestions
      }
    });

  } catch (error) {
    console.error('Suggestions API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get suggestions',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 