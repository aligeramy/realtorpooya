'use client'
// The global "Register Here" popup, opened by any button with action:'register'.
import React, { useEffect } from 'react'
import { useRenderContext } from './render-context'
import { LeadForm } from './LeadForm'

export interface RegisterModalProps {
  open: boolean
  source?: string
  onClose: () => void
}

export function RegisterModal({ open, source, onClose }: RegisterModalProps) {
  const ctx = useRenderContext()
  const cfg = ctx.registration

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: 16,
        background: 'rgba(8,6,4,0.72)', backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 460, maxHeight: '92vh', overflowY: 'auto',
          background: 'var(--lp-primary)', color: 'var(--lp-text)',
          border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'calc(var(--lp-radius) * 2)',
          padding: '32px 28px', boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
          fontFamily: 'var(--lp-body-font)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <h3 style={{ fontFamily: 'var(--lp-heading-font)', fontSize: 26, margin: 0, letterSpacing: '0.02em' }}>
            {cfg.heading || 'Register Here'}
          </h3>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: 'inherit', fontSize: 26, cursor: 'pointer', lineHeight: 1, opacity: 0.7 }}>×</button>
        </div>
        {cfg.subtext && <p style={{ opacity: 0.85, fontSize: 15, marginTop: 0, marginBottom: cfg.note ? 6 : 18 }}>{cfg.subtext}</p>}
        {cfg.note && <p style={{ color: 'var(--lp-accent)', fontSize: 14, fontWeight: 600, marginTop: 0, marginBottom: 18 }}>{cfg.note}</p>}
        <LeadForm source={source || 'register-popup'} />
      </div>
    </div>
  )
}
