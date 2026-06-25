'use client'
import React from 'react'
import type { Block, AgentProps } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'
import { Section, Eyebrow, Heading } from './_shared'

export default function AgentBlock({ props }: { props: AgentProps; block?: Block }) {
  const ctx = useRenderContext()
  const useAgent = props.source !== 'custom' && !!ctx.agent
  const a = useAgent ? ctx.agent : null

  const name = props.name || a?.name || ''
  const title = props.title || a?.title || ''
  const brokerage = props.brokerage || a?.brokerage || ''
  const phone = props.phone || a?.phone || ''
  const email = props.email || a?.email || ''
  const photo = props.photo || a?.photoUrl || ''
  const bio = props.bio || a?.bio || ''

  if (!name && !photo && !bio && !phone && !email) return null

  const inert = ctx.editor
  const sub = [title, brokerage].filter(Boolean).join(' · ')

  const linkStyle: React.CSSProperties = {
    color: '#f3efe6',
    textDecoration: 'none',
    fontFamily: 'var(--lp-body-font)',
    fontSize: 'clamp(15px, 1.5vw, 17px)',
    letterSpacing: '0.01em',
    transition: 'color 0.2s ease',
    pointerEvents: inert ? 'none' : 'auto',
    borderBottom: '1px solid rgba(255,255,255,0.18)',
    paddingBottom: 2,
  }

  return (
    <Section background="var(--lp-primary)">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: photo ? 'minmax(220px, 360px) 1fr' : '1fr',
          gap: 'clamp(32px, 5vw, 72px)',
          alignItems: 'center',
          color: '#f3efe6',
        }}
      >
        {photo && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 360,
              aspectRatio: '4 / 5',
              borderRadius: 'var(--lp-radius)',
              overflow: 'hidden',
              boxShadow: '0 30px 70px rgba(0,0,0,0.45)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt={name || 'Agent'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Eyebrow>Your Agent</Eyebrow>
          {name && <Heading level={2}>{name}</Heading>}

          {sub && (
            <div
              style={{
                marginTop: 12,
                fontFamily: 'var(--lp-body-font)',
                fontSize: 'clamp(14px, 1.4vw, 16px)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                opacity: 0.6,
              }}
            >
              {sub}
            </div>
          )}

          {bio && (
            <p
              style={{
                marginTop: 24,
                marginBottom: 0,
                fontFamily: 'var(--lp-body-font)',
                fontSize: 'clamp(15px, 1.5vw, 18px)',
                lineHeight: 1.75,
                opacity: 0.82,
                maxWidth: 620,
              }}
            >
              {bio}
            </p>
          )}

          {(phone || email) && (
            <div
              style={{
                marginTop: 32,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'clamp(20px, 3vw, 40px)',
              }}
            >
              {phone && (
                <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} style={linkStyle}>
                  {phone}
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} style={linkStyle}>
                  {email}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}
