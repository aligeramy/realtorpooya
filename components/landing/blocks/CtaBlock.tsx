'use client'
import React from 'react'
import type { Block, CtaProps } from '@/lib/landing/types'
import { ButtonRow, Container, Eyebrow, Heading } from './_shared'

export default function CtaBlock({ props }: { props: CtaProps; block?: Block }) {
  const align = props.align || 'center'
  const hasImage = !!props.backgroundImage
  const hasBg = hasImage || !!props.background
  const textColor = props.textColor || (hasBg ? '#f3efe6' : 'var(--lp-text)')
  const justify = align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'
  const dividers = !!props.background && !hasImage // gold rules for solid dark bands

  const GoldRule = () => (
    <div style={{ width: 'min(440px, 72%)', height: 1, background: 'var(--lp-accent)', opacity: 0.65, marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0 }} />
  )

  return (
    <section id={props.anchorId} style={{ position: 'relative', scrollMarginTop: 80, background: hasImage ? undefined : (props.background || 'transparent'), color: textColor, overflow: 'hidden' }}>
      {hasImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src={props.backgroundImage} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.7))', zIndex: 1 }} />
        </>
      )}
      <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(56px, 9vw, 120px) 1.5rem' }}>
        <Container narrow>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: justify, textAlign: align, gap: 'clamp(1rem, 2.2vw, 1.6rem)', maxWidth: 760, marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0 }}>
            {dividers && <GoldRule />}
            {props.eyebrow && <Eyebrow>{props.eyebrow}</Eyebrow>}
            {props.heading && <Heading level={2} style={{ margin: 0, color: textColor }}>{props.heading}</Heading>}
            {props.subtext && (
              <p style={{ margin: 0, opacity: 0.86, fontFamily: 'var(--lp-body-font)', fontSize: 'clamp(1rem, 1.2vw, 1.12rem)', lineHeight: 1.85, maxWidth: 640 }}>{props.subtext}</p>
            )}
            {props.note && (
              <p style={{ margin: 0, color: 'var(--lp-accent)', fontWeight: 600, letterSpacing: '0.04em', fontFamily: 'var(--lp-body-font)', fontSize: 'clamp(0.95rem, 1.1vw, 1.05rem)' }}>{props.note}</p>
            )}
            {props.buttons && props.buttons.length > 0 && (
              <div style={{ marginTop: '0.5rem', width: align === 'center' ? '100%' : 'auto' }}>
                <ButtonRow buttons={props.buttons} align={align} size="lg" />
              </div>
            )}
            {dividers && <GoldRule />}
          </div>
        </Container>
      </div>
    </section>
  )
}
