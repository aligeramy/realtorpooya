'use client'
// Shared lead-capture form. Used by the Register popup and the inline lead_form
// block. Fields are driven by the page RegistrationConfig (incl. the per-page
// configurable Price Range options). Posts to /api/landing-lead.
import React, { useMemo, useState } from 'react'
import type { RegistrationConfig } from '@/lib/landing/types'
import { useRenderContext } from './render-context'

export interface LeadFormProps {
  config?: Partial<RegistrationConfig>
  propertyId?: string | null
  source?: string
  compact?: boolean
  onSuccess?: () => void
}

export function LeadForm({ config, propertyId, source, compact, onSuccess }: LeadFormProps) {
  const ctx = useRenderContext()
  const cfg: RegistrationConfig = useMemo(() => ({ ...ctx.registration, ...(config || {}) }), [ctx.registration, config])

  const [values, setValues] = useState<Record<string, string>>({
    firstName: '', lastName: '', email: '', phone: '',
    priceRange: '', role: cfg.buyerRealtorOptions?.[0] || 'Buyer',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (ctx.editor) return
    setStatus('submitting'); setError('')
    try {
      const res = await fetch(`${ctx.apiBase}/api/landing-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          propertyId: propertyId ?? cfg.propertyId ?? ctx.property?.id ?? null,
          pageSlug: ctx.pageSlug,
          pageTitle: ctx.pageTitle,
          source: source || 'register',
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setStatus('success')
      onSuccess?.()
    } catch (err: any) {
      setStatus('error'); setError(err?.message || 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="lp-leadform-success" style={{ padding: '24px 0', color: 'var(--lp-text)' }}>
        <p style={{ fontSize: 18, fontFamily: 'var(--lp-heading-font)' }}>
          {cfg.successMessage || 'Thank you! We will be in touch shortly.'}
        </p>
      </div>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.18)', borderRadius: 'var(--lp-radius)',
    color: 'inherit', fontSize: 15, outline: 'none', fontFamily: 'var(--lp-body-font)',
  }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, opacity: 0.8 }

  return (
    <form onSubmit={submit} className="lp-leadform" style={{ display: 'grid', gap: 14, color: 'var(--lp-text)' }}>
      {(cfg.showFirstName !== false || cfg.showLastName !== false) && (
        <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '1fr 1fr', gap: 12 }}>
          {cfg.showFirstName !== false && (
            <div>
              <label style={labelStyle}>First Name*</label>
              <input style={inputStyle} required value={values.firstName} onChange={(e) => set('firstName', e.target.value)} placeholder="First name" />
            </div>
          )}
          {cfg.showLastName !== false && (
            <div>
              <label style={labelStyle}>Last Name*</label>
              <input style={inputStyle} required value={values.lastName} onChange={(e) => set('lastName', e.target.value)} placeholder="Last name" />
            </div>
          )}
        </div>
      )}
      {cfg.showEmail !== false && (
        <div>
          <label style={labelStyle}>Email*</label>
          <input type="email" style={inputStyle} required value={values.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" />
        </div>
      )}
      {cfg.showPhone !== false && (
        <div>
          <label style={labelStyle}>Phone Number*</label>
          <input type="tel" style={inputStyle} required value={values.phone} onChange={(e) => set('phone', e.target.value)} placeholder="Phone number" />
        </div>
      )}
      {cfg.showPriceRange && (cfg.priceRangeOptions?.length ?? 0) > 0 && (
        <div>
          <label style={labelStyle}>Price Range*</label>
          <select style={inputStyle} required value={values.priceRange} onChange={(e) => set('priceRange', e.target.value)}>
            <option value="" disabled>Price Range</option>
            {cfg.priceRangeOptions!.map((opt) => (
              <option key={opt} value={opt} style={{ color: '#111' }}>{opt}</option>
            ))}
          </select>
        </div>
      )}
      {cfg.showBuyerRealtor && (cfg.buyerRealtorOptions?.length ?? 0) > 0 && (
        <div>
          <label style={labelStyle}>Are you a Buyer or Realtor?*</label>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            {cfg.buyerRealtorOptions!.map((opt) => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 15 }}>
                <input type="radio" name="role" checked={values.role === opt} onChange={() => set('role', opt)} />
                {opt}
              </label>
            ))}
          </div>
        </div>
      )}
      {error && <p style={{ color: '#ff8a8a', fontSize: 14 }}>{error}</p>}
      <button
        type="submit"
        disabled={status === 'submitting'}
        style={{
          marginTop: 6, padding: '14px 20px', border: 'none', cursor: 'pointer',
          background: 'var(--lp-accent)', color: '#1a1410', fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 13,
          borderRadius: 'var(--lp-radius)', opacity: status === 'submitting' ? 0.6 : 1,
          fontFamily: 'var(--lp-body-font)',
        }}
      >
        {status === 'submitting' ? 'Submitting…' : (cfg.submitLabel || 'Submit')}
      </button>
    </form>
  )
}
