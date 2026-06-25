// ────────────────────────────────────────────────────────────────────────
// Landing Page Builder — shared block contract
//
// This file is the SINGLE SOURCE OF TRUTH for the shape of landing-page data.
// It is framework-agnostic (no React) and is mirrored verbatim into the public
// site at website/realtorpooya/lib/blocks/types.ts. The CRM editor writes these
// shapes; the public renderer reads them. Keep both copies identical.
// ────────────────────────────────────────────────────────────────────────

export type PageStatus = 'draft' | 'published' | 'archived'
export type PageSource = 'property' | 'custom' | 'hybrid'

/**
 * All node types in the builder. "Sections" are composed, full-width blocks.
 * "Elements" are atomic building blocks that can be dropped anywhere (and nested
 * inside a `columns` element). `columns` provides one level of side-by-side layout.
 */
export type SectionType =
  | 'navbar'
  | 'hero'
  | 'cta'
  | 'gallery'
  | 'stats'
  | 'description'
  | 'amenities'
  | 'floorplans'
  | 'map'
  | 'video'
  | 'agent'
  | 'lead_form'
  | 'footer'

export type ElementType =
  | 'heading'
  | 'text'
  | 'image'
  | 'button'
  | 'divider'
  | 'spacer'
  | 'embed'
  | 'columns'

export type BlockType = SectionType | ElementType

// ── Reusable building blocks ──────────────────────────────────────────────

/** A button. `action: 'register'` opens the page-wide "Register Here" popup. */
export interface CtaButton {
  label: string
  action: 'register' | 'link' | 'scroll' | 'phone' | 'email'
  href?: string        // action: 'link'
  target?: string      // action: 'scroll' — a block id / anchor
  phone?: string       // action: 'phone'
  email?: string       // action: 'email'
  style?: 'primary' | 'secondary' | 'outline' | 'ghost'
  newTab?: boolean
}

export interface ImageItem {
  url: string
  caption?: string
  alt?: string
}

export interface LinkItem {
  label: string
  href: string
}

// ── Page-level configuration ──────────────────────────────────────────────

export interface PageTheme {
  primaryColor?: string      // brand, default #473729
  accentColor?: string       // default #aa9578
  textColor?: string
  backgroundColor?: string
  headingFont?: string       // 'tenor-sans' | 'manrope' | 'playfair' | …
  bodyFont?: string
  maxWidth?: number          // content max width px, default 1400
  radius?: number            // base border radius px
}

export interface PageSeo {
  metaTitle?: string
  metaDescription?: string
  ogImage?: string
  canonical?: string
  noindex?: boolean
}

/**
 * The "Register Here" popup — the lead-capture modal opened by any button
 * whose action is 'register'. Modeled on the 7 Dale registration form.
 * `priceRangeOptions` is configured PER PAGE/PROPERTY by the admin.
 */
export interface RegistrationConfig {
  enabled?: boolean
  heading?: string            // "Register Here"
  subtext?: string            // "Get access to remaining floor plans, pricing, and book your private tour today."
  note?: string               // "Move-In Ready! Suites Starting from $5M's."
  showFirstName?: boolean
  showLastName?: boolean
  showEmail?: boolean
  showPhone?: boolean
  showPriceRange?: boolean
  priceRangeOptions?: string[]   // e.g. ["$5M-$7M","$7M-9M","$9M-$12M","$12M-$17M"] — admin-configurable
  showBuyerRealtor?: boolean
  buyerRealtorOptions?: string[] // default ["Buyer","Realtor"]
  submitLabel?: string           // "Submit" / "Get Pricing & Plans"
  successMessage?: string
  recipientEmail?: string        // where the lead notification is sent (optional)
  propertyId?: string | null     // associates the lead with a property
}

export interface CustomData {
  // Per-page overrides used when data_source is 'custom' or 'hybrid'.
  address?: string
  price?: string
  beds?: string
  baths?: string
  sqft?: string
  yearBuilt?: string
  parking?: string
  [key: string]: unknown
}

// ── Per-block props ───────────────────────────────────────────────────────

