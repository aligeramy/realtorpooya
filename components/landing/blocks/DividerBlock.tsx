'use client'
import React from 'react'
import type { Block, DividerProps } from '@/lib/landing/types'
import { Container } from './_shared'

export default function DividerBlock({ props }: { props: DividerProps; block?: Block }) {
  const style = props.style || 'solid'
  const color = props.color || 'rgba(255,255,255,0.15)'
  const thickness = typeof props.thickness === 'number' ? props.thickness : 1
  const spacing = typeof props.spacing === 'number' ? props.spacing : 48

  return (
    <Container>
      <div
        role="separator"
        aria-orientation="horizontal"
        style={{
          margin: `${spacing}px 0`,
          borderTop: `${thickness}px ${style} ${color}`,
          width: '100%',
        }}
      />
    </Container>
  )
}
