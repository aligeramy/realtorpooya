import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { clients, clientProperties, tasks, landingPages, properties } from '@/lib/db/schema'
import type { SiteDocument } from '@/lib/landing/types'
import {
  renderEmailShell, renderAutoReplyEmail, resolveAutoReply, isEmailAddress, escapeHtml,
  DEFAULT_EMAIL_BRAND, type AutoReplyVars,
} from '@/lib/landing/auto-reply'

export const dynamic = 'force-dynamic'

const SITE_BASE = 'https://realtorpooya.com'
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function row(label: string, value: string): string {
  const b = DEFAULT_EMAIL_BRAND
  return `<tr><td style="padding:6px 0;color:${b.accentColor};font-weight:600;width:130px;vertical-align:top;">${label}</td><td style="padding:6px 0;color:${b.primaryColor};">${escapeHtml(value)}</td></tr>`
}

function adminEmailHTML(d: { fullName: string; email: string; phone: string; priceRange: string; role: string; page: string }): string {
  const b = DEFAULT_EMAIL_BRAND
  return renderEmailShell(`
    <div style="padding:36px 32px;">
      <h1 style="font-size:24px;text-align:center;margin:0 0 8px;">New Registration</h1>
      <p style="text-align:center;color:${b.accentColor};margin:0 0 24px;font-size:14px;">A new lead registered from a property page.</p>
      <div style="background:#f3ecdf;border-radius:12px;padding:22px;">
        <table style="width:100%;border-collapse:collapse;font-size:15px;">
          ${row('Name', d.fullName)}
          ${row('Email', d.email)}
          ${row('Phone', d.phone || '—')}
          ${row('Price Range', d.priceRange || '—')}
          ${row('Buyer / Realtor', d.role || '—')}
          ${row('Page', d.page || '—')}
        </table>
      </div>
    </div>`, b, `New registration: ${d.fullName}`)
}