export interface NavbarProps {
  logo?: string
  sticky?: boolean
  transparentOnTop?: boolean
  links?: LinkItem[]
  button?: CtaButton          // typically { label: 'Register Here', action: 'register' }
  background?: string
}

export interface HeroProps {
  eyebrow?: string
  headline?: string
  subheadline?: string
  backgroundImage?: string
  backgroundVideo?: string
  overlayOpacity?: number     // 0..1
  align?: 'left' | 'center' | 'right'
  height?: 'screen' | 'large' | 'medium'
  textColor?: string
  buttons?: CtaButton[]       // e.g. [{ label: 'Get Pricing & Plans', action: 'register' }]
}

export interface CtaProps {
  eyebrow?: string
  heading?: string
  subtext?: string
  note?: string               // e.g. "Move-In Ready! Suites Starting from $5M's."
  buttons?: CtaButton[]
  background?: string
  backgroundImage?: string
  align?: 'left' | 'center' | 'right'
  textColor?: string
}

export interface GalleryProps {
  heading?: string
  images: ImageItem[]         // property-sourced and/or uploaded — all just public URLs
  layout?: 'grid' | 'carousel' | 'masonry'
  columns?: 2 | 3 | 4
  showCaptions?: boolean
  enableLightbox?: boolean
}

export interface StatItem {
  label: string
  value: string
  icon?: string
}
export interface StatsProps {
  source?: 'property' | 'custom'
  heading?: string
  items: StatItem[]
  columns?: number
}

export interface DescriptionProps {
  source?: 'property' | 'custom'
  heading?: string
  content?: unknown           // TipTap JSON doc, or HTML string, or plain text
  align?: 'left' | 'center' | 'right'
}

export interface AmenitiesProps {
  source?: 'property' | 'custom'
  heading?: string
  items: string[]
  columns?: number
}

export interface FloorPlan {
  label: string
  image: string
  sqft?: string
}
export interface FloorplansProps {
  heading?: string
  plans: FloorPlan[]
  layout?: 'tabs' | 'grid'
}

export interface MapProps {
  source?: 'property' | 'custom'
  heading?: string
  address?: string
  lat?: number | null
  lng?: number | null
  zoom?: number
}

export interface VideoProps {
  heading?: string
  provider?: 'youtube' | 'vimeo' | 'file'
  url?: string
  aspect?: '16:9' | '4:3' | '21:9'
  autoplay?: boolean
  poster?: string
}

export interface AgentProps {
  source?: 'agent' | 'custom'
  agentId?: string | null
  name?: string
  title?: string
  phone?: string
  email?: string
  photo?: string
  bio?: string
  brokerage?: string
}

/** Inline (non-popup) lead form section. Defaults to the page RegistrationConfig. */
export interface LeadFormProps {
  heading?: string
  subtext?: string
  note?: string
  useRegistrationConfig?: boolean   // inherit page-level RegistrationConfig fields
  showPriceRange?: boolean
  priceRangeOptions?: string[]
  showBuyerRealtor?: boolean
  submitLabel?: string
  successMessage?: string
  propertyId?: string | null
  backgroundImage?: string
  layout?: 'split' | 'centered'
}

export interface FooterProps {
  showAgent?: boolean
  logo?: string
  links?: LinkItem[]
  fineprint?: string
  background?: string
}

// ── Atomic element props ──────────────────────────────────────────────────

export interface HeadingProps {
  text?: string
  level?: 1 | 2 | 3 | 4
  align?: 'left' | 'center' | 'right'
  color?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  eyebrow?: string
  maxWidth?: number
}

export interface TextProps {
  content?: unknown            // TipTap JSON, HTML string, or plain text
  align?: 'left' | 'center' | 'right'
  color?: string
  size?: 'sm' | 'md' | 'lg'
  maxWidth?: number
}

export interface ImageProps {
  url?: string
  alt?: string
  caption?: string
  width?: 'full' | 'large' | 'medium' | 'small' | number   // % when number
  align?: 'left' | 'center' | 'right'
  rounded?: number
  aspect?: 'auto' | '16:9' | '4:3' | '1:1' | '3:2'
  link?: CtaButton
}

