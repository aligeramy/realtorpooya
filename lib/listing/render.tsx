import type { ReactNode } from 'react'

// Pure helpers shared by the branded listing page, the unbranded page and the
// property API. Nothing here touches the database or the browser.

export function getMatterportEmbedSrc(url: string | null | undefined): string | null {
  const trimmed = (url || '').trim()
  if (!trimmed) return null
  const match = trimmed.match(/[?&]m=([A-Za-z0-9]+)/)
  const modelId = match ? match[1] : /^[A-Za-z0-9]{8,}$/.test(trimmed) ? trimmed : null
  return modelId ? `https://my.matterport.com/show/?m=${modelId}` : null
}

export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined || price === '') return 'Price upon request'
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  if (!Number.isFinite(numPrice) || numPrice <= 0) return 'Price upon request'
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(numPrice)
}

const STATUS_LABELS: Record<string, string> = {
  sold: 'SOLD',
  active: 'For Sale',
  not_available: 'Not Available',
  coming_soon: 'Coming Soon',
  conditional: 'Conditional',
  leased: 'Leased',
}

const STATUS_CLASSES: Record<string, string> = {
  sold: 'bg-red-600 text-white',
  active: 'bg-[#473729] text-white',
  not_available: 'bg-gray-600 text-white',
  coming_soon: 'bg-blue-600 text-white',
  conditional: 'bg-yellow-600 text-white',
  leased: 'bg-green-600 text-white',
}

export function statusLabel(status: string | null | undefined): string {
  return (status && STATUS_LABELS[status]) || status || ''
}

export function statusBadgeClass(status: string | null | undefined): string {
  return (status && STATUS_CLASSES[status]) || 'bg-gray-500 text-white'
}

// ── Description (TipTap-style JSON document) ─────────────────────────────

type Mark = { type?: string }
type Node = { type?: string; text?: string; marks?: Mark[]; attrs?: { level?: number }; content?: Node[] }

function renderContent(content: Node[] | undefined, keyPrefix = 'n'): ReactNode {
  if (!Array.isArray(content)) return null
  return content.map((item, index) => {
    const key = `${keyPrefix}-${index}`
    if (item.type === 'paragraph') {
      return (
        <p key={key} className="text-gray-700 leading-relaxed mb-4">
          {renderContent(item.content, key)}
        </p>
      )
    }
    if (item.type === 'text' && item.text) {
      let el: ReactNode = item.text
      for (const mark of item.marks || []) {
        if (mark.type === 'bold') el = <strong key={`${key}-b`}>{el}</strong>
        else if (mark.type === 'italic') el = <em key={`${key}-i`}>{el}</em>
        else if (mark.type === 'underline') el = <u key={`${key}-u`}>{el}</u>
      }
      return <span key={key}>{el}</span>
    }
    if (item.type === 'heading') {
      const level = Math.min((item.attrs?.level || 1) + 2, 6)
      const Tag = `h${level}` as 'h3' | 'h4' | 'h5' | 'h6'
      return (
        <Tag key={key} className="font-tenor-sans text-xl text-gray-900 mb-3 mt-6">
          {renderContent(item.content, key)}
        </Tag>
      )
    }
    if (item.type === 'bulletList') {
      return (
        <ul key={key} className="list-disc list-inside text-gray-700 leading-relaxed mb-4 ml-4">
          {renderContent(item.content, key)}
        </ul>
      )
    }
    if (item.type === 'orderedList') {
      return (
        <ol key={key} className="list-decimal list-inside text-gray-700 leading-relaxed mb-4 ml-4">
          {renderContent(item.content, key)}
        </ol>
      )
    }
    if (item.type === 'listItem') {
      return (
        <li key={key} className="mb-1">
          {renderContent(item.content, key)}
        </li>
      )
    }
    if (item.type === 'hardBreak') return <br key={key} />
    if (item.content) return <span key={key}>{renderContent(item.content, key)}</span>
    return null
  })
}

export function renderDescriptionContent(description: unknown): ReactNode {
  if (!description) return null
  if (typeof description === 'string') {
    return <p className="text-gray-700 leading-relaxed whitespace-pre-line">{description}</p>
  }
  if (typeof description === 'object') {
    const doc = description as Node & { text?: string }
    if (doc.type === 'doc' && doc.content) return renderContent(doc.content)
    if (doc.text) return <p className="text-gray-700 leading-relaxed">{doc.text}</p>
  }
  return null
}

/** Plain text of the description, for meta descriptions and previews. */
export function descriptionToText(description: unknown): string {
  if (!description) return ''
  if (typeof description === 'string') return description.trim()
  const parts: string[] = []
  const walk = (node: Node | undefined) => {
    if (!node) return
    if (typeof node.text === 'string') parts.push(node.text)
    for (const child of node.content || []) walk(child)
    if (node.type === 'paragraph' || node.type === 'heading') parts.push(' ')
  }
  walk(description as Node)
  return parts.join('').replace(/\s+/g, ' ').trim()
}

// ── Features ─────────────────────────────────────────────────────────────

function pushStringOrJsonList(out: string[], value: unknown) {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          out.push(...parsed.filter((f: unknown): f is string => typeof f === 'string'))
          return
        }
      } catch {
        /* treat as a plain feature below */
      }
    }
    out.push(trimmed)
  } else if (Array.isArray(value)) {
    out.push(...value.filter((f: unknown): f is string => typeof f === 'string'))
  }
}

const NON_FEATURE_KEYS = new Set(['tps', 'total_parking_space', 'parking_space', 'id', 'created_at', 'updated_at'])

/** Flatten the `features` JSON plus any list-like entries in `more` into one list. */
export function extractFeatures(listing: { features?: unknown; more?: unknown }): string[] {
  const features: string[] = []
  const raw = listing.features
  if (Array.isArray(raw)) {
    for (const item of raw) pushStringOrJsonList(features, item)
  } else if (raw && typeof raw === 'object') {
    for (const value of Object.values(raw as Record<string, unknown>)) pushStringOrJsonList(features, value)
  } else if (typeof raw === 'string') {
    pushStringOrJsonList(features, raw)
  }

  if (listing.more && typeof listing.more === 'object') {
    for (const [key, value] of Object.entries(listing.more as Record<string, unknown>)) {
      if (NON_FEATURE_KEYS.has(key.toLowerCase())) continue
      if (value) pushStringOrJsonList(features, value)
    }
  }

  return features.map((f) => f.trim()).filter(Boolean)
}

export function totalParkingSpaces(listing: { more?: unknown }): string | null {
  const more = listing.more
  if (!more || typeof more !== 'object') return null
  const tps = (more as Record<string, unknown>).tps
  return tps === undefined || tps === null || tps === '' ? null : String(tps)
}
