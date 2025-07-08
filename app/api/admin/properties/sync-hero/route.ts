import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('🔄 Syncing hero images across all properties...')

    // Get all properties with their images
    const properties = await prisma.property.findMany({
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      }
    })

    let updatedCount = 0
    const updates = []

    for (const property of properties) {
      // Find the hero image from the images collection
      const heroImage = property.images.find(img => img.is_hero)
      const heroImageUrl = heroImage?.url || null

      // Only update if the hero_image field is different from the actual hero image
      if (property.hero_image !== heroImageUrl) {
        await prisma.property.update({
          where: { id: property.id },
          data: {
            hero_image: heroImageUrl
          }
        })

        updates.push({
          property: property.address,
          from: property.hero_image,
          to: heroImageUrl
        })
        updatedCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sync complete! Updated ${updatedCount} properties.`,
      updates
    })

  } catch (error) {
    console.error('Error syncing hero images:', error)
    return NextResponse.json(
      { error: 'Failed to sync hero images' },
      { status: 500 }
    )
  }
} 