// Lead capture for landing-page "Register Here" forms. Writes a lead into the
// shared CRM `clients` table (deduped by email), links the property, emails the
// lead alert to the page's configured address AND sends the registrant the
// page's own confirmation email (Page Settings → Email in the CRM editor).
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      firstName = '', lastName = '', email: rawEmail, phone = '',
      priceRange = '', role = '', propertyId: rawPropertyId = null,
      pageSlug = '', pageTitle = '', source = 'register',
    } = body || {}

    const email = typeof rawEmail === 'string' ? rawEmail.trim() : ''
    if (!isEmailAddress(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
    }
    const fullName = `${firstName} ${lastName}`.trim() || firstName || 'Website Lead'
    const emailLower = email.toLowerCase()

    // === Page config: which email to send, and where lead alerts go ===
    const pageRow = typeof pageSlug === 'string' && pageSlug
      ? await db.query.landingPages.findFirst({
          where: eq(landingPages.slug, pageSlug),
          columns: { id: true, slug: true, title: true, customDomain: true, propertyId: true, publishedDocument: true, draftDocument: true },
        }).catch((err) => { console.error('landing-lead page lookup failed:', err); return null })
      : null
    const doc = ((pageRow?.publishedDocument ?? pageRow?.draftDocument) as SiteDocument | null) || null
    const autoReply = resolveAutoReply(doc?.autoReply)
    const configuredAlert = doc?.registration?.recipientEmail
    const alertTo = isEmailAddress(configuredAlert) ? configuredAlert.trim() : (process.env.EMAIL_TO || 'sold@realtorpooya.ca')

    const propertyId: string | null =
      typeof rawPropertyId === 'string' && UUID_RE.test(rawPropertyId) ? rawPropertyId : (pageRow?.propertyId ?? null)
    const propertyRow = propertyId
      ? await db.query.properties.findFirst({ where: eq(properties.id, propertyId), columns: { address: true, city: true, price: true } })
          .catch(() => null)
      : null
    const propertyAddress = propertyRow ? [propertyRow.address, propertyRow.city].filter(Boolean).join(', ') : ''
    const propertyPrice = propertyRow?.price != null && Number.isFinite(Number(propertyRow.price))
      ? '$' + Number(propertyRow.price).toLocaleString('en-US') : ''

    const resolvedTitle = pageRow?.title || (typeof pageTitle === 'string' ? pageTitle : '') || propertyAddress || 'Realtor Pooya'
    const pageUrl = pageRow
      ? (pageRow.customDomain ? `https://${pageRow.customDomain}` : `${SITE_BASE}/properties/${pageRow.slug}`)
      : (pageSlug ? `${SITE_BASE}/properties/${pageSlug}` : SITE_BASE)

    const today = new Date().toISOString().slice(0, 10)
    const noteParts: string[] = [`${today} landing-page registration (${source})`]
    if (resolvedTitle || pageSlug) noteParts.push(`page: ${resolvedTitle || pageSlug}`)
    if (priceRange) noteParts.push(`price range: ${priceRange}`)
    if (role) noteParts.push(`role: ${role}`)
    if (propertyId) noteParts.push(`propertyId: ${propertyId}`)
    const noteLine = noteParts.join(' | ')

    // === CRM write ===
    try {
      const existing = await db.query.clients.findFirst({
        where: eq(clients.email, emailLower),
        columns: { id: true, fullName: true, phone: true, notes: true, tags: true },
      })

      const tags = Array.from(new Set(['landing-page', role].filter(Boolean))) as string[]

      let clientId: string
      if (!existing) {
        const [created] = await db
          .insert(clients)
          .values({
            fullName,
            email: emailLower,
            phone: phone || null,
            clientType: 'buyer',
            stage: 'new lead',
            source: `landing:${pageSlug || source}`,
            leadSource: 'Landing Page',
            tags,
            notes: noteLine,
          })
          .returning({ id: clients.id })
        clientId = created.id
      } else {
        clientId = existing.id
        const updates: Record<string, unknown> = {}
        if ((!existing.fullName || !existing.fullName.trim()) && fullName) updates.fullName = fullName
        if ((!existing.phone || !existing.phone.trim()) && phone) updates.phone = phone
        updates.tags = Array.from(new Set([...(existing.tags || []), ...tags]))
        updates.notes = existing.notes && existing.notes.trim() ? `${existing.notes}\n${noteLine}` : noteLine
        await db.update(clients).set(updates).where(eq(clients.id, clientId))
      }

      if (propertyId) {
        await db.insert(clientProperties).values({ clientId, propertyId, relationshipType: 'landing_inquiry' }).onConflictDoNothing()
      }

      const defaultAgentId = process.env.DEFAULT_AGENT_ID
      if (defaultAgentId) {
        await db.insert(tasks).values({
          title: `Follow up: registration from ${fullName}`,
          createdBy: defaultAgentId,
          clientId,
          dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          priority: 'high',
          status: 'pending',
        })
      }
    } catch (err) {
      console.error('landing-lead CRM write failed:', err)
    }

    // === Emails (best-effort): lead alert + the page's confirmation email ===
    const emailed = { alert: false, registrant: false, registrantEnabled: autoReply.enabled }
    if (process.env.RESEND_API_KEY) {
      const fromAddr = process.env.EMAIL_FROM || 'sold@realtorpooya.ca'
      const send = async (payload: Record<string, unknown>): Promise<boolean> => {
        const r = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!r.ok) console.error('Resend error:', r.status, await r.text())
        return r.ok
      }

      // 1) Lead alert to the agent / page-configured address
      try {
        emailed.alert = await send({
          from: fromAddr, to: [alertTo], reply_to: email,
          subject: `New registration: ${fullName}${resolvedTitle ? ` — ${resolvedTitle}` : ''}`,
          html: adminEmailHTML({ fullName, email, phone, priceRange, role, page: resolvedTitle || pageSlug || '—' }),
        })
      } catch (e) { console.error('admin email failed:', e) }

      // 2) Registrant confirmation — wording comes from the page document
      if (autoReply.enabled) {
        try {
          const vars: AutoReplyVars = {
            firstName, lastName, fullName, email, phone, priceRange, role,
            pageTitle: resolvedTitle, pageUrl, propertyAddress, propertyPrice,
          }
          const rendered = renderAutoReplyEmail(autoReply, vars)
          const from = fromAddr.includes('<') ? fromAddr : `${(autoReply.fromName || '').trim() || DEFAULT_EMAIL_BRAND.agentName} <${fromAddr}>`
          emailed.registrant = await send({
            from, to: [email],
            reply_to: isEmailAddress(autoReply.replyTo) ? autoReply.replyTo.trim() : alertTo,
            subject: rendered.subject,
            html: rendered.html,
            text: rendered.text,
          })
        } catch (e) { console.error('user email failed:', e) }
      }
    }

    return NextResponse.json({ success: true, emailed })
  } catch (error) {
    console.error('landing-lead error:', error)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
