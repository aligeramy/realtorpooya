import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { landingPages, properties, propertyImages, agents } from '@/lib/db/schema'
import { SiteRenderer } from '@/components/landing/SiteRenderer'
import { resolveProperty } from '@/lib/landing/resolve'
import type { SiteDocument } from '@/lib/landing/types'

export const dynamic = 'force-dynamic'

async function hostDomain(): Promise<string> {
  const h = await headers()
  return (h.get('host') || '').split(':')[0].toLowerCase().replace(/^www\./, '')
}

async function loadByDomain(domain: string) {
  if (!domain) return null
  const page = await db.query.landingPages.findFirst({ where: eq(landingPages.customDomain, domain) })
  return page || null
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await loadByDomain(await hostDomain())
  if (!page || page.status !== 'published') return { title: 'Not found' }
  const doc = (page.publishedDocument || page.draftDocument) as SiteDocument | null
  const seo = doc?.seo || {}
  return {
    title: seo.metaTitle || page.title,
    description: seo.metaDescription || '',
    robots: seo.noindex ? { index: false, follow: false } : undefined,
    openGraph: { title: seo.metaTitle || page.title, description: seo.metaDescription || '', images: seo.ogImage ? [{ url: seo.ogImage }] : undefined, type: 'website' },
  }
}

export default async function CustomDomainPage() {
  const page = await loadByDomain(await hostDomain())
  if (!page || page.status !== 'published') notFound()
  const doc = (page.publishedDocument || page.draftDocument) as SiteDocument | null
  if (!doc) notFound()

  let resolved = null
  let agentInfo = null
  if (page.propertyId) {
    const property = await db.query.properties.findFirst({ where: eq(properties.id, page.propertyId) })
    const imgs = await db.select({ url: propertyImages.url, displayOrder: propertyImages.displayOrder }).from(propertyImages).where(eq(propertyImages.propertyId, page.propertyId))
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
    <SiteRenderer document={doc} property={resolved} agent={agentInfo} apiBase="" pageSlug={page.slug} pageTitle={page.title} />
  )
}
