'use client'
import React from 'react'
import type { Block, VideoProps } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'
import { Section, Container, Heading } from './_shared'

const ASPECT_MAP: Record<string, string> = {
  '16:9': '16 / 9',
  '4:3': '4 / 3',
  '21:9': '21 / 9',
}

function extractYouTubeId(url: string): string | null {
  try {
    const patterns = [
      /[?&]v=([^&]+)/,
      /youtu\.be\/([^?&/]+)/,
      /\/embed\/([^?&/]+)/,
      /\/shorts\/([^?&/]+)/,
    ]
    for (const p of patterns) {
      const m = url.match(p)
      if (m && m[1]) return m[1]
    }
  } catch {
    /* noop */
  }
  return null
}

function extractVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return m ? m[1] : null
}

export default function VideoBlock({ props }: { props: VideoProps; block?: Block }) {
  const ctx = useRenderContext()
  const url = props.url || ctx.property?.youtubeVideo || ''
  const aspect = ASPECT_MAP[props.aspect || '16:9'] || ASPECT_MAP['16:9']

  // Determine provider — fall back to detecting youtube/vimeo from the url.
  let provider = props.provider
  if (!provider) {
    if (/youtube\.com|youtu\.be/.test(url)) provider = 'youtube'
    else if (/vimeo\.com/.test(url)) provider = 'vimeo'
    else provider = 'file'
  }

  if (!url) {
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
              Add a video URL to display the video here.
            </div>
          </Container>
        </Section>
      )
    }
    return null
  }

  let embedSrc: string | null = null
  if (provider === 'youtube') {
    const id = extractYouTubeId(url)
    if (id) {
      const params = new URLSearchParams({
        rel: '0',
        modestbranding: '1',
        playsinline: '1',
      })
      if (props.autoplay) {
        params.set('autoplay', '1')
        params.set('mute', '1')
      }
      embedSrc = `https://www.youtube.com/embed/${id}?${params.toString()}`
    }
  } else if (provider === 'vimeo') {
    const id = extractVimeoId(url)
    if (id) {
      const params = new URLSearchParams()
      if (props.autoplay) {
        params.set('autoplay', '1')
        params.set('muted', '1')
      }
      const q = params.toString()
      embedSrc = `https://player.vimeo.com/video/${id}${q ? `?${q}` : ''}`
    }
  }

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

  const mediaStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    border: 'none',
    display: 'block',
    objectFit: 'cover',
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
          {provider === 'file' ? (
            <video
              src={url}
              poster={props.poster}
              controls={!ctx.editor}
              autoPlay={props.autoplay && !ctx.editor}
              muted={props.autoplay}
              loop={props.autoplay}
              playsInline
              preload="metadata"
              style={mediaStyle}
            />
          ) : embedSrc ? (
            <iframe
              src={embedSrc}
              title={props.heading || 'Video'}
              style={{ ...mediaStyle, pointerEvents: ctx.editor ? 'none' : 'auto' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--lp-text)',
                opacity: 0.6,
                fontFamily: 'var(--lp-body-font)',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              Unable to load video.
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}
