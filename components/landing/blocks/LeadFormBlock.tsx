'use client'
import React from 'react'
import type { Block, LeadFormProps, RegistrationConfig } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'
import { Container, Eyebrow, Heading } from './_shared'
import { LeadForm } from '../LeadForm'

export default function LeadFormBlock({ props }: { props: LeadFormProps; block?: Block }) {
  const ctx = useRenderContext()

  // Build the config: start from the page RegistrationConfig when requested,
  // then layer on any explicit props overrides (undefined values do not override).
  const config = React.useMemo<Partial<RegistrationConfig>>(() => {
    const base: Partial<RegistrationConfig> = props.useRegistrationConfig
      ? { ...ctx.registration }
      : {}

    const overrides: Partial<RegistrationConfig> = {}
    if (props.heading !== undefined) overrides.heading = props.heading
    if (props.subtext !== undefined) overrides.subtext = props.subtext
    if (props.note !== undefined) overrides.note = props.note
    if (props.showPriceRange !== undefined) overrides.showPriceRange = props.showPriceRange
    if (props.priceRangeOptions !== undefined) overrides.priceRangeOptions = props.priceRangeOptions
    if (props.showBuyerRealtor !== undefined) overrides.showBuyerRealtor = props.showBuyerRealtor
    if (props.submitLabel !== undefined) overrides.submitLabel = props.submitLabel
    if (props.successMessage !== undefined) overrides.successMessage = props.successMessage
    if (props.propertyId !== undefined) overrides.propertyId = props.propertyId

    return { ...base, ...overrides }
  }, [props, ctx.registration])

  const layout = props.layout || 'split'
  const hasImage = Boolean(props.backgroundImage)

  const heading = props.heading || config.heading || 'Register Here'
  const subtext = props.subtext ?? config.subtext
  const note = props.note ?? config.note

  const sectionStyle: React.CSSProperties = {
    position: 'relative',
    background: hasImage ? undefined : 'var(--lp-primary)',
    color: '#f3efe6',
    overflow: 'hidden',
    paddingTop: 'clamp(56px, 8vw, 120px)',
    paddingBottom: 'clamp(56px, 8vw, 120px)',
  }

  const Intro = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.85rem, 2vw, 1.25rem)' }}>
      <Eyebrow>Private Access</Eyebrow>
      <Heading level={2} style={{ margin: 0 }}>{heading}</Heading>
      {subtext && (
        <p
          style={{
            margin: 0,
            opacity: 0.85,
            fontFamily: 'var(--lp-body-font)',
            fontSize: 'clamp(1rem, 1.4vw, 1.18rem)',
            lineHeight: 1.7,
            maxWidth: 520,
          }}
        >
          {subtext}
        </p>
      )}
      {note && (
        <p
          style={{
            margin: 0,
            color: 'var(--lp-accent)',
            fontWeight: 700,
            fontFamily: 'var(--lp-body-font)',
            letterSpacing: '0.02em',
            fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)',
          }}
        >
          {note}
        </p>
      )}
    </div>
  )

  const formCard = (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 'var(--lp-radius)',
        padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <LeadForm config={config} propertyId={props.propertyId} source="lead_form" />
    </div>
  )

  return (
    <section id="register" style={sectionStyle}>
      {hasImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            src={props.backgroundImage}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.78))',
              zIndex: 1,
            }}
          />
        </>
      )}

      <div style={{ position: 'relative', zIndex: 2 }}>
        <Container narrow={layout === 'centered'}>
          {layout === 'centered' ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(1.5rem, 4vw, 2.5rem)',
                maxWidth: 640,
                marginLeft: 'auto',
                marginRight: 'auto',
                textAlign: 'center',
                alignItems: 'center',
              }}
            >
              {Intro}
              <div style={{ width: '100%', textAlign: 'left' }}>{formCard}</div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
                gap: 'clamp(2rem, 5vw, 4rem)',
                alignItems: 'center',
              }}
            >
              {Intro}
              {formCard}
            </div>
          )}
        </Container>
      </div>
    </section>
  )
}
