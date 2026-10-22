import { cache } from 'react'
import { and, eq, ne, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { properties, propertyImages } from '@/lib/db/schema'
import { findPropertyBySlug } from '@/lib/utils'
import type { Property, PropertyImage } from '@/lib/db/schema'

export type FloorPlanItem = { url: string; label?: string; kind: 'image' | 'pdf' }

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const SUFFIX_RE = /^[0-9a-f]{8}$/i

function isHttpsUrl(url: string): boolean {
  try {
    return new URL(url).protocol === 'https:'
  } catch {
    return false
  }
}

/** Accepts the stored JSON (array of strings or {url,label,kind}) and returns clean items; only https URLs survive since they are rendered into href/src. */
export function normalizeFloorPlans(raw: unknown): FloorPlanItem[] {
  if (!Array.isArray(raw)) return []
  const items: FloorPlanItem[] = []
  for (const entry of raw) {
    const url = typeof entry === 'string' ? entry : entry && typeof entry.url === 'string' ? entry.url : ''
    if (!url || !isHttpsUrl(url)) continue
    const label = typeof entry === 'object' && entry && typeof entry.label === 'string' ? entry.label.trim() : ''
    const explicit = typeof entry === 'object' && entry ? entry.kind : undefined
    const kind: FloorPlanItem['kind'] =
      explicit === 'pdf' || (!explicit && /\.pdf(\?|#|$)/i.test(url)) ? 'pdf' : 'image'
    items.push(label ? { url, label, kind } : { url, kind })
  }
  return items
}

/**
 * Resolve a listing by UUID or by its public slug ("23-hollywood-ave-507209fa").
 * The slug suffix is the last 8 characters of the UUID, so it is looked up
 * directly instead of loading every listing and matching in memory.
 */
export async function findPropertyRow(idOrSlug: string): Promise<Property | null> {
  const key = (idOrSlug || '').trim()
  if (!key) return null

  if (UUID_RE.test(key)) {
    const [row] = await db.select().from(properties).where(eq(properties.id, key)).limit(1)
    return row ?? null
  }

  const parts = key.split('-')
  const suffix = parts[parts.length - 1]
  if (parts.length > 1 && SUFFIX_RE.test(suffix)) {
    const rows = await db
      .select()
      .from(properties)
      .where(and(ne(properties.status, 'archived'), sql`right(${properties.id}::text, 8) = ${suffix.toLowerCase()}`))
    if (rows.length === 1) return rows[0]
    if (rows.length > 1) {
      const hit = findPropertyBySlug(rows, key)
      if (hit) return hit
    }
  }

  // Legacy address-only slugs: match against every live listing.
  const all = await db.select().from(properties).where(ne(properties.status, 'archived'))
  return findPropertyBySlug(all, key) ?? null
}

function iso(value: unknown): string | null {
  if (!value) return null
  if (value instanceof Date) return value.toISOString()
  return String(value)
}

/** The shape both listing pages and /api/properties/[id] hand to the UI. */
export function shapeListing(row: Property, images: PropertyImage[]) {
  const mediaUrls = row.mediaUrls ?? []
  const floorPlans = normalizeFloorPlans(row.floorPlans)
  return {
    ...row,
    listingDate: iso(row.listingDate),
    offerDate: iso(row.offerDate),
    closingDate: iso(row.closingDate),
    createdAt: iso(row.createdAt),
    images: images.map((img) => ({ ...img, createdAt: iso(img.createdAt) })),
    floorPlans,
    mediaUrls,
    // snake_case aliases kept for components written against the old API payload
    media_urls: mediaUrls,
    floor_plans: floorPlans,
    hero_image: row.heroImage ?? null,
    youtube_video: row.youtubeVideo ?? null,
    matterport_url: row.matterportUrl ?? null,
    square_feet: row.squareFeet ?? null,
    year_built: row.yearBuilt ?? null,
    property_type: row.propertyType,
    postal_code: row.postalCode,
    listing_date: iso(row.listingDate),
    created_at: iso(row.createdAt),
    source: 'custom' as const,
  }
}

export type Listing = ReturnType<typeof shapeListing>

/** Cached per request so generateMetadata and the page share one lookup. */
export const loadListing = cache(async (idOrSlug: string): Promise<Listing | null> => {
  const row = await findPropertyRow(idOrSlug)
  if (!row) return null
  const images = await db
    .select()
    .from(propertyImages)
    .where(eq(propertyImages.propertyId, row.id))
    .orderBy(propertyImages.displayOrder)
  return shapeListing(row, images)
})

/** Gallery order: uploaded gallery first, else the hero image alone. */
export function listingGalleryImages(listing: Listing): string[] {
  if (listing.mediaUrls.length) return listing.mediaUrls
  return listing.heroImage ? [listing.heroImage] : []
}
