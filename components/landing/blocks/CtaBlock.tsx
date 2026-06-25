'use client'
import React from 'react'
import type { Block, CtaProps } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'
import { ButtonRow, Container, Eyebrow, Heading } from './_shared'

export default function CtaBlock({ props }: { props: CtaProps; block?: Block }) {
  useRenderContext()

  const align = props.align || 'center'
  const hasImage = Boolean(props.backgroundImage)
  const textAlign: 'left' | 'center' | 'right' =
    align === 'left' ? 'left' : align === 'right' ? 'right' : 'center'
  const flexAlign =
    align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'

  const sectionStyle: React.CSSProperties = {
    position: 'relative',
    background: hasImage
      ? undefined
      : props.background || 'var(--lp-primary)',
    color: props.textColor || 'var(--lp-text)',
    overflow: 'hidden',
  }

  return (
    <section style={sectionStyle}>
      {hasImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            src={props.backgroundImage}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.7))',
              zIndex: 1,
            }}
          />
        </>
      )}

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: 'clamp(3.5rem, 9vw, 7rem) 1.5rem',
        }}
      >
        <Container narrow>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: flexAlign,
              textAlign,
              gap: 'clamp(1rem, 2.5vw, 1.5rem)',
              maxWidth: 720,
              marginLeft: align === 'center' ? 'auto' : undefined,
              marginRight: align === 'center' ? 'auto' : undefined,
            }}
          >
            {props.eyebrow && <Eyebrow>{props.eyebrow}</Eyebrow>}

            {props.heading && (
              <Heading level={2} style={{ margin: 0 }}>
                {props.heading}
              </Heading>
            )}

            {props.subtext && (
              <p
                style={{
                  margin: 0,
                  opacity: 0.85,
                  fontFamily: 'var(--lp-body-font)',
                  fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
                  lineHeight: 1.7,
                  maxWidth: 620,
                }}
              >
                {props.subtext}
              </p>
            )}

            {props.note && (
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
                {props.note}
              </p>
            )}

            {props.buttons && props.buttons.length > 0 && (
              <div style={{ marginTop: '0.75rem', width: '100%' }}>
                <ButtonRow buttons={props.buttons} align={align} size="lg" />
              </div>
            )}
          </div>
        </Container>
      </div>
    </section>
  )
}
