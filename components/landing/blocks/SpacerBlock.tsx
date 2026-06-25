'use client'
import React from 'react'
import type { Block, SpacerProps } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'

export default function SpacerBlock({ props }: { props: SpacerProps; block?: Block }) {
  const ctx = useRenderContext()
  const height = typeof props.height === 'number' && props.height >= 0 ? props.height : 48
  const background = props.background || 'transparent'

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: ctx.editor ? '1px dashed rgba(255,255,255,0.18)' : 'none',
        outlineOffset: ctx.editor ? '-1px' : undefined,
      }}
    >
      {props.showDivider ? (
        <span
          style={{
            display: 'block',
            width: 'min(100%, var(--lp-max-width, 1200px))',
            maxWidth: 'clamp(120px, 60%, 720px)',
            height: '1px',
            background:
              'linear-gradient(90deg, transparent, var(--lp-accent, rgba(255,255,255,0.4)), transparent)',
            opacity: 0.55,
          }}
        />
      ) : null}
    </div>
  )
}
