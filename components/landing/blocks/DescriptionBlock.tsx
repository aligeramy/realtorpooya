'use client'
import React from 'react'
import type { Block, DescriptionProps } from '@/lib/landing/types'
import { toHtml } from '@/lib/landing/richtext'
import { useRenderContext } from '../render-context'
import { Container, Eyebrow, Heading, Section } from './_shared'

export default function DescriptionBlock({ props }: { props: DescriptionProps; block?: Block }) {
  const ctx = useRenderContext()

  const content = props.source === 'property' ? ctx.property?.description : props.content
  if (!content) return null

  const html = toHtml(content)
  if (!html || !html.trim()) return null

  const align = props.align || 'left'
  const items = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'
  const textAlign = align === 'center' ? 'center' : align === 'right' ? 'right' : 'left'

  return (
    <Section narrow>
      <Container narrow>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: items,
            textAlign: textAlign as React.CSSProperties['textAlign'],
            gap: 'clamp(1rem, 2.5vw, 1.75rem)',
          }}
        >
          {props.heading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: items, gap: '0.75rem' }}>
              <Eyebrow>About</Eyebrow>
              <Heading level={2} style={{ margin: 0 }}>
                {props.heading}
              </Heading>
            </div>
          ) : null}

          <div
            className="lp-description-body"
            style={{
              maxWidth: '70ch',
              width: '100%',
              lineHeight: 1.7,
              opacity: 0.9,
              fontFamily: 'var(--lp-body-font)',
              color: 'var(--lp-text)',
              fontSize: 'clamp(1rem, 1.05vw + 0.85rem, 1.1875rem)',
              marginLeft: align === 'center' ? 'auto' : align === 'right' ? 'auto' : 0,
              marginRight: align === 'center' ? 'auto' : align === 'left' ? 'auto' : 0,
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </Container>

      <style>{`
        .lp-description-body > :first-child { margin-top: 0; }
        .lp-description-body > :last-child { margin-bottom: 0; }
        .lp-description-body p { margin: 0 0 1.15em; }
        .lp-description-body h1,
        .lp-description-body h2,
        .lp-description-body h3,
        .lp-description-body h4 {
          font-family: var(--lp-heading-font);
          line-height: 1.25;
          margin: 1.6em 0 0.5em;
          font-weight: 500;
        }
        .lp-description-body ul,
        .lp-description-body ol { margin: 0 0 1.15em; padding-left: 1.4em; }
        .lp-description-body li { margin: 0.35em 0; }
        .lp-description-body a {
          color: var(--lp-accent);
          text-decoration: underline;
          text-underline-offset: 0.18em;
        }
        .lp-description-body blockquote {
          margin: 1.5em 0;
          padding-left: 1.1em;
          border-left: 2px solid var(--lp-accent);
          font-style: italic;
          opacity: 0.95;
        }
        .lp-description-body strong { color: var(--lp-text); }
      `}</style>
    </Section>
  )
}
