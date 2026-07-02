'use client'
import React from 'react'
import type { Block, HeroProps } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'
import { ButtonRow, Container } from './_shared'

export default function HeroBlock({ props }: { props: HeroProps; block?: Block }) {
  const ctx = useRenderContext()
  const heights: Record<string, string> = { screen: '100vh', large: '78vh', medium: '60vh' }
  const minHeight = heights[props.height || 'large']
  const align = props.align || 'center'
  const justify = align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'
  const bg = props.backgroundImage || ctx.property?.images?.[0] || ''

  return (
    <section
      style={{
        position: 'relative', minHeight, display: 'flex', alignItems: 'center',
        justifyContent: justify, color: props.textColor || '#fff', overflow: 'hidden',
        backgroundColor: 'var(--lp-primary)',
      }}
    >
      {props.backgroundVideo ? (
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} src={props.backgroundVideo} />
      ) : bg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt="" src={bg} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : null}
      <div style={{ position: 'absolute', inset: 0, background: `rgba(10,8,6,${props.overlayOpacity ?? 0.45})` }} />
      <Container style={{ position: 'relative', zIndex: 1, paddingTop: 96, paddingBottom: 96 }}>
        <div style={{ maxWidth: 760, marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0, textAlign: align }}>
          {props.eyebrow ? (
            <div style={{ fontSize: props.eyebrowSize ? `${props.eyebrowSize}px` : 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: props.eyebrowColor || 'var(--lp-accent)', marginBottom: 16, fontFamily: 'var(--lp-body-font)' }}>
              {props.eyebrow}
            </div>
          ) : null}
          {props.headline ? (
            <h1 style={{ fontFamily: 'var(--lp-heading-font)', fontWeight: 400, fontSize: props.headlineSize ? `${props.headlineSize}px` : 'clamp(42px, 8vw, 96px)', lineHeight: 1.02, margin: 0, letterSpacing: '0.02em', color: props.headlineColor || undefined }}>
              {props.headline}
            </h1>
          ) : null}
          {props.subheadline ? (
            <p style={{ fontFamily: 'var(--lp-body-font)', fontStyle: 'italic', fontSize: props.subheadlineSize ? `${props.subheadlineSize}px` : 'clamp(16px, 1.8vw, 21px)', lineHeight: 1.6, color: props.subheadlineColor || undefined, opacity: props.subheadlineColor ? 1 : 0.92, marginTop: 22, maxWidth: 560, marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0 }}>
              {props.subheadline}
            </p>
          ) : null}
          <ButtonRow buttons={props.buttons} align={align} size="lg" />
        </div>
      </Container>
    </section>
  )
}
