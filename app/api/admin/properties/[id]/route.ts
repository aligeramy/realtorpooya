import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single property
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

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}

// PUT update property
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      images,
      videos,
      features,
      tags,
      ...propertyData
    } = body

    // Start a transaction to update property and related data
    const property = await prisma.$transaction(async (tx) => {
      // Find hero image from the images array
      const heroImage = images?.find((img: any) => img.is_hero)
      const heroImageUrl = heroImage?.url || null

      // Update the main property
      const updatedProperty = await tx.property.update({
        where: { id },
        data: {
          ...propertyData,
          hero_image: heroImageUrl, // Sync hero_image field with actual hero image
          price: propertyData.price ? parseFloat(propertyData.price) : null,
          bedrooms: propertyData.bedrooms ? parseInt(propertyData.bedrooms) : null,
          bathrooms: propertyData.bathrooms ? parseFloat(propertyData.bathrooms) : null,
          square_feet: propertyData.square_feet ? parseInt(propertyData.square_feet) : null,
          year_built: propertyData.year_built ? parseInt(propertyData.year_built) : null,
        },
      })

      // Update images if provided
      if (images) {
        // Delete existing images
        await tx.propertyImage.deleteMany({
          where: { property_id: id }
        })
        
        // Create new images
        await tx.propertyImage.createMany({
          data: images.map((img: any, index: number) => ({
            property_id: id,
            url: img.url,
            alt_text: img.alt_text,
            caption: img.caption,
            order: index,
            is_hero: img.is_hero || false,
          }))
        })
      }

      // Update videos if provided
      if (videos) {
        await tx.propertyVideo.deleteMany({
          where: { property_id: id }
        })
        
        await tx.propertyVideo.createMany({
          data: videos.map((video: any, index: number) => ({
            property_id: id,
            url: video.url,
            title: video.title,
            description: video.description,
            order: index,
            video_type: video.video_type || 'UPLOAD',
          }))
        })
      }

      // Update features if provided
      if (features) {
        await tx.propertyFeature.deleteMany({
          where: { property_id: id }
        })
        
        await tx.propertyFeature.createMany({
          data: features.map((feature: string) => ({
            property_id: id,
            name: feature,
          }))
        })
      }

      // Update tags if provided
      if (tags) {
        await tx.propertyTag.deleteMany({
          where: { property_id: id }
        })
        
        await tx.propertyTag.createMany({
          data: tags.map((tag: string) => ({
            property_id: id,
            name: tag,
          }))
        })
      }

      return updatedProperty
    })

    // Fetch the updated property with all relations
    const fullProperty = await prisma.property.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        videos: { orderBy: { order: 'asc' } },
        features: true,
        tags: true,
      },
    })

    return NextResponse.json(fullProperty)
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

// DELETE property
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.property.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
} 