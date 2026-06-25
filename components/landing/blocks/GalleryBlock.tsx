'use client'
import React from 'react'
import type { Block, GalleryProps } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'
import { Section, Heading } from './_shared'

type GalleryImage = { url: string; caption?: string; alt?: string }

export default function GalleryBlock({ props }: { props: GalleryProps; block?: Block }) {
  const ctx = useRenderContext()
  const [selected, setSelected] = React.useState<number | null>(null)

  const images: GalleryImage[] =
    props.images && props.images.length
      ? props.images
      : (ctx.property?.images || []).map((url) => ({ url }))

  const layout = props.layout || 'grid'
  const columns = props.columns || 3
  const showCaptions = !!props.showCaptions
  const lightboxOn = !!props.enableLightbox && !ctx.editor

  const openLightbox = React.useCallback(
    (i: number) => {
      if (lightboxOn) setSelected(i)
    },
    [lightboxOn]
  )
  const close = React.useCallback(() => setSelected(null), [])
  const step = React.useCallback(
    (dir: number) => {
      setSelected((prev) => {
        if (prev === null) return prev
        const next = (prev + dir + images.length) % images.length
        return next
      })
    },
    [images.length]
  )

  React.useEffect(() => {
    if (selected === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [selected, close, step])

  if (!images.length) return null

  const minCol = columns >= 4 ? 200 : columns === 3 ? 260 : 360

  const figureStyle = (interactive: boolean): React.CSSProperties => ({
    margin: 0,
    cursor: interactive ? 'pointer' : 'default',
  })

  const imgStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    aspectRatio: '4 / 3',
    objectFit: 'cover',
    borderRadius: 'var(--lp-radius)',
    border: '1px solid rgba(0,0,0,0.06)',
  }

  const captionStyle: React.CSSProperties = {
    marginTop: 10,
    fontSize: 13,
    letterSpacing: '0.02em',
    color: 'var(--lp-text)',
    opacity: 0.7,
    fontFamily: 'var(--lp-body-font)',
  }

  const renderImg = (img: GalleryImage, i: number) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={img.url} alt={img.alt || img.caption || ''} style={imgStyle} loading="lazy" />
  )

  const renderFigure = (img: GalleryImage, i: number, extra?: React.CSSProperties) => {
    const interactive = lightboxOn
    const content = (
      <figure style={{ ...figureStyle(interactive), ...extra }}>
        {renderImg(img, i)}
        {showCaptions && img.caption ? <figcaption style={captionStyle}>{img.caption}</figcaption> : null}
      </figure>
    )
    if (!interactive) return <div key={i}>{content}</div>
    return (
      <button
        key={i}
        type="button"
        onClick={() => openLightbox(i)}
        aria-label={img.alt || img.caption || `View image ${i + 1}`}
        style={{ display: 'block', padding: 0, border: 'none', background: 'none', textAlign: 'left', width: '100%', cursor: 'pointer' }}
      >
        {content}
      </button>
    )
  }

  return (
    <Section id={props.anchorId} background="#ffffff">
      {props.heading ? (
        <Heading level={2} style={{ marginBottom: 'clamp(28px, 4vw, 48px)', textAlign: 'center' }}>
          {props.heading}
        </Heading>
      ) : null}

      {layout === 'carousel' ? (
        <div
          style={{
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            paddingBottom: 8,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {images.map((img, i) => (
            <div key={i} style={{ flex: '0 0 auto', width: 'min(78vw, 460px)', scrollSnapAlign: 'start' }}>
              <Reveal index={i} disabled={ctx.editor}>{renderFigure(img, i)}</Reveal>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(${minCol}px, 1fr))`,
            gap: 'clamp(8px, 1vw, 12px)',
            alignItems: 'start',
          }}
        >
          {images.map((img, i) => <Reveal key={i} index={i} disabled={ctx.editor}>{renderFigure(img, i)}</Reveal>)}
        </div>
      )}

      {selected !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(16px, 4vw, 56px)',
          }}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            style={lightboxBtn({ top: 'clamp(16px, 3vw, 32px)', right: 'clamp(16px, 3vw, 32px)' })}
          >
            ×
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(-1) }}
                aria-label="Previous image"
                style={lightboxBtn({ left: 'clamp(12px, 3vw, 32px)', top: '50%', transform: 'translateY(-50%)' })}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(1) }}
                aria-label="Next image"
                style={lightboxBtn({ right: 'clamp(12px, 3vw, 32px)', top: '50%', transform: 'translateY(-50%)' })}
              >
                ›
              </button>
            </>
          ) : null}

          <figure onClick={(e) => e.stopPropagation()} style={{ margin: 0, maxWidth: '100%', maxHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[selected].url}
              alt={images[selected].alt || images[selected].caption || ''}
              style={{ maxWidth: '100%', maxHeight: '82vh', objectFit: 'contain', borderRadius: 'var(--lp-radius)' }}
            />
            {showCaptions && images[selected].caption ? (
              <figcaption style={{ color: 'var(--lp-text)', opacity: 0.8, fontSize: 14, textAlign: 'center', fontFamily: 'var(--lp-body-font)' }}>
                {images[selected].caption}
              </figcaption>
            ) : null}
          </figure>
        </div>
      ) : null}
    </Section>
  )
}

/** Fades + slides each item up as it scrolls into view, with a staggered cascade. */
function Reveal({ index, disabled, children }: { index: number; disabled?: boolean; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [shown, setShown] = React.useState(false)
  React.useEffect(() => {
    if (disabled) { setShown(true); return }
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setShown(true); return }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect() } })
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [disabled])
  const delay = (index % 4) * 85
  return (
    <div ref={ref} style={{ opacity: shown ? 1 : 0, transform: shown ? 'none' : 'translateY(30px)', transition: `opacity .8s cubic-bezier(.22,.61,.36,1) ${delay}ms, transform .8s cubic-bezier(.22,.61,.36,1) ${delay}ms`, willChange: 'opacity, transform' }}>
      {children}
    </div>
  )
}

function lightboxBtn(pos: React.CSSProperties): React.CSSProperties {
  return {
    position: 'absolute',
    zIndex: 1001,
    width: 52,
    height: 52,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.25)',
    background: 'rgba(0,0,0,0.4)',
    color: 'var(--lp-text)',
    fontSize: 28,
    lineHeight: 1,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--lp-body-font)',
    ...pos,
  }
}
