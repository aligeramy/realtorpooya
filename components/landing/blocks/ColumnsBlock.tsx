'use client'
import React from 'react'
import type { Block, ColumnsProps } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'
import { RenderBlocks } from '../render-blocks'
import { Container } from './_shared'

const ALIGN_MAP: Record<NonNullable<ColumnsProps['verticalAlign']>, string> = {
  top: 'start',
  center: 'center',
  bottom: 'end',
}

export default function ColumnsBlock({ props }: { props: ColumnsProps; block?: Block }) {
  const ctx = useRenderContext()
  const count = props.columns ?? 2
  const gap = typeof props.gap === 'number' ? props.gap : 32
  const alignItems = ALIGN_MAP[props.verticalAlign ?? 'top']
  const stackOnMobile = props.stackOnMobile !== false

  // Reasonable per-column minimum so columns naturally wrap on narrow viewports
  // when stacking is enabled; otherwise keep a strict fixed-count grid.
  const minColWidth = stackOnMobile
    ? `min(100%, ${Math.round(960 / count)}px)`
    : '0'

  const gridTemplateColumns = stackOnMobile
    ? `repeat(auto-fit, minmax(${minColWidth}, 1fr))`
    : `repeat(${count}, minmax(0, 1fr))`

  const columns: Block[][] = Array.from({ length: count }, (_, i) => props.children?.[i] ?? [])

  return (
    <Container style={{ paddingTop: 'clamp(1.5rem, 4vw, 3rem)', paddingBottom: 'clamp(1.5rem, 4vw, 3rem)' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns,
          gap: `${gap}px`,
          alignItems,
          width: '100%',
        }}
      >
        {columns.map((blocks, i) => {
          const isEmpty = !blocks || blocks.length === 0
          return (
            <div
              key={i}
              style={{
                minWidth: 0,
                ...(isEmpty && ctx.editor
                  ? {
                      minHeight: 96,
                      border: '1px dashed rgba(255,255,255,0.18)',
                      borderRadius: 'var(--lp-radius, 8px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255,255,255,0.35)',
                      fontFamily: 'var(--lp-body-font)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }
                  : null),
              }}
            >
              {isEmpty ? (ctx.editor ? `Column ${i + 1}` : null) : <RenderBlocks blocks={blocks} />}
            </div>
          )
        })}
      </div>
    </Container>
  )
}
