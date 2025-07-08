import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all properties
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')

    const where: any = {}
    
    if (featured === 'true') {
      where.featured = true
    }
    
    if (status) {
      where.status = status
    }

    const properties = await prisma.property.findMany({
      where,
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
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

// POST new property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      address,
      city,
      province,
      postal_code,
      property_type,
      price,
      bedrooms,
      bathrooms,
      square_feet,
      year_built,
      description,
      status,
      featured,
      hero_image,
      youtube_video,
      images,
      videos,
      features,
      tags,
      ...otherData
    } = body

    // Find hero image from the images array
    const heroImage = images?.find((img: any) => img.is_hero)
    const heroImageUrl = heroImage?.url || hero_image || null

    // Create the property with all related data
    const property = await prisma.property.create({
      data: {
        title,
        address,
        city,
        province,
        postal_code,
        property_type,
        price: price ? parseFloat(price) : null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseFloat(bathrooms) : null,
        square_feet: square_feet ? parseInt(square_feet) : null,
        year_built: year_built ? parseInt(year_built) : null,
        description,
        status: status || 'FOR_SALE',
        featured: featured || false,
        hero_image: heroImageUrl, // Sync hero_image field with actual hero image
        youtube_video,
        listing_date: new Date(),
        more: otherData,
        
        // Create related images
        images: images ? {
          create: images.map((img: any, index: number) => ({
            url: img.url,
            alt_text: img.alt_text,
            caption: img.caption,
            order: index,
            is_hero: img.is_hero || false,
          }))
        } : undefined,
        
        // Create related videos
        videos: videos ? {
          create: videos.map((video: any, index: number) => ({
            url: video.url,
            title: video.title,
            description: video.description,
            order: index,
            video_type: video.video_type || 'UPLOAD',
          }))
        } : undefined,
        
        // Create features
        features: features ? {
          create: features.map((feature: string) => ({
            name: feature,
          }))
        } : undefined,
        
        // Create tags
        tags: tags ? {
          create: tags.map((tag: string) => ({
            name: tag,
          }))
        } : undefined,
      },
      include: {
        images: true,
        videos: true,
        features: true,
        tags: true,
      },
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
} 