'use client'
import React from 'react'
import type { Block, TextProps } from '@/lib/landing/types'
import { toHtml } from '@/lib/landing/richtext'
import { Section } from './_shared'

const SIZE_MAP: Record<string, number> = {
  sm: 15,
  md: 17,
  lg: 20,
}

export default function TextBlock({ props }: { props: TextProps; block?: Block }) {
  const align = props.align || 'left'
  const fontSize = SIZE_MAP[props.size || 'md'] || SIZE_MAP.md
  const maxWidth = props.maxWidth || '70ch'
  const color = props.color || 'var(--lp-text)'
  const html = toHtml(props.content)

  const centered = align === 'center'

  return (
    <Section padded>
      <div
        style={{
          margin: centered ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0',
          maxWidth,
          padding: 'clamp(8px, 2vw, 16px) 0',
          textAlign: align as React.CSSProperties['textAlign'],
          color,
          fontFamily: 'var(--lp-body-font)',
          fontSize: `clamp(${Math.max(fontSize - 1, 13)}px, ${fontSize / 16}rem, ${fontSize}px)`,
          lineHeight: 1.7,
          wordBreak: 'break-word',
        }}
        className="lp-text-block"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Section>
  )
}
