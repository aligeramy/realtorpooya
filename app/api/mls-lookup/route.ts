import { NextRequest, NextResponse } from 'next/server'
import { ampAPI } from '@/lib/amp-api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mlsNumber = searchParams.get('mls')

    if (!mlsNumber) {
      return NextResponse.json(
        { error: 'MLS number is required' },
        { status: 400 }
      )
    }

    // Clean up MLS number (remove spaces, dashes, etc.)
    const cleanMlsNumber = mlsNumber.replace(/[\s-]/g, '')

    const property = await ampAPI.getPropertyByMLS(cleanMlsNumber)

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Convert to our internal format
    const convertedProperty = ampAPI.convertToInternalFormat(property)

    return NextResponse.json({
      success: true,
      property: convertedProperty,
      rawData: property // Include raw data for debugging
    })

  } catch (error) {
    console.error('MLS lookup error:', error)
    
    // Handle specific AMP API errors
    if (error instanceof Error) {
      if (error.message.includes('400')) {
        return NextResponse.json(
          { error: 'Invalid MLS number format or property not found' },
          { status: 400 }
        )
      }
      if (error.message.includes('401')) {
        return NextResponse.json(
          { error: 'Invalid API credentials' },
          { status: 401 }
        )
      }
      if (error.message.includes('403')) {
        return NextResponse.json(
          { error: 'Access denied to MLS data' },
          { status: 403 }
        )
      }
      if (error.message.includes('429')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to lookup MLS property' },
      { status: 500 }
    )
  }
} 