import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true
      },
      orderBy: {
        publishedAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        author: true,
        publishedAt: true,
        hero_image: true,
        createdAt: true
      }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
} 