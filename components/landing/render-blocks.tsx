'use client'
import React from 'react'
import type { Block } from '@/lib/landing/types'
import { BLOCK_REGISTRY } from './registry'

export function RenderBlock({ block }: { block: Block }) {
  const Comp = BLOCK_REGISTRY[block.type as keyof typeof BLOCK_REGISTRY]
  if (!Comp) return null
  const C = Comp as React.ComponentType<{ props: any; block?: Block }>
  return <C props={block.props} block={block} />
}

export function RenderBlocks({ blocks }: { blocks: Block[] }) {
  const ordered = [...(blocks || [])].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
  return <>{ordered.map((b) => <RenderBlock key={b.id} block={b} />)}</>
}
