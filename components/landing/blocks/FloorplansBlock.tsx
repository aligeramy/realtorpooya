'use client'
import React from 'react'
import type { Block, FloorplansProps } from '@/lib/landing/types'
import { useRenderContext } from '../render-context'
import { Section, Eyebrow, Heading } from './_shared'

type Plan = { label?: string; image?: string; sqft?: string | number }

export default function FloorplansBlock({ props }: { props: FloorplansProps; block?: Block }) {
  const ctx = useRenderContext()
  const plans = ((props.plans || []) as Plan[]).filter((p) => p && (p.image || p.label))
  const layout = props.layout === 'tabs' ? 'tabs' : 'grid'

  const [active, setActive] = React.useState(0)

  if (!plans.length) {
    if (!ctx.editor) return null
    return (
      <Section background="var(--lp-primary)">
        <Eyebrow>Floor Plans</Eyebrow>
        <p
          style={{
            fontFamily: 'var(--lp-body-font)',
            color: 'var(--lp-text)',
            opacity: 0.55,
            fontSize: 15,
            marginTop: 12,
          }}
        >
          Add floor plans to display them here.
        </p>
      </Section>
    )
  }

  const activeIndex = Math.min(Math.max(active, 0), plans.length - 1)
  const surface = 'rgba(255, 255, 255, 0.04)'
  const border = '1px solid rgba(255, 255, 255, 0.1)'

  const formatSqft = (sqft?: string | number) => {
    if (sqft == null || sqft === '') return null
    const s = String(sqft).trim()
    return /sq|ft|m²|sqft/i.test(s) ? s : `${s} sq ft`
  }

  return (
    <Section background="var(--lp-primary)">
      <Eyebrow>Floor Plans</Eyebrow>
      {props.heading ? (
        <Heading level={2} style={{ marginBottom: 'clamp(28px, 4vw, 48px)', maxWidth: 760 }}>
          {props.heading}
        </Heading>
      ) : (
        <div style={{ height: 'clamp(20px, 3vw, 36px)' }} />
      )}

      {layout === 'tabs' ? (
        <div>
          <div
            role="tablist"
            aria-label="Floor plans"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              marginBottom: 'clamp(24px, 3vw, 36px)',
            }}
          >
            {plans.map((plan, i) => {
              const selected = i === activeIndex
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  tabIndex={ctx.editor ? -1 : 0}
                  onClick={ctx.editor ? undefined : () => setActive(i)}
                  style={{
                    appearance: 'none',
                    cursor: ctx.editor ? 'default' : 'pointer',
                    fontFamily: 'var(--lp-body-font)',
                    fontSize: 13,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '12px 22px',
                    borderRadius: 'var(--lp-radius)',
                    border: selected ? '1px solid var(--lp-accent)' : border,
                    background: selected ? 'var(--lp-accent)' : 'transparent',
                    color: selected ? 'var(--lp-primary)' : 'var(--lp-text)',
                    opacity: selected ? 1 : 0.75,
                    transition: 'all 0.25s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {plan.label || `Plan ${i + 1}`}
                </button>
              )
            })}
          </div>

          <figure
            role="tabpanel"
            style={{
              margin: 0,
              borderRadius: 'var(--lp-radius)',
              border,
              background: surface,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(20px, 4vw, 56px)',
                minHeight: 'clamp(280px, 50vw, 560px)',
              }}
            >
              {plans[activeIndex].image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={plans[activeIndex].label || `Floor plan ${activeIndex + 1}`}
                  src={plans[activeIndex].image}
                  style={{
                    maxWidth: '100%',
                    maxHeight: 'clamp(320px, 60vh, 640px)',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              ) : (
                <span style={{ fontFamily: 'var(--lp-body-font)', color: 'var(--lp-text)', opacity: 0.5 }}>
                  {plans[activeIndex].label || 'Floor plan'}
                </span>
              )}
            </div>
            {(plans[activeIndex].label || formatSqft(plans[activeIndex].sqft)) && (
              <figcaption
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: 'clamp(16px, 2.5vw, 24px) clamp(20px, 3vw, 32px)',
                  borderTop: border,
                  fontFamily: 'var(--lp-body-font)',
                  color: 'var(--lp-text)',
                }}
              >
                <span style={{ fontFamily: 'var(--lp-heading-font)', fontSize: 'clamp(18px, 2vw, 22px)' }}>
                  {plans[activeIndex].label || `Plan ${activeIndex + 1}`}
                </span>
                {formatSqft(plans[activeIndex].sqft) ? (
                  <span style={{ color: 'var(--lp-accent)', fontSize: 14, letterSpacing: '0.04em' }}>
                    {formatSqft(plans[activeIndex].sqft)}
                  </span>
                ) : null}
              </figcaption>
            )}
          </figure>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: 'clamp(20px, 3vw, 36px)',
          }}
        >
          {plans.map((plan, i) => (
            <figure
              key={i}
              style={{
                margin: 0,
                borderRadius: 'var(--lp-radius)',
                border,
                background: surface,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'clamp(18px, 3vw, 32px)',
                  minHeight: 'clamp(220px, 28vw, 320px)',
                  flex: 1,
                }}
              >
                {plan.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={plan.label || `Floor plan ${i + 1}`}
                    src={plan.image}
                    style={{
                      maxWidth: '100%',
                      maxHeight: 360,
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                ) : (
                  <span style={{ fontFamily: 'var(--lp-body-font)', color: 'var(--lp-text)', opacity: 0.5 }}>
                    {plan.label || 'Floor plan'}
                  </span>
                )}
              </div>
              <figcaption
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: 10,
                  padding: 'clamp(14px, 2vw, 20px) clamp(16px, 2.5vw, 24px)',
                  borderTop: border,
                  fontFamily: 'var(--lp-body-font)',
                  color: 'var(--lp-text)',
                }}
              >
                <span style={{ fontFamily: 'var(--lp-heading-font)', fontSize: 'clamp(16px, 1.8vw, 20px)' }}>
                  {plan.label || `Plan ${i + 1}`}
                </span>
                {formatSqft(plan.sqft) ? (
                  <span style={{ color: 'var(--lp-accent)', fontSize: 13, letterSpacing: '0.04em' }}>
                    {formatSqft(plan.sqft)}
                  </span>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </Section>
  )
}
