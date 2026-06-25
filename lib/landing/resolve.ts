// ────────────────────────────────────────────────────────────────────────
// Resolve a property (+ per-page customData overrides) into the normalized
// shape that property-sourced blocks read. Portable (shared by both apps).
// ────────────────────────────────────────────────────────────────────────
import type { CustomData } from './types'

export interface ResolvedProperty {
  id?: string
  address: string
  cityProvince: string
  price: string
  beds: string
  baths: string
  sqft: string
  yearBuilt: string
  description: unknown
  images: string[]
  lat: number | null
  lng: number | null
  youtubeVideo: string
}

export interface RawProperty {
  id?: string
  address?: string | null
  city?: string | null
  province?: string | null
  price?: number | null
  bedrooms?: string | null
  bathrooms?: number | null
  squareFeet?: number | null
  yearBuilt?: number | null
  description?: unknown
  mediaUrls?: string[] | null
  heroImage?: string | null
  youtubeVideo?: string | null
  geo?: string | null
}

function money(n?: number | null): string {
  if (n == null || isNaN(Number(n))) return ''
  return '$' + Number(n).toLocaleString('en-US')
}

/** Parse "POINT(lng lat)" or "lat,lng" style geo strings. */
function parseGeo(geo?: string | null): { lat: number | null; lng: number | null } {
  if (!geo) return { lat: null, lng: null }
  const m = geo.match(/POINT\s*\(\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*\)/i)
  if (m) return { lat: parseFloat(m[2]), lng: parseFloat(m[1]) }
  const parts = geo.split(',').map((s) => parseFloat(s.trim()))
  if (parts.length === 2 && parts.every((n) => !isNaN(n))) return { lat: parts[0], lng: parts[1] }
  return { lat: null, lng: null }
}

export function resolveProperty(
  property?: RawProperty | null,
  images: string[] = [],
  customData?: CustomData | null,
): ResolvedProperty | null {
  if (!property && !customData) return null
  const c = customData || {}
  const geo = parseGeo(property?.geo)
  const imgs = Array.from(
    new Set([property?.heroImage || '', ...(property?.mediaUrls || []), ...images].filter(Boolean) as string[]),
  )
  return {
    id: property?.id,
    address: (c.address as string) || property?.address || '',
    cityProvince: [property?.city, property?.province].filter(Boolean).join(', '),
    price: (c.price as string) || money(property?.price),
    beds: (c.beds as string) || property?.bedrooms || '',
    baths: (c.baths as string) || (property?.bathrooms != null ? String(property?.bathrooms) : ''),
    sqft: (c.sqft as string) || (property?.squareFeet != null ? Number(property?.squareFeet).toLocaleString('en-US') : ''),
    yearBuilt: (c.yearBuilt as string) || (property?.yearBuilt != null ? String(property?.yearBuilt) : ''),
    description: property?.description,
    images: imgs,
    lat: geo.lat,
    lng: geo.lng,
    youtubeVideo: property?.youtubeVideo || '',
  }
}
