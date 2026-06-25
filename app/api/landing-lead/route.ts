import { NextResponse } from 'next/server'

// Lead capture for landing-page "Register Here" forms. Writes a lead into the
// shared CRM `clients` table (deduped by email), links the property, and emails
// the realtor (best-effort). Mirrors the CRM bridge in /api/contact.
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

    // === Email notification (best-effort) ===
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'noreply@mail.realtorpooya.ca',
            to: [process.env.EMAIL_TO || 'sold@realtorpooya.ca'],
            subject: `New registration: ${fullName}${pageTitle ? ` — ${pageTitle}` : ''}`,
            reply_to: email,
            html: `<h2>New Landing-Page Registration</h2>
              <p><b>Name:</b> ${fullName}</p>
              <p><b>Email:</b> ${email}</p>
              <p><b>Phone:</b> ${phone || '—'}</p>
              <p><b>Price Range:</b> ${priceRange || '—'}</p>
              <p><b>Buyer/Realtor:</b> ${role || '—'}</p>
              <p><b>Page:</b> ${pageTitle || pageSlug || '—'}</p>`,
          }),
        })
      } catch (e) {
        console.error('landing-lead email failed:', e)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('landing-lead error:', error)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
