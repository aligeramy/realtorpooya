// ────────────────────────────────────────────────────────────────────────
// Landing-page auto-reply email: defaults, merge tags, sanitizer, renderer.
//
// Framework-agnostic (no React, no env access, no DB). Mirrored verbatim into
// website/realtorpooya/lib/landing/auto-reply.ts — the CRM uses it for the
// editor preview + test sends, the public site uses it to send the real email
// from /api/landing-lead. Keep both copies identical.
// ────────────────────────────────────────────────────────────────────────
import type { AutoReplyConfig } from './types'

export const AUTO_REPLY_MERGE_TAGS = [
  { tag: 'firstName', label: 'First name', sample: 'Sarah' },
  { tag: 'lastName', label: 'Last name', sample: 'Chen' },
  { tag: 'fullName', label: 'Full name', sample: 'Sarah Chen' },
  { tag: 'email', label: 'Email', sample: 'sarah@example.com' },
  { tag: 'phone', label: 'Phone', sample: '416-555-0199' },
  { tag: 'priceRange', label: 'Price range', sample: '$5M-$7M' },
  { tag: 'role', label: 'Buyer / Realtor', sample: 'Buyer' },
  { tag: 'pageTitle', label: 'Page title', sample: 'The Bedford' },
  { tag: 'pageUrl', label: 'Page link', sample: 'https://realtorpooya.com/properties/thebedford' },
  { tag: 'propertyAddress', label: 'Property address', sample: '55 Bedford Rd, Toronto' },
  { tag: 'propertyPrice', label: 'Property price', sample: '$5,250,000' },
] as const

export type AutoReplyMergeTag = (typeof AUTO_REPLY_MERGE_TAGS)[number]['tag']
export type AutoReplyVars = Partial<Record<AutoReplyMergeTag, string | null | undefined>>

/** Sample values used by the CRM preview and test sends. */
export function sampleAutoReplyVars(overrides: AutoReplyVars = {}): AutoReplyVars {
  const vars: AutoReplyVars = {}
  for (const t of AUTO_REPLY_MERGE_TAGS) vars[t.tag] = t.sample
  for (const [k, v] of Object.entries(overrides)) if (v) (vars as Record<string, string>)[k] = v
  return vars
}

export const DEFAULT_AUTO_REPLY: Required<Pick<AutoReplyConfig, 'enabled' | 'subject' | 'headline' | 'bodyHtml' | 'showContactBox'>> = {
  enabled: true,
  subject: 'Thank you for registering — {{pageTitle}}',
  headline: 'Thank You for Registering!',
  bodyHtml:
    '<p>Dear {{firstName}},</p>' +
    '<p>Thank you for your interest in {{pageTitle}}. Your registration has been received — Pooya will personally reach out shortly with floor plans, pricing, and to help arrange your private tour.</p>',
  showContactBox: true,
}

export type ResolvedAutoReply = AutoReplyConfig & typeof DEFAULT_AUTO_REPLY

/** Fill in defaults for anything the page has not customized. */
export function resolveAutoReply(cfg?: AutoReplyConfig | null): ResolvedAutoReply {
  const c = cfg || {}
  const str = (v: unknown, d: string) => (typeof v === 'string' && v.trim() ? v : d)
  return {
    ...c,
    enabled: c.enabled !== false,
    subject: str(c.subject, DEFAULT_AUTO_REPLY.subject),
    headline: str(c.headline, DEFAULT_AUTO_REPLY.headline),
    bodyHtml: str(c.bodyHtml, DEFAULT_AUTO_REPLY.bodyHtml),
    showContactBox: c.showContactBox !== false,
  }
}

export function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (ch) =>
    ch === '&' ? '&amp;' : ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch === '"' ? '&quot;' : '&#39;',
  )
}

