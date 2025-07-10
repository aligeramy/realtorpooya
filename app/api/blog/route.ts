import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { blog_posts } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  try {
    const posts = await db
      .select()
      .from(blog_posts)
      .where(eq(blog_posts.published, true))
      .orderBy(desc(blog_posts.published_at))

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
} 