'use client'
import React from 'react'
import type { Block, StatsProps } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'
import { Section, Eyebrow, Heading } from './_shared'

type Stat = { label: string; value: string; icon?: string }

function formatPrice(price?: number | string | null): string {
  if (price === null || price === undefined || price === '') return ''
  const n = typeof price === 'number' ? price : Number(String(price).replace(/[^0-9.]/g, ''))
  if (!Number.isFinite(n) || n <= 0) return ''
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function formatNum(v?: number | string | null): string {
  if (v === null || v === undefined || v === '') return ''
  const n = typeof v === 'number' ? v : Number(String(v).replace(/[^0-9.]/g, ''))
  if (!Number.isFinite(n) || n <= 0) return ''
  return n.toLocaleString('en-US')
}

export default function StatsBlock({ props }: { props: StatsProps; block?: Block }) {
  const ctx = useRenderContext()

  let items: Stat[] = []

  if (props.source === 'property' && ctx.property) {
    const p = ctx.property
    const candidates: Stat[] = [
      { label: 'Beds', value: formatNum(p.beds) },
      { label: 'Baths', value: formatNum(p.baths) },
      { label: 'Sq Ft', value: formatNum(p.sqft) },
      { label: 'Price', value: formatPrice(p.price) },
      { label: 'Year Built', value: p.yearBuilt ? String(p.yearBuilt) : '' },
    ]
    items = candidates.filter((s) => s.value)
  } else {
    items = (props.items || [])
      .filter((s) => s && (s.value || s.label))
      .map((s) => ({ label: s.label, value: s.value, icon: s.icon }))
  }

  if (items.length === 0) return null

  const cols = props.columns && props.columns > 0 ? props.columns : undefined
  const gridTemplate = cols
    ? `repeat(${cols}, minmax(0, 1fr))`
    : 'repeat(auto-fit, minmax(160px, 1fr))'

  return (
    <Section>
      {props.heading ? (
        <div style={{ textAlign: 'center', marginBottom: 'clamp(36px, 5vw, 64px)' }}>
          <Eyebrow>By the Numbers</Eyebrow>
          <Heading level={2}>{props.heading}</Heading>
        </div>
      ) : null}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: gridTemplate,
          alignItems: 'stretch',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 'var(--lp-radius)',
          overflow: 'hidden',
        }}
      >
        {items.map((stat, i) => (
          <div
            key={`${stat.label}-${i}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 12,
              padding: 'clamp(28px, 4vw, 48px) 20px',
              borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.10)',
            }}
          >
            {stat.icon ? (
              <span aria-hidden="true" style={{ fontSize: 22, color: 'var(--lp-accent)', lineHeight: 1 }}>
                {stat.icon}
              </span>
            ) : null}
            <span
              style={{
                fontFamily: 'var(--lp-heading-font)',
                fontWeight: 400,
                fontSize: 'clamp(30px, 4vw, 40px)',
                lineHeight: 1,
                color: 'var(--lp-text)',
              }}
            >
              {stat.value}
            </span>
            <span
              style={{
                fontFamily: 'var(--lp-body-font)',
                fontSize: 12,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                opacity: 0.7,
                color: 'var(--lp-text)',
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </Section>
  )
}
