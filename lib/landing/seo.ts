import type { Metadata } from 'next'
import type { SiteDocument } from './types'

const SITE = 'https://realtorpooya.com'

export interface SeoProperty {
  address?: string
  cityProvince?: string
  beds?: string
  baths?: string
  sqft?: string
  images?: string[]
}

/** Build minimal SEO property facts from a raw properties row (no extra queries). */
export function seoPropertyFromRow(p: any): SeoProperty | null {
  if (!p) return null
  const img = p.heroImage || (Array.isArray(p.mediaUrls) && p.mediaUrls[0]) || undefined
  return {
    address: p.address || '',
    cityProvince: [p.city, p.province].filter(Boolean).join(', ').trim(),
    beds: p.bedrooms || '',
    baths: p.bathrooms != null ? String(p.bathrooms) : '',
    sqft: p.squareFeet != null ? String(p.squareFeet) : '',
    images: img ? [img] : [],
  }
}

export interface PageMetaInput {
  title: string
  slug: string
  customDomain?: string | null
  doc: SiteDocument | null
  property?: SeoProperty | null
}

/** Rich, consistent metadata for landing pages (path- and custom-domain-served). */
export function buildPageMetadata(input: PageMetaInput): Metadata {
  const seo = input.doc?.seo || {}
  const prop = input.property

  const title = seo.metaTitle || input.title || prop?.address || 'Property'

  let description = seo.metaDescription || ''
  if (!description && prop) {
    const facts: string[] = []
    if (prop.beds) facts.push(`${prop.beds} bed`)
    if (prop.baths) facts.push(`${prop.baths} bath`)
    if (prop.sqft) facts.push(`${prop.sqft} sq ft`)
    description = [[prop.address, prop.cityProvince].filter(Boolean).join(', '), facts.join(' · ')].filter(Boolean).join(' — ')
  }
  if (!description) description = `${title} — book a private tour.`

  const ogImage = seo.ogImage || prop?.images?.[0] || undefined
  const canonical = input.customDomain ? `https://${input.customDomain}` : `${SITE}/properties/${input.slug}`

  return {
    title,
    description,
    robots: seo.noindex ? { index: false, follow: false } : undefined,
    alternates: { canonical },
    openGraph: {
      title, description, url: canonical, siteName: 'Realtor Pooya', type: 'website',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description, images: ogImage ? [ogImage] : undefined },
  }
}
