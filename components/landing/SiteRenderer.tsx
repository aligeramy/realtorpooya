'use client'
// Renders a full landing-page document: applies theme CSS variables + fonts,
// provides the runtime context (property, agent, registration, register popup),
// and walks the block tree. Used by the public route and the CRM editor preview.
import React from 'react'
import type { SiteDocument } from '@/lib/landing/types'
import type { ResolvedProperty } from '@/lib/landing/resolve'
import { themeToCssVars, googleFontsHref } from '@/lib/landing/theme-css'
import { LandingProvider, type AgentInfo } from './render-context'
import { RenderBlocks } from './render-blocks'

export interface SiteRendererProps {
  document: SiteDocument
  property?: ResolvedProperty | null
  agent?: AgentInfo | null
  editor?: boolean
  apiBase?: string
  pageId?: string
  pageSlug?: string
  pageTitle?: string
  googleMapsKey?: string
}

export function SiteRenderer(p: SiteRendererProps) {
  const doc = p.document
  const vars = themeToCssVars(doc?.theme)
  const fonts = googleFontsHref(doc?.theme)

  return (
    <LandingProvider
      editor={p.editor}
      property={p.property}
      agent={p.agent}
      registration={doc?.registration}
      customData={doc?.customData}
      apiBase={p.apiBase}
      pageId={p.pageId}
      pageSlug={p.pageSlug}
      pageTitle={p.pageTitle}
      googleMapsKey={p.googleMapsKey}
    >
      {fonts ? <link rel="stylesheet" href={fonts} /> : null}
      <div
        className="lp-root"
        style={{ ...(vars as React.CSSProperties), background: 'var(--lp-bg)', color: 'var(--lp-text)', fontFamily: 'var(--lp-body-font)' }}
      >
        <RenderBlocks blocks={doc?.blocks || []} />
      </div>
    </LandingProvider>
  )
}

export default SiteRenderer
