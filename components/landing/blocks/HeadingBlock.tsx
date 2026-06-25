'use client'
import React from 'react'
import type { Block, HeadingProps } from '@/lib/landing/types'
import { Section, Eyebrow } from './_shared'

const SIZE_MAP: Record<string, string> = {
  sm: 'clamp(18px, 2vw, 24px)',
  md: 'clamp(22px, 3vw, 32px)',
  lg: 'clamp(26px, 3.6vw, 40px)',
  xl: 'clamp(30px, 4.4vw, 52px)',
  '2xl': 'clamp(36px, 5.6vw, 66px)',
  '3xl': 'clamp(44px, 7vw, 86px)',
}

const LEVEL_DEFAULT: Record<number, string> = {
  1: 'clamp(40px, 7vw, 86px)',
  2: 'clamp(30px, 4.4vw, 52px)',
  3: 'clamp(22px, 3vw, 34px)',
  4: 'clamp(18px, 2vw, 24px)',
}

export default function HeadingBlock({ props }: { props: HeadingProps; block?: Block }) {
  const { text, eyebrow, color, maxWidth } = props
  const level = (props.level ?? 2) as 1 | 2 | 3 | 4
  const align = props.align ?? 'left'
  const Tag = (`h${level}`) as any

  if (!text && !eyebrow) return null

  const fontSize = props.size ? SIZE_MAP[props.size] : LEVEL_DEFAULT[level]

  const blockStyle: React.CSSProperties = {
    maxWidth: maxWidth ? maxWidth : undefined,
    marginLeft: align === 'center' ? 'auto' : align === 'right' ? 'auto' : undefined,
    marginRight: align === 'center' ? 'auto' : undefined,
    textAlign: align,
  }

  return (
    <Section padded={false} style={{ paddingTop: 'clamp(20px, 3vw, 40px)', paddingBottom: 'clamp(20px, 3vw, 40px)' }}>
      <div style={blockStyle}>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        {text ? (
          <Tag
            style={{
              fontFamily: 'var(--lp-heading-font)',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '0.01em',
              fontSize,
              color: color || 'inherit',
              margin: 0,
            }}
          >
            {text}
          </Tag>
        ) : null}
      </div>
    </Section>
  )
}