export interface ButtonProps {
  button?: CtaButton
  align?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export interface DividerProps {
  style?: 'solid' | 'dashed' | 'dotted'
  color?: string
  thickness?: number
  spacing?: number
}

export interface EmbedProps {
  html?: string                // raw HTML / iframe snippet
  height?: number
}

export interface SpacerProps {
  height?: number              // px
  showDivider?: boolean
  background?: string
}

/** One level of side-by-side layout. Each column holds its own ordered blocks. */
export interface ColumnsProps {
  columns?: 2 | 3 | 4
  gap?: number
  verticalAlign?: 'top' | 'center' | 'bottom'
  stackOnMobile?: boolean
  children?: Block[][]         // children[i] = blocks in column i
}

/** Maps each block type to its props interface. */
export interface BlockPropsMap {
  navbar: NavbarProps
  hero: HeroProps
  cta: CtaProps
  gallery: GalleryProps
  stats: StatsProps
  description: DescriptionProps
  amenities: AmenitiesProps
  floorplans: FloorplansProps
  map: MapProps
  video: VideoProps
  agent: AgentProps
  lead_form: LeadFormProps
  footer: FooterProps
  heading: HeadingProps
  text: TextProps
  image: ImageProps
  button: ButtonProps
  divider: DividerProps
  spacer: SpacerProps
  embed: EmbedProps
  columns: ColumnsProps
}

/** An item in a page's media folder. */
export interface MediaItem {
  url: string
  fileName?: string
  source?: 'property' | 'upload'
  width?: number
  height?: number
  addedAt?: string
}

/** A single block instance as stored in `landing_page_blocks`. */
export interface Block<T extends BlockType = BlockType> {
  id: string
  type: T
  position: number
  props: T extends keyof BlockPropsMap ? BlockPropsMap[T] : Record<string, unknown>
}

/**
 * The editable content of a page — stored as a single JSON document in
 * `landing_pages.draft_document` (working copy) and snapshotted into
 * `landing_pages.published_document` on publish. Versioned by undo/redo and
 * covered atomically by publish.
 */
export interface SiteDocument {
  version: number             // schema version for future migrations
  blocks: Block[]             // ordered top-level blocks (sections + elements)
  theme: PageTheme
  registration: RegistrationConfig
  seo?: PageSeo
  customData?: CustomData     // overrides for property fields (custom/hybrid pages)
  templateKey?: string        // which full template this page started from
}

/** A page row plus its documents (the editor/renderer working shape). */
export interface LandingPageRecord {
  id: string
  slug: string
  title: string
  status: PageStatus
  propertyId: string | null
  dataSource: PageSource
  media: MediaItem[] | null   // the page media folder (shared across draft/published)
  agentOwnerId: string | null
  publishedAt: string | null
  draft: SiteDocument
  published: SiteDocument | null
}

export const DEFAULT_THEME: Required<Pick<PageTheme, 'primaryColor' | 'accentColor' | 'headingFont' | 'bodyFont' | 'maxWidth'>> = {
  primaryColor: '#473729',
  accentColor: '#aa9578',
  headingFont: 'tenor-sans',
  bodyFont: 'manrope',
  maxWidth: 1400,
}

export const DEFAULT_REGISTRATION: RegistrationConfig = {
  enabled: true,
  heading: 'Register Here',
  subtext: 'Get access to remaining floor plans, pricing, and book your private tour today.',
  note: '',
  showFirstName: true,
  showLastName: true,
  showEmail: true,
  showPhone: true,
  showPriceRange: true,
  priceRangeOptions: ['$5M-$7M', '$7M-9M', '$9M-$12M', '$12M-$17M'],
  showBuyerRealtor: true,
  buyerRealtorOptions: ['Buyer', 'Realtor'],
  submitLabel: 'Submit',
  successMessage: 'Thank you! We will be in touch shortly.',
}

export const DOCUMENT_VERSION = 1

export function emptyDocument(): SiteDocument {
  return {
    version: DOCUMENT_VERSION,
    blocks: [],
    theme: { ...DEFAULT_THEME },
    registration: { ...DEFAULT_REGISTRATION, priceRangeOptions: [...(DEFAULT_REGISTRATION.priceRangeOptions || [])] },
    seo: {},
    customData: {},
  }
}
