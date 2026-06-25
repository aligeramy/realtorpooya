'use client'
import React from 'react'
import type { Block, FooterProps } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'
import { Container } from './_shared'

export default function FooterBlock({ props }: { props: FooterProps; block?: Block }) {
  const ctx = useRenderContext()
  const agent = props.showAgent ? ctx.agent : null

  const linkStyle: React.CSSProperties = {
    color: '#f3efe6',
    opacity: 0.72,
    textDecoration: 'none',
    fontSize: 14,
    fontFamily: 'var(--lp-body-font)',
    letterSpacing: '0.04em',
    transition: 'opacity .2s ease',
  }

  const contactLinkStyle: React.CSSProperties = {
    ...linkStyle,
    opacity: 0.85,
  }

  return (
    <footer
      style={{
        background: 'var(--lp-primary)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        color: '#f3efe6',
        fontFamily: 'var(--lp-body-font)',
        paddingTop: 'clamp(40px, 5vw, 72px)',
        paddingBottom: 'clamp(28px, 3vw, 40px)',
      }}
    >
      <Container>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(28px, 4vw, 64px)',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingBottom: 'clamp(28px, 4vw, 48px)',
          }}
        >
          {/* Brand / logo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 200 }}>
            {props.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={props.logo}
                alt=""
                style={{ height: 40, width: 'auto', objectFit: 'contain' }}
              />
            ) : (
              <div
                style={{
                  fontFamily: 'var(--lp-heading-font)',
                  fontSize: 'clamp(22px, 2.6vw, 30px)',
                  fontWeight: 400,
                  letterSpacing: '0.02em',
                }}
              >
                {ctx.pageTitle || ctx.property?.address || 'Residences'}
              </div>
            )}
            {ctx.property?.cityProvince && (
              <div style={{ fontSize: 13, opacity: 0.55, letterSpacing: '0.04em' }}>
                {ctx.property.cityProvince}
              </div>
            )}
          </div>

          {/* Agent */}
          {agent && (agent.name || agent.phone || agent.email) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 200 }}>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--lp-accent)',
                  marginBottom: 4,
                }}
              >
                Contact
              </div>
              {agent.name && (
                <div style={{ fontFamily: 'var(--lp-heading-font)', fontSize: 19 }}>
                  {agent.name}
                </div>
              )}
              {(agent.title || agent.brokerage) && (
                <div style={{ fontSize: 13, opacity: 0.55 }}>
                  {[agent.title, agent.brokerage].filter(Boolean).join(' · ')}
                </div>
              )}
              {agent.phone && (
                <a href={`tel:${agent.phone}`} style={contactLinkStyle}>
                  {agent.phone}
                </a>
              )}
              {agent.email && (
                <a href={`mailto:${agent.email}`} style={contactLinkStyle}>
                  {agent.email}
                </a>
              )}
            </div>
          )}

          {/* Links */}
          {props.links && props.links.length > 0 && (
            <nav
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                minWidth: 160,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--lp-accent)',
                  marginBottom: 4,
                }}
              >
                Explore
              </div>
              {props.links.map((link, i) => (
                <a
                  key={i}
                  href={ctx.editor ? undefined : link.href || '#'}
                  style={linkStyle}
                  onClick={ctx.editor ? (e) => e.preventDefault() : undefined}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>

        {/* Fine print */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: 'clamp(18px, 2.5vw, 28px)',
            fontSize: 12,
            lineHeight: 1.7,
            opacity: 0.5,
            letterSpacing: '0.03em',
            maxWidth: 760,
          }}
        >
          {props.fineprint || ''}
        </div>
      </Container>
    </footer>
  )
}
