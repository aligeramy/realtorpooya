'use client'
// ────────────────────────────────────────────────────────────────────────
// Shared runtime context for all landing-page blocks. Holds the resolved
// property, agent, registration config and the global "Register Here" popup.
// `editor: true` makes interactive elements inert (the CRM canvas selects
// instead of navigating/submitting).
// ────────────────────────────────────────────────────────────────────────
import React, { createContext, useCallback, useContext, useState } from 'react'
import type { RegistrationConfig, CustomData } from '@/lib/landing/types'
import { DEFAULT_REGISTRATION } from '@/lib/landing/types'
import type { ResolvedProperty } from '@/lib/landing/resolve'
import { RegisterModal } from './RegisterModal'

export interface AgentInfo {
  id?: string
  name?: string
  title?: string
  phone?: string
  email?: string
  photoUrl?: string
  bio?: string
  brokerage?: string
}

export interface RenderContextValue {
  editor: boolean
  property: ResolvedProperty | null
  agent: AgentInfo | null
  registration: RegistrationConfig
  customData: CustomData
  apiBase: string
  pageId?: string
  pageSlug?: string
  pageTitle?: string
  googleMapsKey?: string
  openRegister: (source?: string) => void
}

const FALLBACK: RenderContextValue = {
  editor: false,
  property: null,
  agent: null,
  registration: DEFAULT_REGISTRATION,
  customData: {},
  apiBase: '',
  openRegister: () => {},
}

const Ctx = createContext<RenderContextValue>(FALLBACK)

export function useRenderContext(): RenderContextValue {
  return useContext(Ctx)
}

export interface LandingProviderProps {
  editor?: boolean
  property?: ResolvedProperty | null
  agent?: AgentInfo | null
  registration?: RegistrationConfig | null
  customData?: CustomData | null
  apiBase?: string
  pageId?: string
  pageSlug?: string
  pageTitle?: string
  googleMapsKey?: string
  children: React.ReactNode
}

export function LandingProvider(props: LandingProviderProps) {
  const [open, setOpen] = useState(false)
  const [source, setSource] = useState<string | undefined>(undefined)
  const editor = !!props.editor

  const openRegister = useCallback((s?: string) => {
    if (editor) return
    setSource(s)
    setOpen(true)
  }, [editor])

  const value: RenderContextValue = {
    editor,
    property: props.property || null,
    agent: props.agent || null,
    registration: { ...DEFAULT_REGISTRATION, ...(props.registration || {}) },
    customData: props.customData || {},
    apiBase: props.apiBase || '',
    pageId: props.pageId,
    pageSlug: props.pageSlug,
    pageTitle: props.pageTitle,
    googleMapsKey: props.googleMapsKey,
    openRegister,
  }

  return (
    <Ctx.Provider value={value}>
      {props.children}
      <RegisterModal open={open} source={source} onClose={() => setOpen(false)} />
    </Ctx.Provider>
  )
}
