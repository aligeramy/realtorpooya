'use client'
import React from 'react'
import type { Block, FeatureColumnsProps } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'
import { Section, Eyebrow, Heading, ButtonRow } from './_shared'

export default function FeatureColumnsBlock({ props, block }: { props: FeatureColumnsProps; block?: Block }) {
  const ctx = useRenderContext()
  const items = props.items || []
  const cols = props.columns || 3
  const align = props.align || 'center'
  if (!items.length && !ctx.editor) return null

  const cls = 'fc-' + String(block?.id || 'x').replace(/[^a-zA-Z0-9]/g, '')

  return (
    <Section id={props.anchorId} background={props.background}>
      {(props.eyebrow || props.heading) ? (
        <div style={{ textAlign: align, marginBottom: 'clamp(32px, 5vw, 64px)' }}>
          {props.eyebrow ? <Eyebrow>{props.eyebrow}</Eyebrow> : null}
          {props.heading ? <Heading level={2} style={{ margin: 0 }}>{props.heading}</Heading> : null}
        </div>
      ) : null}

      <style>{`.${cls}{display:grid;grid-template-columns:1fr;gap:clamp(2rem,4vw,3.5rem);}@media(min-width:768px){.${cls}{grid-template-columns:repeat(${cols},minmax(0,1fr));}}`}</style>
      <div className={cls}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: align, alignItems: align === 'center' ? 'center' : 'flex-start' }}>
            {it.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt={it.title || ''} src={it.image} style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: 'var(--lp-radius)', display: 'block', marginBottom: 6 }} />
            ) : null}
            {it.title ? (
              <h3 style={{ fontFamily: 'var(--lp-heading-font)', fontWeight: 400, fontSize: 'clamp(20px, 2.2vw, 27px)', letterSpacing: '0.02em', margin: 0, color: 'var(--lp-text)' }}>{it.title}</h3>
            ) : null}
            {it.text ? (
              <p style={{ margin: 0, opacity: 0.82, lineHeight: 1.8, fontFamily: 'var(--lp-body-font)', fontSize: 'clamp(0.95rem, 1vw, 1.02rem)' }}>{it.text}</p>
            ) : null}
          </div>
        ))}
      </div>

      {props.buttons && props.buttons.length > 0 ? (
        <div style={{ marginTop: 'clamp(32px, 5vw, 56px)' }}><ButtonRow buttons={props.buttons} align={align} /></div>
      ) : null}
    </Section>
  )
}
