'use client'
import React from 'react'
import type { Block, ImageProps } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'
import { Section } from './_shared'

function widthPercent(width: ImageProps['width']): string {
  if (typeof width === 'number') {
    const clamped = Math.max(5, Math.min(100, width))
    return `${clamped}%`
  }
  switch (width) {
    case 'large':
      return '80%'
    case 'medium':
      return '60%'
    case 'small':
      return '40%'
    case 'full':
    default:
      return '100%'
  }
}

export default function ImageBlock({ props }: { props: ImageProps; block?: Block }) {
  const ctx = useRenderContext()
  const url = props.url || ''
  const align = props.align || 'center'
  const w = widthPercent(props.width ?? 'full')
  const aspect = props.aspect && props.aspect !== 'auto' ? props.aspect : undefined
  const radius = typeof props.rounded === 'number' ? props.rounded : props.rounded ? 16 : 0

  const textAlign: React.CSSProperties['textAlign'] =
    align === 'left' ? 'left' : align === 'right' ? 'right' : 'center'

  const marginLeft = align === 'left' ? 0 : 'auto'
  const marginRight = align === 'right' ? 0 : 'auto'

  const imgStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    height: aspect ? '100%' : 'auto',
    aspectRatio: aspect,
    objectFit: 'cover',
    borderRadius: radius,
    border: '1px solid rgba(255,255,255,0.06)',
  }

  // Placeholder for the editor when no image is set.
  if (!url) {
    if (!ctx.editor) return null
    return (
      <Section padded={false} style={{ paddingTop: 'clamp(20px, 3vw, 36px)', paddingBottom: 'clamp(20px, 3vw, 36px)' }}>
        <div style={{ textAlign }}>
          <div
            style={{
              width: w,
              marginLeft,
              marginRight,
              aspectRatio: aspect || '16 / 9',
              borderRadius: radius || 16,
              border: '1px dashed rgba(255,255,255,0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.45)',
              fontFamily: 'var(--lp-body-font)',
              fontSize: 13,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Image
          </div>
        </div>
      </Section>
    )
  }

  // eslint-disable-next-line @next/next/no-img-element
  const img = <img src={url} alt={props.alt || ''} style={imgStyle} loading="lazy" />

  const link = props.link
  let media: React.ReactNode = img

  if (link && !ctx.editor) {
    if (link.action === 'link' && link.href) {
      media = (
        <a
          href={link.href}
          target={link.newTab || link.target === '_blank' ? '_blank' : undefined}
          rel={link.newTab || link.target === '_blank' ? 'noopener noreferrer' : undefined}
          style={{ display: 'block', width: '100%', cursor: 'pointer' }}
        >
          {img}
        </a>
      )
    } else if (link.action === 'register') {
      media = (
        <button
          type="button"
          onClick={() => ctx.openRegister('image')}
          style={{
            display: 'block',
            width: '100%',
            padding: 0,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
          }}
          aria-label={link.label || props.alt || 'Register'}
        >
          {img}
        </button>
      )
    } else if (link.action === 'phone' && link.phone) {
      media = (
        <a href={`tel:${link.phone}`} style={{ display: 'block', width: '100%', cursor: 'pointer' }}>
          {img}
        </a>
      )
    } else if (link.action === 'email' && link.email) {
      media = (
        <a href={`mailto:${link.email}`} style={{ display: 'block', width: '100%', cursor: 'pointer' }}>
          {img}
        </a>
      )
    } else if (link.action === 'scroll' && link.href) {
      media = (
        <a href={link.href.startsWith('#') ? link.href : `#${link.href}`} style={{ display: 'block', width: '100%', cursor: 'pointer' }}>
          {img}
        </a>
      )
    }
  }

  return (
    <Section padded={false} style={{ paddingTop: 'clamp(20px, 3vw, 36px)', paddingBottom: 'clamp(20px, 3vw, 36px)' }}>
      <figure style={{ margin: 0, textAlign }}>
        <div style={{ width: w, marginLeft, marginRight, overflow: 'hidden', borderRadius: radius }}>
          {media}
        </div>
        {props.caption ? (
          <figcaption
            style={{
              width: w,
              marginLeft,
              marginRight,
              marginTop: 12,
              fontFamily: 'var(--lp-body-font)',
              fontSize: 13,
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.55)',
              textAlign,
            }}
          >
            {props.caption}
          </figcaption>
        ) : null}
      </figure>
    </Section>
  )
}
