// ────────────────────────────────────────────────────────────────────────
// Theme → CSS variables. Portable: shared by the public renderer and the CRM
// editor canvas. Changing a token re-themes the whole page with no markup
// changes (Lysto-style token system).
// ────────────────────────────────────────────────────────────────────────
import type { PageTheme } from './types'
import { DEFAULT_THEME } from './types'

const FONT_STACKS: Record<string, string> = {
  'tenor-sans': "'Tenor Sans', 'Times New Roman', serif",
  'playfair': "'Playfair Display', Georgia, serif",
  'cormorant': "'Cormorant Garamond', Georgia, serif",
  'manrope': "'Manrope', system-ui, sans-serif",
  'inter': "'Inter', system-ui, sans-serif",
  'montserrat': "'Montserrat', system-ui, sans-serif",
}

const GOOGLE_FONT_FAMILIES: Record<string, string> = {
  'tenor-sans': 'Tenor+Sans',
  'playfair': 'Playfair+Display:wght@400;500;600;700',
  'cormorant': 'Cormorant+Garamond:wght@400;500;600;700',
  'manrope': 'Manrope:wght@300;400;500;600;700',
  'inter': 'Inter:wght@300;400;500;600;700',
  'montserrat': 'Montserrat:wght@300;400;500;600;700',
}

export function fontStack(id?: string): string {
  if (!id) return FONT_STACKS['manrope']
  return FONT_STACKS[id] || `'${id}', system-ui, sans-serif`
}

/** Google Fonts <link> href for the page's heading + body fonts. */
export function googleFontsHref(theme?: PageTheme | null): string | null {
  const ids = Array.from(new Set([theme?.headingFont, theme?.bodyFont].filter(Boolean) as string[]))
  const fams = ids.map((id) => GOOGLE_FONT_FAMILIES[id]).filter(Boolean)
  if (!fams.length) return null
  return `https://fonts.googleapis.com/css2?${fams.map((f) => `family=${f}`).join('&')}&display=swap`
}

export function themeToCssVars(theme?: PageTheme | null): Record<string, string> {
  const t = { ...DEFAULT_THEME, ...(theme || {}) }
  return {
    '--lp-primary': t.primaryColor || DEFAULT_THEME.primaryColor,
    '--lp-accent': t.accentColor || DEFAULT_THEME.accentColor,
    '--lp-bg': (theme?.backgroundColor as string) || '#ffffff',
    '--lp-text': (theme?.textColor as string) || '#1c1a17',
    '--lp-heading-font': fontStack(t.headingFont),
    '--lp-body-font': fontStack(t.bodyFont),
    '--lp-max-width': `${t.maxWidth || DEFAULT_THEME.maxWidth}px`,
    '--lp-radius': `${theme?.radius ?? 4}px`,
  }
}
