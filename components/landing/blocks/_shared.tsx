'use client'
// Shared presentational primitives for landing-page blocks.
import React from 'react'
import type { CtaButton } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'

export function Container({ children, style, narrow }: { children: React.ReactNode; style?: React.CSSProperties; narrow?: boolean }) {
  return (
    <div style={{ width: '100%', maxWidth: narrow ? 820 : 'var(--lp-max-width)', marginLeft: 'auto', marginRight: 'auto', paddingLeft: 24, paddingRight: 24, ...style }}>
      {children}
    </div>
  )
}

export function Section({
  id, children, background, style, padded = true, narrow,
}: {
  id?: string
  children: React.ReactNode
  background?: string
  style?: React.CSSProperties
  padded?: boolean
  narrow?: boolean
}) {
  return (
    <section
      id={id}
      style={{
        position: 'relative',
        background: background || 'transparent',
        paddingTop: padded ? 'clamp(48px, 7vw, 104px)' : 0,
        paddingBottom: padded ? 'clamp(48px, 7vw, 104px)' : 0,
        ...style,
      }}
    >
      <Container narrow={narrow}>{children}</Container>
    </section>
  )
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  if (!children) return null
  return (
    <div style={{ fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--lp-accent)', marginBottom: 16, fontFamily: 'var(--lp-body-font)' }}>
      {children}
    </div>
  )
}

export function Heading({ children, level = 2, style }: { children: React.ReactNode; level?: 1 | 2 | 3 | 4; style?: React.CSSProperties }) {
  const Tag = (`h${level}`) as any
  const sizes: Record<number, string> = { 1: 'clamp(40px, 7vw, 86px)', 2: 'clamp(30px, 4.4vw, 52px)', 3: 'clamp(22px, 3vw, 34px)', 4: 'clamp(18px, 2vw, 24px)' }
  return (
    <Tag style={{ fontFamily: 'var(--lp-heading-font)', fontWeight: 400, lineHeight: 1.08, fontSize: sizes[level], margin: 0, letterSpacing: '0.01em', ...style }}>
      {children}
    </Tag>
  )
}

export function alignItems(align?: string): React.CSSProperties {
  const map: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end' }
  return { alignItems: (map[align || 'left'] || 'flex-start') as any, textAlign: (align as any) || 'left' }
}

/** Render a CTA button and wire its action (register popup, link, scroll, phone, email). */
export function CtaButtonView({ button, size = 'md', fullWidth }: { button?: CtaButton; size?: 'sm' | 'md' | 'lg'; fullWidth?: boolean }) {
  const ctx = useRenderContext()
  if (!button || !button.label) return null

  const pad = size === 'lg' ? '16px 34px' : size === 'sm' ? '9px 18px' : '13px 28px'
  const isOutline = button.style === 'outline' || button.style === 'ghost'
  const isSecondary = button.style === 'secondary'

  const style: React.CSSProperties = {
    display: 'inline-block', cursor: 'pointer', border: isOutline ? '1px solid var(--lp-accent)' : 'none',
    padding: pad, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600,
    borderRadius: 'var(--lp-radius)', textDecoration: 'none', fontFamily: 'var(--lp-body-font)',
    background: isOutline ? 'transparent' : isSecondary ? 'var(--lp-primary)' : 'var(--lp-accent)',
    color: isOutline ? 'var(--lp-accent)' : isSecondary ? 'var(--lp-text)' : '#1a1410',
    width: fullWidth ? '100%' : undefined, textAlign: 'center',
  }

  const handleClick = (e: React.MouseEvent) => {
    if (ctx.editor) { e.preventDefault(); return }
    if (button.action === 'register') { e.preventDefault(); ctx.openRegister(button.label); return }
    if (button.action === 'scroll') {
      e.preventDefault()
      const el = document.querySelector(button.target || '')
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (button.action === 'link') {
    return <a href={button.href || '#'} target={button.newTab ? '_blank' : undefined} rel={button.newTab ? 'noopener' : undefined} style={style} onClick={handleClick}>{button.label}</a>
  }
  if (button.action === 'phone') return <a href={`tel:${button.phone || ''}`} style={style}>{button.label}</a>
  if (button.action === 'email') return <a href={`mailto:${button.email || ''}`} style={style}>{button.label}</a>
  return <button type="button" style={style} onClick={handleClick}>{button.label}</button>
}

export function ButtonRow({ buttons, align = 'center', size }: { buttons?: CtaButton[]; align?: string; size?: 'sm' | 'md' | 'lg' }) {
  if (!buttons?.length) return null
  const justify: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end' }
  return (
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: justify[align] || 'center', marginTop: 28 }}>
      {buttons.map((b, i) => <CtaButtonView key={i} button={b} size={size} />)}
    </div>
  )
}
