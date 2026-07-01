'use client'
import React from 'react'
import type { Block, SplitProps } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'
import { Section, Eyebrow, Heading, ButtonRow } from './_shared'

export default function SplitBlock({ props }: { props: SplitProps; block?: Block }) {
  const ctx = useRenderContext()
  const img = props.image || ''
  const imageRight = (props.imageSide || 'right') === 'right'

  return (
    <Section id={props.anchorId} background={props.background}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 'clamp(2rem, 5vw, 4.5rem)', alignItems: 'center' }}>
        <div style={{ order: imageRight ? 1 : 2, display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2vw, 1.4rem)' }}>
          {props.eyebrow ? <Eyebrow>{props.eyebrow}</Eyebrow> : null}
          {props.heading ? <Heading level={2} style={{ margin: 0 }}>{props.heading}</Heading> : null}
          {props.body ? (
            <p style={{ margin: 0, opacity: 0.86, lineHeight: 1.85, fontFamily: 'var(--lp-body-font)', fontSize: 'clamp(1rem, 1.05vw, 1.1rem)', maxWidth: 560 }}>{props.body}</p>
          ) : null}
          {props.buttons && props.buttons.length > 0 ? <div style={{ marginTop: '0.5rem' }}><ButtonRow buttons={props.buttons} align="left" /></div> : null}
        </div>
        {img ? (
          <div style={{ order: imageRight ? 2 : 1 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={props.heading || ''} src={img} style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: 'var(--lp-radius)', boxShadow: '0 30px 70px rgba(0,0,0,0.18)', display: 'block' }} />
          </div>
        ) : ctx.editor ? (
          <div style={{ order: imageRight ? 2 : 1, aspectRatio: '4 / 3', border: '1px dashed rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontFamily: 'var(--lp-body-font)', fontSize: 13 }}>Image</div>
        ) : null}
      </div>
    </Section>
  )
}
