import { NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const featuredProperties = await prisma.property.findMany({
      where: {
        featured: true,
        status: 'FOR_SALE'
      },
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
      orderBy: {
        createdAt: 'desc'
      },
      take: 3,
    })

    // Transform data to match the expected format
    const transformedProperties = featuredProperties.map(property => ({
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
      hero_image: property.hero_image || property.images.find(img => img.is_hero)?.url || property.images[0]?.url || "/placeholder.jpg",
      status: property.status.toLowerCase(),
      listing_date: property.listing_date?.toISOString() || property.createdAt.toISOString(),
      description: property.description,
      title: property.title,
      features: property.features.map(feature => feature.name),
      tags: property.tags.map(tag => tag.name),
      videos: property.videos,
      images: property.images,
      featured: property.featured,
    }))

    return NextResponse.json(transformedProperties)
  } catch (error) {
    console.error('Error fetching featured properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured properties' },
      { status: 500 }
    )
  }
}
