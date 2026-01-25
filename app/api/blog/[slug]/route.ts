import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { blog_posts } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const [post] = await db
      .select()
      .from(blog_posts)
      .where(and(
        eq(blog_posts.slug, slug),
        eq(blog_posts.published, true)
      ))

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
} 