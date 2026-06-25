import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { landingPages, properties, propertyImages, agents } from '@/lib/db/schema'
import { SiteRenderer } from '@/components/landing/SiteRenderer'
import { resolveProperty } from '@/lib/landing/resolve'
import type { SiteDocument } from '@/lib/landing/types'

export const dynamic = 'force-dynamic'

type Params = { slug: string }
type Search = { [k: string]: string | string[] | undefined }

async function loadPage(slug: string) {
  const page = await db.query.landingPages.findFirst({ where: eq(landingPages.slug, slug) })
  return page || null
}

function pickDocument(page: any, preview: boolean): SiteDocument | null {
  if (preview) return (page.draftDocument as SiteDocument) || null
  if (page.status !== 'published') return null
  return ((page.publishedDocument || page.draftDocument) as SiteDocument) || null
}

function isPreview(search: Search): boolean {
  const token = typeof search.preview === 'string' ? search.preview : ''
  if (!token) return false
  return token === process.env.REVALIDATE_SECRET || token === process.env.LANDING_PREVIEW_TOKEN
}

export async function generateMetadata(
  { params, searchParams }: { params: Promise<Params>; searchParams: Promise<Search> },
): Promise<Metadata> {
  const { slug } = await params
  const search = await searchParams
  const page = await loadPage(slug)
  if (!page) return { title: 'Not found' }
  const doc = pickDocument(page, isPreview(search))
  const seo = doc?.seo || {}
  const title = seo.metaTitle || page.title
  const description = seo.metaDescription || ''
  const ogImage = seo.ogImage
  return {
    title,
    description,
    robots: seo.noindex ? { index: false, follow: false } : undefined,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: 'website',
    },
  }
}

export default async function PropertyLandingPage(
  { params, searchParams }: { params: Promise<Params>; searchParams: Promise<Search> },
) {
  const { slug } = await params
  const search = await searchParams
  const preview = isPreview(search)

  const page = await loadPage(slug)
  if (!page) notFound()

  const doc = pickDocument(page, preview)
  if (!doc) notFound()

  // Resolve linked property + images + agent for property-sourced blocks.
  let resolved = null
  let agentInfo = null
  if (page.propertyId) {
    const property = await db.query.properties.findFirst({ where: eq(properties.id, page.propertyId) })
    const imgs = await db
      .select({ url: propertyImages.url, displayOrder: propertyImages.displayOrder })
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, page.propertyId))
    const ordered = imgs.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)).map((i) => i.url)
    resolved = resolveProperty(property as any, ordered, doc.customData)
    if (property?.agentOwnerId) {
      const a = await db.query.agents.findFirst({ where: eq(agents.id, property.agentOwnerId) })
      if (a) agentInfo = { id: a.id, name: a.name, title: a.title || undefined, phone: a.phone || undefined, email: a.email, photoUrl: a.photoUrl || undefined, bio: a.bio || undefined }
    }
  } else {
    resolved = resolveProperty(null, [], doc.customData)
  }

  return (
    <>
      {preview && page.status !== 'published' && (
        <div style={{ position: 'fixed', bottom: 16, left: 16, zIndex: 99999, background: '#111', color: '#fff', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui' }}>
          Draft preview — not published
        </div>
      )}
      <SiteRenderer
        document={doc}
        property={resolved}
        agent={agentInfo}
        apiBase=""
        pageSlug={page.slug}
        pageTitle={page.title}
      />
    </>
  )
}