export function isSafeHttpUrl(u: unknown): u is string {
  if (typeof u !== 'string') return false
  try {
    const url = new URL(u.trim())
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export function isEmailAddress(u: unknown): u is string {
  return typeof u === 'string' && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(u.trim())
}

const TAG_TOKEN_RE = /\{\{\s*([a-zA-Z][a-zA-Z0-9]*)\s*\}\}/g

/**
 * Replace {{tag}} tokens. In `html` mode the substituted values are escaped so
 * a registrant cannot inject markup through their own name.
 */
export function applyMergeTags(template: string, vars: AutoReplyVars, mode: 'text' | 'html' = 'text'): string {
  if (!template) return ''
  return template.replace(TAG_TOKEN_RE, (_m, tag: string) => {
    const v = (vars as Record<string, string | null | undefined>)[tag]
    const out = v == null ? '' : String(v)
    return mode === 'html' ? escapeHtml(out) : out
  })
}

// ── Sanitizer ──────────────────────────────────────────────────────────────
// Pure-JS allow-list sanitizer for the agent-authored body (same approach as the
// CRM broadcast sanitizer; no jsdom so it runs anywhere). The editor only emits
// a small set of tags, so unknown tags are dropped outright.

const ALLOWED_TAGS = new Set([
  'p', 'br', 'hr', 'div', 'span',
  'strong', 'em', 'b', 'i', 'u', 's',
  'ul', 'ol', 'li',
  'a', 'img',
  'h1', 'h2', 'h3', 'h4',
  'blockquote',
  'table', 'thead', 'tbody', 'tr', 'td', 'th',
])
const ALLOWED_ATTRS = new Set(['href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height', 'style', 'colspan', 'rowspan', 'align'])
const BLOCK_TAG_RE = /<\s*(script|style|iframe|object|embed|form|svg|math)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi
const SELF_CLOSING_BLOCK_RE = /<\s*(script|style|iframe|object|embed|form|svg|math)\b[^>]*\/?>/gi
const TAG_RE = /<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9]*)\s*([^>]*)>/g
const ATTR_RE = /([a-zA-Z_:][a-zA-Z0-9_:.-]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g
const COMMENT_RE = /<!--[\s\S]*?-->/g

function safeLinkValue(name: string, value: string): string | null {
  const v = value.trim()
  if (name === 'href') {
    if (/^(https?:|mailto:|tel:)/i.test(v) || v.startsWith('#')) return v
    return null
  }
  if (name === 'src') return /^https?:/i.test(v) ? v : null
  return v
}

function sanitizeAttributes(rawAttrs: string): string {
  const out: string[] = []
  for (const m of rawAttrs.matchAll(ATTR_RE)) {
    const name = m[1].toLowerCase()
    const raw = m[2] ?? m[3] ?? m[4] ?? ''
    if (!ALLOWED_ATTRS.has(name) || name.startsWith('on')) continue
    let value: string | null = raw
    if (name === 'href' || name === 'src') value = safeLinkValue(name, raw)
    if (name === 'style' && (/javascript:|expression\s*\(|url\s*\(/i.test(raw))) value = null
    if (value == null) continue
    out.push(value === '' ? name : `${name}="${value.replace(/"/g, '&quot;')}"`)
  }
  return out.length ? ' ' + out.join(' ') : ''
}

export function sanitizeEmailHtml(html: string): string {
  if (!html) return ''
  let cleaned = html.replace(COMMENT_RE, '')
  cleaned = cleaned.replace(BLOCK_TAG_RE, '').replace(SELF_CLOSING_BLOCK_RE, '')
  cleaned = cleaned.replace(TAG_RE, (_, slash: string, name: string, attrs: string) => {
    const tag = name.toLowerCase()
    if (!ALLOWED_TAGS.has(tag)) return ''
    if (slash === '/') return `</${tag}>`
    const extra = tag === 'a' ? ' target="_blank" rel="noopener noreferrer"' : ''
    return `<${tag}${sanitizeAttributes(attrs.replace(/\b(target|rel)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, ''))}${extra}>`
  })
  return cleaned
}

// ── Renderer ───────────────────────────────────────────────────────────────

export interface EmailBrand {
  primaryColor: string
  accentColor: string
  logoUrl: string
  agentName: string
  agentTitle: string
  agentPhotoUrl: string
  phone: string
  email: string
}

export const DEFAULT_EMAIL_BRAND: EmailBrand = {
  primaryColor: '#473729',
  accentColor: '#aa9578',
  logoUrl: 'https://realtorpooya.ca/icon.png',
  agentName: 'Pooya Pirayeshakbari',
  agentTitle: 'Luxury Real Estate Specialist',
  agentPhotoUrl: 'https://realtorpooya.ca/images/agent-pooya.jpg',
  phone: '416-553-7707',
  email: 'sold@realtorpooya.ca',
}

/** Branded wrapper shared by the registrant confirmation and the lead alert. */
export function renderEmailShell(inner: string, brand: EmailBrand = DEFAULT_EMAIL_BRAND, title = ''): string {
  const b = brand
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/>${title ? `<title>${escapeHtml(title)}</title>` : ''}
  <style>.lp-body p{margin:0 0 16px}.lp-body p:last-child{margin-bottom:0}.lp-body h1,.lp-body h2,.lp-body h3,.lp-body h4{margin:0 0 12px;line-height:1.3}.lp-body ul,.lp-body ol{margin:0 0 16px;padding-left:22px}.lp-body a{color:${b.primaryColor}}.lp-body img{max-width:100%;height:auto}</style></head>
  <body style="margin:0;padding:0;background:#f9f6f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;color:${b.primaryColor};line-height:1.6;">
    <div style="max-width:600px;margin:0 auto;background:#fff;">
      <div style="background:linear-gradient(135deg,${b.accentColor} 0%,#8a7a63 100%);padding:32px;text-align:center;">
        <img src="${escapeHtml(b.logoUrl)}" alt="${escapeHtml(b.agentName)}" style="max-height:46px;height:auto;"/>
      </div>
      ${inner}
      <div style="background:${b.primaryColor};color:#fff;padding:28px;text-align:center;">
        <img src="${escapeHtml(b.agentPhotoUrl)}" alt="${escapeHtml(b.agentName)}" style="width:70px;height:70px;border-radius:50%;object-fit:cover;margin-bottom:12px;"/>
        <div style="font-weight:600;font-size:17px;">${escapeHtml(b.agentName)}</div>
        <div style="color:rgba(255,255,255,.85);font-size:13px;">${escapeHtml(b.agentTitle)}</div>
        <div style="color:rgba(255,255,255,.8);font-size:13px;margin-top:6px;">${escapeHtml(b.phone)} · ${escapeHtml(b.email)}</div>
      </div>
    </div>
  </body></html>`
}

export interface RenderedAutoReply {
  subject: string
  html: string
  text: string
}

/**
 * Render the registrant confirmation for a page: merge tags applied to the
 * subject/headline (escaped) and to the sanitized body; optional CTA button and
 * the "Need to reach us sooner?" contact box.
 */
export function renderAutoReplyEmail(
  cfg: AutoReplyConfig | null | undefined,
  vars: AutoReplyVars,
  brand: EmailBrand = DEFAULT_EMAIL_BRAND,
): RenderedAutoReply {
  const c = resolveAutoReply(cfg)
  const subject = applyMergeTags(c.subject, vars, 'text').replace(/\s+/g, ' ').trim() || applyMergeTags(DEFAULT_AUTO_REPLY.subject, vars)
  const headline = applyMergeTags(c.headline, vars, 'html')
  const body = applyMergeTags(sanitizeEmailHtml(c.bodyHtml), vars, 'html')

  const buttonLabel = (c.buttonLabel || '').trim()
  const buttonUrl = applyMergeTags((c.buttonUrl || '').trim(), vars, 'text')
  const button = buttonLabel && isSafeHttpUrl(buttonUrl)
    ? `<div style="text-align:center;margin:8px 0 24px;">
        <a href="${escapeHtml(buttonUrl)}" style="display:inline-block;background:${brand.accentColor};color:#1a1410;text-decoration:none;font-weight:600;letter-spacing:.06em;text-transform:uppercase;font-size:13px;padding:14px 28px;border-radius:6px;">${escapeHtml(buttonLabel)}</a>
      </div>`
    : ''

  const contactBox = c.showContactBox
    ? `<div style="background:#f3ecdf;border-radius:12px;padding:22px;text-align:center;">
        <p style="color:${brand.accentColor};font-weight:600;margin:0 0 8px;font-size:15px;">Need to reach us sooner?</p>
        <p style="margin:0;color:${brand.primaryColor};font-size:15px;">Call or text <b>${escapeHtml(brand.phone)}</b><br/>Email <b>${escapeHtml(brand.email)}</b></p>
      </div>`
    : ''

  const inner = `
    <div style="padding:36px 32px;">
      ${headline ? `<h1 style="font-size:24px;text-align:center;margin:0 0 18px;">${headline}</h1>` : ''}
      <div class="lp-body" style="font-size:15px;margin:0 0 18px;">${body}</div>
      ${button}
      ${contactBox}
    </div>`

  const text = htmlToText(`${headline}\n\n${body}${buttonLabel && isSafeHttpUrl(buttonUrl) ? `\n\n${buttonLabel}: ${buttonUrl}` : ''}${c.showContactBox ? `\n\nNeed to reach us sooner? Call or text ${brand.phone} or email ${brand.email}` : ''}`)

  return { subject, html: renderEmailShell(inner, brand, subject), text }
}

/** Very small HTML → plain-text conversion for the text/plain alternative. */
export function htmlToText(html: string): string {
  return html
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|tr|blockquote)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
