'use client'
import React from 'react'
import type { Block, FooterProps } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'
import { Container } from './_shared'

export default function FooterBlock({ props }: { props: FooterProps; block?: Block }) {
  const ctx = useRenderContext()
  const editorPrevent = ctx.editor ? (e: React.MouseEvent) => e.preventDefault() : undefined

  const a = props.showAgent !== false ? ctx.agent : null
  const name = props.agentName || a?.name || ''
  const title = props.agentTitle || a?.title || ''
  const brokerage = props.brokerage || a?.brokerage || ''
  const phone = props.phone || a?.phone || ''
  const email = props.email || a?.email || ''
  const layout = props.layout || 'centered'

  const linkStyle: React.CSSProperties = {
    color: '#f3efe6', opacity: 0.72, textDecoration: 'none', fontSize: 14,
    fontFamily: 'var(--lp-body-font)', letterSpacing: '0.04em',
  }
  const labelStyle: React.CSSProperties = { fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--lp-accent)', marginBottom: 4 }

  const footerStyle: React.CSSProperties = {
    background: props.background || 'var(--lp-primary)',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    color: '#f3efe6',
    fontFamily: 'var(--lp-body-font)',
    paddingTop: 'clamp(48px, 6vw, 88px)',
    paddingBottom: 'clamp(28px, 3vw, 40px)',
  }

  // ── Centered layout (7 Dale style: agent + brokerage logo, centered) ──────
  if (layout === 'centered') {
    return (
      <footer style={footerStyle}>
        <Container>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8 }}>
            {props.tagline ? <div style={{ opacity: 0.7, letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 12, marginBottom: 6 }}>{props.tagline}</div> : null}
            {name ? <div style={{ fontFamily: 'var(--lp-heading-font)', fontSize: 'clamp(20px, 2.4vw, 27px)', letterSpacing: '0.02em' }}>{name}</div> : null}
            {title ? <div style={{ opacity: 0.82, fontSize: 14 }}>{title}</div> : null}
            {brokerage ? <div style={{ opacity: 0.82, fontSize: 14 }}>{brokerage}</div> : null}
            {phone ? <div style={{ fontSize: 15, marginTop: 2 }}>Direct:{' '}<a href={ctx.editor ? undefined : `tel:${phone.replace(/[^\d+]/g, '')}`} onClick={editorPrevent} style={{ color: 'var(--lp-accent)', textDecoration: 'none' }}>{phone}</a></div> : null}
            {email ? <a href={ctx.editor ? undefined : `mailto:${email}`} onClick={editorPrevent} style={{ ...linkStyle, opacity: 0.85 }}>{email}</a> : null}
            {props.brokerageLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={props.brokerageLogo} alt={brokerage || 'Brokerage'} style={{ height: 54, width: 'auto', objectFit: 'contain', marginTop: 20, opacity: 0.95 }} />
            ) : props.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={props.logo} alt="" style={{ height: 44, width: 'auto', objectFit: 'contain', marginTop: 20 }} />
            ) : null}
            {props.links && props.links.length > 0 ? (
              <nav style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', marginTop: 22 }}>
                {props.links.map((l, i) => <a key={i} href={ctx.editor ? undefined : l.href} onClick={editorPrevent} style={linkStyle}>{l.label}</a>)}
              </nav>
            ) : null}
            {props.fineprint ? <div style={{ opacity: 0.5, fontSize: 12, lineHeight: 1.7, marginTop: 22, maxWidth: 620 }}>{props.fineprint}</div> : null}
          </div>
        </Container>
      </footer>
    )
  }

  // ── Columns layout ────────────────────────────────────────────────────────
  return (
    <footer style={footerStyle}>
      <Container>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(28px, 4vw, 64px)', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 'clamp(28px, 4vw, 48px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 200 }}>
            {props.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={props.logo} alt="" style={{ height: 40, width: 'auto', objectFit: 'contain' }} />
            ) : (
              <div style={{ fontFamily: 'var(--lp-heading-font)', fontSize: 'clamp(22px, 2.6vw, 30px)', letterSpacing: '0.02em' }}>{ctx.pageTitle || ctx.property?.address || 'Residences'}</div>
            )}
            {ctx.property?.cityProvince ? <div style={{ fontSize: 13, opacity: 0.55, letterSpacing: '0.04em' }}>{ctx.property.cityProvince}</div> : null}
            {props.tagline ? <div style={{ fontSize: 13, opacity: 0.6 }}>{props.tagline}</div> : null}
          </div>

          {(name || phone || email) ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 200 }}>
              <div style={labelStyle}>Contact</div>
              {name ? <div style={{ fontFamily: 'var(--lp-heading-font)', fontSize: 19 }}>{name}</div> : null}
              {(title || brokerage) ? <div style={{ fontSize: 13, opacity: 0.6 }}>{[title, brokerage].filter(Boolean).join(' · ')}</div> : null}
              {phone ? <a href={ctx.editor ? undefined : `tel:${phone}`} onClick={editorPrevent} style={{ ...linkStyle, opacity: 0.85 }}>{phone}</a> : null}
              {email ? <a href={ctx.editor ? undefined : `mailto:${email}`} onClick={editorPrevent} style={{ ...linkStyle, opacity: 0.85 }}>{email}</a> : null}
            </div>
          ) : null}

          {props.links && props.links.length > 0 ? (
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 160 }}>
              <div style={labelStyle}>Explore</div>
              {props.links.map((l, i) => <a key={i} href={ctx.editor ? undefined : l.href || '#'} onClick={editorPrevent} style={linkStyle}>{l.label}</a>)}
            </nav>
          ) : null}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 'clamp(18px, 2.5vw, 28px)', fontSize: 12, lineHeight: 1.7, opacity: 0.5, letterSpacing: '0.03em', maxWidth: 760 }}>
          {props.fineprint || ''}
        </div>
      </Container>
    </footer>
  )
}
