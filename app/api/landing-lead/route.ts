import { NextResponse } from 'next/server'

const BRAND = '#473729'
const ACCENT = '#aa9578'
const LOGO = 'https://realtorpooya.ca/icon.png'
const AGENT_PHOTO = 'https://realtorpooya.ca/images/agent-pooya.jpg'

function shell(inner: string): string {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head>
  <body style="margin:0;padding:0;background:#f9f6f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;color:${BRAND};line-height:1.6;">
    <div style="max-width:600px;margin:0 auto;background:#fff;">
      <div style="background:linear-gradient(135deg,${ACCENT} 0%,#8a7a63 100%);padding:32px;text-align:center;">
        <img src="${LOGO}" alt="Realtor Pooya" style="max-height:46px;height:auto;"/>
      </div>
      ${inner}
      <div style="background:${BRAND};color:#fff;padding:28px;text-align:center;">
        <img src="${AGENT_PHOTO}" alt="Pooya Pirayeshakbari" style="width:70px;height:70px;border-radius:50%;object-fit:cover;margin-bottom:12px;"/>
        <div style="font-weight:600;font-size:17px;">Pooya Pirayeshakbari</div>
        <div style="color:rgba(255,255,255,.85);font-size:13px;">Luxury Real Estate Specialist</div>
        <div style="color:rgba(255,255,255,.8);font-size:13px;margin-top:6px;">416-553-7707 · sold@realtorpooya.ca</div>
      </div>
    </div>
  </body></html>`
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:6px 0;color:${ACCENT};font-weight:600;width:130px;vertical-align:top;">${label}</td><td style="padding:6px 0;color:${BRAND};">${value}</td></tr>`
}

function adminEmailHTML(d: { fullName: string; email: string; phone: string; priceRange: string; role: string; page: string }): string {
  return shell(`
    <div style="padding:36px 32px;">
      <h1 style="font-size:24px;text-align:center;margin:0 0 8px;">New Registration</h1>
      <p style="text-align:center;color:${ACCENT};margin:0 0 24px;font-size:14px;">A new lead registered from a property page.</p>
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
    </div>`)
}

function userEmailHTML(d: { firstName: string }): string {
  return shell(`
    <div style="padding:36px 32px;">
      <h1 style="font-size:24px;text-align:center;margin:0 0 18px;">Thank You for Registering!</h1>
      <p style="font-size:16px;margin:0 0 16px;">Dear ${d.firstName || 'there'},</p>
      <p style="font-size:15px;margin:0 0 18px;">Thank you for your interest. Your registration has been received — Pooya will personally reach out shortly with floor plans, pricing, and to help arrange your private tour.</p>
      <div style="background:#f3ecdf;border-radius:12px;padding:22px;text-align:center;">
        <p style="color:${ACCENT};font-weight:600;margin:0 0 8px;font-size:15px;">Need to reach us sooner?</p>
        <p style="margin:0;color:${BRAND};font-size:15px;">Call or text <b>416-553-7707</b><br/>Email <b>sold@realtorpooya.ca</b></p>
      </div>
    </div>`)
}

// Lead capture for landing-page "Register Here" forms. Writes a lead into the
// shared CRM `clients` table (deduped by email), links the property, emails the
// realtor (admin) AND sends the registrant a branded confirmation. Mirrors /api/contact.
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      firstName = '', lastName = '', email, phone = '',
      priceRange = '', role = '', propertyId = null,
      pageSlug = '', pageTitle = '', source = 'register',
    } = body || {}

    const fullName = `${firstName} ${lastName}`.trim() || firstName || 'Website Lead'
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const today = new Date().toISOString().slice(0, 10)
    const noteParts: string[] = [`${today} landing-page registration (${source})`]
    if (pageTitle || pageSlug) noteParts.push(`page: ${pageTitle || pageSlug}`)
    if (priceRange) noteParts.push(`price range: ${priceRange}`)
    if (role) noteParts.push(`role: ${role}`)
    if (propertyId) noteParts.push(`propertyId: ${propertyId}`)
    const noteLine = noteParts.join(' | ')

    // === CRM write ===
    try {
      const { db } = await import('@/lib/db')
      const { clients, clientProperties, tasks } = await import('@/lib/db/schema')
      const { eq } = await import('drizzle-orm')

      const emailLower = String(email).trim().toLowerCase()
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

    // === Emails (best-effort): notify admin + confirm to registrant ===
    if (process.env.RESEND_API_KEY) {
      const from = process.env.EMAIL_FROM || 'noreply@mail.realtorpooya.ca'
      const admin = process.env.EMAIL_TO || 'sold@realtorpooya.ca'
      const pageLabel = pageTitle || pageSlug || '—'
      const send = (payload: Record<string, unknown>) =>
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).then(async (r) => { if (!r.ok) console.error('Resend error:', r.status, await r.text()) })

      // 1) Admin notification
      try {
        await send({
          from, to: [admin], reply_to: email,
          subject: `New registration: ${fullName}${pageTitle ? ` — ${pageTitle}` : ''}`,
          html: adminEmailHTML({ fullName, email, phone, priceRange, role, page: pageLabel }),
        })
      } catch (e) { console.error('admin email failed:', e) }

      // 2) Registrant confirmation / auto-reply
      try {
        await send({
          from: `Pooya Pirayeshakbari <${from}>`, to: [email], reply_to: admin,
          subject: 'Thank you for registering — Realtor Pooya',
          html: userEmailHTML({ firstName }),
        })
      } catch (e) { console.error('user email failed:', e) }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('landing-lead error:', error)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
