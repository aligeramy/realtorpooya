'use client'
import React from 'react'
import type { Block, ButtonProps } from '@/lib/landing/types'
import { CtaButtonView } from './_shared'

export default function ButtonBlock({ props }: { props: ButtonProps; block?: Block }) {
  if (!props.button || !props.button.label) return null

  return (
    <div
      style={{
        textAlign: (props.align as React.CSSProperties['textAlign']) || 'center',
        paddingTop: 'clamp(16px, 3vw, 32px)',
        paddingBottom: 'clamp(16px, 3vw, 32px)',
        paddingLeft: 24,
        paddingRight: 24,
        fontFamily: 'var(--lp-body-font)',
        color: 'var(--lp-text)',
      }}
    >
      <CtaButtonView button={props.button} size={props.size} fullWidth={props.fullWidth} />
    </div>
  )
}
