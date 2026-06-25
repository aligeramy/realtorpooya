'use client'
import React from 'react'
import type { Block, MapProps } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'
import { Section, Container, Heading } from './_shared'

export default function MapBlock({ props }: { props: MapProps; block?: Block }) {
  const ctx = useRenderContext()

  const useProperty = (props.source ?? 'property') === 'property'
  const address = props.address || (useProperty ? ctx.property?.address || '' : '')
  const lat = props.lat ?? (useProperty ? ctx.property?.lat ?? undefined : undefined)
  const lng = props.lng ?? (useProperty ? ctx.property?.lng ?? undefined : undefined)
  const zoom = props.zoom || 14

  const hasCoords = typeof lat === 'number' && typeof lng === 'number'
  const hasAddress = !!address && address.trim().length > 0

  if (!hasCoords && !hasAddress) {
    if (ctx.editor) {
      return (
        <Section>
          <Container>
            <div
              style={{
                border: '1px dashed rgba(255,255,255,0.18)',
                borderRadius: 'var(--lp-radius)',
                padding: 'clamp(2rem, 5vw, 3.5rem)',
                textAlign: 'center',
                color: 'var(--lp-text)',
                opacity: 0.6,
                fontFamily: 'var(--lp-body-font)',
                letterSpacing: '0.04em',
              }}
            >
              Map — add an address or coordinates to display the location.
            </div>
          </Container>
        </Section>
      )
    }
    return null
  }

  const src = hasCoords
    ? `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=${zoom}&output=embed`

  return (
    <Section>
      <Container>
        {props.heading ? (
          <Heading level={2} style={{ marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
            {props.heading}
          </Heading>
        ) : null}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            minHeight: 320,
            maxHeight: 540,
            borderRadius: 'var(--lp-radius)',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
          }}
        >
          <iframe
            title={props.heading || (hasAddress ? address : 'Property location')}
            src={src}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              border: 0,
              display: 'block',
              filter: 'grayscale(0.15) contrast(1.05)',
              pointerEvents: ctx.editor ? 'none' : 'auto',
            }}
          />
        </div>
      </Container>
    </Section>
  )
}
