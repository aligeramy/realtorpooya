import { NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'
import { findPropertyBySlug } from '@/lib/utils'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    let property = null

    // First, try to find by ID (for backward compatibility)
    try {
      property = await prisma.property.findUnique({
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
        }
      })
    } catch (error) {
      // ID might not be a valid UUID, continue to slug search
    }

    // If not found by ID, try to find by address slug
    if (!property) {
      const allProperties = await prisma.property.findMany({
        include: {
          images: {
            orderBy: { order: 'asc' }
          },
          videos: {
            orderBy: { order: 'asc' }
          },
          features: true,
          tags: true,
        }
      })

      // Transform to match expected format for slug search
      const transformedProperties = allProperties.map(prop => ({
        ...prop,
        address: prop.address,
        property_type: prop.property_type?.toLowerCase(),
        status: prop.status.toLowerCase(),
        listing_date: prop.listing_date?.toISOString() || prop.createdAt.toISOString(),
        hero_image: prop.hero_image || prop.images.find((img) => img.is_hero)?.url || prop.images[0]?.url || "/placeholder.jpg",
        features: prop.features.map((feature) => feature.name),
        tags: prop.tags.map((tag) => tag.name),
      }))

      property = findPropertyBySlug(transformedProperties, id)
    }

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Transform data to match the expected format
    const transformedProperty = {
      id: property.id,
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
      hero_image: property.hero_image || property.images?.find(img => img.is_hero)?.url || property.images?.[0]?.url || "/placeholder.jpg",
      status: property.status?.toLowerCase() || property.status,
      listing_date: property.listing_date?.toISOString() || property.createdAt?.toISOString(),
      description: property.description,
      title: property.title,
      features: property.features?.map ? property.features.map(feature => feature.name) : property.features || [],
      tags: property.tags?.map ? property.tags.map(tag => tag.name) : property.tags || [],
      videos: property.videos || [],
      images: property.images || [],
      featured: property.featured,
      property_tax: property.property_tax,
      hoa_fees: property.hoa_fees,
      more: property.more,
      media_urls: property.images?.map ? property.images.map(img => img.url) : property.media_urls,
      youtube_video: property.youtube_video,
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
