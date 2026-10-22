'use client'
import React from 'react'
import type { Block, MatterportProps } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'
import { Section, Container, Heading } from './_shared'

const ASPECT_MAP: Record<string, string> = {
  '16:9': '16 / 9',
  '4:3': '4 / 3',
  '21:9': '21 / 9',
}

/** Accepts a full share/embed URL (https://my.matterport.com/show/?m=<id>&...) or a bare model id. */
export function extractMatterportId(url: string): string | null {
  const trimmed = (url || '').trim()
  if (!trimmed) return null
  const m = trimmed.match(/[?&]m=([A-Za-z0-9]+)/)
  if (m && m[1]) return m[1]
  if (/^[A-Za-z0-9]{8,}$/.test(trimmed)) return trimmed
  return null
}

export default function MatterportBlock({ props }: { props: MatterportProps; block?: Block }) {
  const ctx = useRenderContext()
  const url = props.url || ctx.property?.matterportUrl || ''
  const aspect = ASPECT_MAP[props.aspect || '16:9'] || ASPECT_MAP['16:9']
  const modelId = extractMatterportId(url)

  if (!modelId) {
    if (ctx.editor) {
      return (
        <Section>
          <Container>
            <div
              style={{
                border: '1px dashed rgba(255,255,255,0.22)',
                borderRadius: 'var(--lp-radius)',
                padding: 'clamp(2rem, 5vw, 3.5rem)',
                textAlign: 'center',
                color: 'var(--lp-text)',
                opacity: 0.7,
                fontFamily: 'var(--lp-body-font)',
                fontSize: 'clamp(0.85rem, 1.6vw, 1rem)',
                letterSpacing: '0.02em',
              }}
            >
              Add a Matterport URL to display the 3D tour here.
            </div>
          </Container>
        </Section>
      )
    }
    return null
  }

  const params = new URLSearchParams({ m: modelId })
  if (props.autoplay) params.set('play', '1')
  if (props.hideBranding) params.set('brand', '0')
  const embedSrc = `https://my.matterport.com/show/?${params.toString()}`

  const frameStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    aspectRatio: aspect,
    overflow: 'hidden',
    borderRadius: 'var(--lp-radius)',
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
  }

  return (
    <Section>
      <Container>
        {props.heading ? (
          <Heading
            level={2}
            style={{ textAlign: 'center', marginBottom: 'clamp(1.75rem, 4vw, 2.75rem)' }}
          >
            {props.heading}
          </Heading>
        ) : null}

        <div style={frameStyle}>
          <iframe
            src={embedSrc}
            title={props.heading || '3D Virtual Tour'}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
              pointerEvents: ctx.editor ? 'none' : 'auto',
            }}
            allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </Container>
    </Section>
  )
}
