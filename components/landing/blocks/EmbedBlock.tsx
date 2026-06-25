'use client'
import React from 'react'
import type { Block, EmbedProps } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'
import { Section, Container } from './_shared'

export default function EmbedBlock({ props }: { props: EmbedProps; block?: Block }) {
  const ctx = useRenderContext()
  const html = props.html || ''
  const minHeight = props.height
    ? typeof props.height === 'number'
      ? `${props.height}px`
      : props.height
    : undefined

  return (
    <Section>
      <Container>
        {html ? (
          <div
            style={{
              minHeight,
              width: '100%',
              borderRadius: 'var(--lp-radius)',
              overflow: 'hidden',
              position: 'relative',
              ...(ctx.editor ? { pointerEvents: 'none' } : {}),
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : ctx.editor ? (
          <div
            style={{
              minHeight: minHeight || '180px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: 'clamp(1.5rem, 4vw, 3rem)',
              border: '1px dashed rgba(255,255,255,0.25)',
              borderRadius: 'var(--lp-radius)',
              background: 'rgba(255,255,255,0.02)',
              color: 'var(--lp-text)',
              fontFamily: 'var(--lp-body-font)',
            }}
          >
            <div>
              <div
                style={{
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  fontSize: '0.7rem',
                  color: 'var(--lp-accent)',
                  marginBottom: '0.5rem',
                }}
              >
                Embed (HTML)
              </div>
              <div style={{ opacity: 0.6, fontSize: '0.85rem' }}>
                Add HTML to display your embed here.
              </div>
            </div>
          </div>
        ) : null}
      </Container>
    </Section>
  )
}
