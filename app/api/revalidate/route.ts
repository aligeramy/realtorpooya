import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// Called by the CRM on publish/unpublish to refresh a landing page.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { slug, secret } = body || {}
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  if (slug) revalidatePath(`/properties/${slug}`)
  return NextResponse.json({ revalidated: true, slug })
}
