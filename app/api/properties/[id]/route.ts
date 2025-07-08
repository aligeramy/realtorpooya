import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        videos: {
          orderBy: { order: 'asc' }
        },
        features: true,
        tags: true,
      },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Transform data to match the expected format
    const transformedProperty = {
      id: property.id,
      title: property.title,
      address: property.address,
      city: property.city,
      province: property.province,
      postal_code: property.postal_code,
      property_type: property.property_type?.toLowerCase(),
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      square_feet: property.square_feet,
      lot_dimensions: property.lot_dimensions,
      year_built: property.year_built,
      status: property.status.toLowerCase(),
      hero_image: property.hero_image || property.images.find(img => img.is_hero)?.url || property.images[0]?.url || "/placeholder.jpg",
      images: property.images,
      description: property.description,
      features: property.features.map(feature => feature.name),
      mls_id: property.mls_id,
      listing_date: property.listing_date?.toISOString() || property.createdAt.toISOString(),
      agent_owner_id: property.agent_owner_id,
      tags: property.tags.map(tag => tag.name),
      videos: property.videos,
      youtube_video: property.youtube_video,
      property_tax: property.property_tax,
      hoa_fees: property.hoa_fees,
      featured: property.featured,
      media_urls: property.images.map(img => img.url),
      more: property.more || {},
    }

    return NextResponse.json(transformedProperty)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}
