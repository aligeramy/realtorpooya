'use client'
import React from 'react'
import type { Block, NavbarProps } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'
import { CtaButtonView } from './_shared'

export default function NavbarBlock({ props }: { props: NavbarProps; block?: Block }) {
  const ctx = useRenderContext()
  const links = props.links || []
  const transparent = !!props.transparentOnTop
  const sticky = props.sticky !== false

  const background = transparent
    ? 'transparent'
    : props.background || 'var(--lp-primary)'

  return (
    <header
      style={{
        position: sticky ? 'sticky' : 'relative',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background,
        borderBottom: transparent ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)',
        backdropFilter: transparent ? 'none' : 'saturate(140%) blur(6px)',
        WebkitBackdropFilter: transparent ? 'none' : 'saturate(140%) blur(6px)',
      }}
    >
      {transparent && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0))',
          }}
        />
      )}

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 'var(--lp-max-width)',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 24,
          paddingRight: 24,
          minHeight: 72,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        {/* Logo */}
        <a
          href="#top"
          onClick={ctx.editor ? (e) => e.preventDefault() : undefined}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'var(--lp-text)',
            flexShrink: 0,
            marginRight: 'auto',
          }}
        >
          {props.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={props.logo}
              alt={ctx.pageTitle || 'Logo'}
              style={{ height: 28, width: 'auto', display: 'block' }}
            />
          ) : (
            <span
              style={{
                fontFamily: 'var(--lp-heading-font)',
                fontSize: 'clamp(20px, 2.4vw, 26px)',
                letterSpacing: '0.02em',
                color: 'var(--lp-text)',
              }}
            >
              {ctx.pageTitle || 'Logo'}
            </span>
          )}
        </a>

        {/* Links */}
        {links.length > 0 && (
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 'clamp(16px, 2.4vw, 32px)',
            }}
          >
            {links.map((link, i) => (
              <a
                key={`${link.href}-${i}`}
                href={link.href}
                onClick={ctx.editor ? (e) => e.preventDefault() : undefined}
                style={{
                  fontFamily: 'var(--lp-body-font)',
                  fontSize: 12.5,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--lp-text)',
                  opacity: 0.82,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'opacity 160ms ease, color 160ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1'
                  e.currentTarget.style.color = 'var(--lp-accent)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.82'
                  e.currentTarget.style.color = 'var(--lp-text)'
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* CTA */}
        {props.button && (
          <div style={{ flexShrink: 0 }}>
            <CtaButtonView button={props.button} size="sm" />
          </div>
        )}
      </div>
    </header>
  )
}
