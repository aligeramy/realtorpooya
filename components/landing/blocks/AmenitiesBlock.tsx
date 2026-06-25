'use client'
import React from 'react'
import type { Block, AmenitiesProps } from '@/lib/landing/types'
import { Section, Eyebrow, Heading } from './_shared'

export default function AmenitiesBlock({ props }: { props: AmenitiesProps; block?: Block }) {
  const items = (props.items || []).map((i) => (i || '').trim()).filter(Boolean)
  if (!items.length) return null

  const columns = Math.max(1, Math.min(props.columns || 2, 4))

  return (
    <Section background="var(--lp-primary)">
      <Eyebrow>Features &amp; Amenities</Eyebrow>
      {props.heading ? (
        <Heading level={2} style={{ marginBottom: 'clamp(28px, 4vw, 48px)', maxWidth: 760 }}>
          {props.heading}
        </Heading>
      ) : null}

      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(min(260px, 100%), 1fr))`,
          maxWidth: columns <= 1 ? 640 : undefined,
          columnGap: 'clamp(28px, 5vw, 72px)',
          rowGap: 0,
        }}
      >
        {items.map((item, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 16,
              padding: '18px 0',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              fontFamily: 'var(--lp-body-font)',
              fontSize: 'clamp(15px, 1.5vw, 17px)',
              lineHeight: 1.5,
              color: 'var(--lp-text)',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                flex: 'none',
                width: 7,
                height: 7,
                marginTop: 9,
                background: 'var(--lp-accent)',
                transform: 'rotate(45deg)',
              }}
            />
            <span style={{ opacity: 0.92 }}>{item}</span>
          </li>
        ))}
      </ul>
    </Section>
  )
}
