'use client'
import React, { useEffect, useState } from 'react'
import type { Block, NavbarProps } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'
import { CtaButtonView } from './_shared'

export default function NavbarBlock({ props }: { props: NavbarProps; block?: Block }) {
  const ctx = useRenderContext()
  const links = props.links || []
  const transparent = !!props.transparentOnTop
  const sticky = props.sticky !== false
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (ctx.editor) return
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const mq = window.matchMedia('(max-width: 820px)')
    const onMq = () => setIsMobile(mq.matches)
    onMq()
    mq.addEventListener('change', onMq)
    return () => { window.removeEventListener('scroll', onScroll); mq.removeEventListener('change', onMq) }
  }, [ctx.editor])

  const solid = !transparent || scrolled
  const bg = solid ? (props.background || 'var(--lp-primary)') : 'transparent'
  const editorPrevent = ctx.editor ? (e: React.MouseEvent) => e.preventDefault() : undefined

  const Logo = props.logo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={props.logo} alt={ctx.pageTitle || 'Logo'} style={{ height: 30, width: 'auto', display: 'block' }} />
  ) : (
    <span style={{ fontFamily: 'var(--lp-heading-font)', fontSize: 'clamp(17px, 2.2vw, 23px)', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff' }}>
      {ctx.pageTitle || 'Logo'}
    </span>
  )

  const linkStyle: React.CSSProperties = {
    fontFamily: 'var(--lp-body-font)', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.85)', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color .2s ease',
  }

  return (
    <header
      style={{
        // Transparent navbars OVERLAY the hero (fixed) so the white text sits on the
        // dark hero, not on the cream page background above it.
        position: transparent ? 'fixed' : (sticky ? 'sticky' : 'relative'),
        top: 0, left: 0, right: 0, zIndex: 50, background: bg,
        transition: 'background .3s ease, border-color .3s ease',
        borderBottom: solid ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
      }}
    >
      {!solid && (
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0))' }} />
      )}
      <div style={{ position: 'relative', width: '100%', maxWidth: 'var(--lp-max-width)', margin: '0 auto', padding: '0 24px', minHeight: 72, display: 'flex', alignItems: 'center', gap: 24 }}>
        <a href="#top" onClick={editorPrevent} style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', marginRight: 'auto' }}>{Logo}</a>

        {!isMobile && (
          <>
            {links.length > 0 && (
              <nav style={{ display: 'flex', alignItems: 'center', gap: 'clamp(18px, 2.4vw, 34px)' }}>
                {links.map((l, i) => (
                  <a key={`${l.href}-${i}`} href={l.href} onClick={editorPrevent} style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lp-accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}>
                    {l.label}
                  </a>
                ))}
              </nav>
            )}
            {props.button && <CtaButtonView button={props.button} size="sm" />}
          </>
        )}

        {isMobile && (
          <button aria-label="Open menu" onClick={() => !ctx.editor && setOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[0, 1, 2].map((i) => <span key={i} style={{ display: 'block', width: 24, height: 2, background: '#fff' }} />)}
          </button>
        )}
      </div>

      {isMobile && open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'var(--lp-primary)', display: 'flex', flexDirection: 'column', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--lp-heading-font)', color: '#fff', letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: 18 }}>{ctx.pageTitle || 'Menu'}</span>
            <button aria-label="Close menu" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 30, lineHeight: 1, cursor: 'pointer' }}>×</button>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 26, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            {links.map((l, i) => (
              <a key={`${l.href}-${i}`} href={l.href} onClick={() => setOpen(false)} style={{ ...linkStyle, fontSize: 16 }}>{l.label}</a>
            ))}
            {props.button && <div onClick={() => setOpen(false)}><CtaButtonView button={props.button} size="lg" /></div>}
          </nav>
        </div>
      )}
    </header>
  )
}
