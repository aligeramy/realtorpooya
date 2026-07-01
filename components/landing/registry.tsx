'use client'
// Maps every block type to its renderer component. Shared by the public site
// and the CRM editor canvas.
import type { BlockType } from '@/lib/landing/types'
import NavbarBlock from './blocks/NavbarBlock'
import HeroBlock from './blocks/HeroBlock'
import CtaBlock from './blocks/CtaBlock'
import SplitBlock from './blocks/SplitBlock'
import FeatureColumnsBlock from './blocks/FeatureColumnsBlock'
import GalleryBlock from './blocks/GalleryBlock'
import StatsBlock from './blocks/StatsBlock'
import DescriptionBlock from './blocks/DescriptionBlock'
import AmenitiesBlock from './blocks/AmenitiesBlock'
import FloorplansBlock from './blocks/FloorplansBlock'
import MapBlock from './blocks/MapBlock'
import VideoBlock from './blocks/VideoBlock'
import AgentBlock from './blocks/AgentBlock'
import LeadFormBlock from './blocks/LeadFormBlock'
import FooterBlock from './blocks/FooterBlock'
import HeadingBlock from './blocks/HeadingBlock'
import TextBlock from './blocks/TextBlock'
import ImageBlock from './blocks/ImageBlock'
import ButtonBlock from './blocks/ButtonBlock'
import DividerBlock from './blocks/DividerBlock'
import SpacerBlock from './blocks/SpacerBlock'
import EmbedBlock from './blocks/EmbedBlock'
import ColumnsBlock from './blocks/ColumnsBlock'

export const BLOCK_REGISTRY: Record<BlockType, React.ComponentType<any>> = {
  navbar: NavbarBlock,
  hero: HeroBlock,
  cta: CtaBlock,
  split: SplitBlock,
  feature_columns: FeatureColumnsBlock,
  gallery: GalleryBlock,
  stats: StatsBlock,
  description: DescriptionBlock,
  amenities: AmenitiesBlock,
  floorplans: FloorplansBlock,
  map: MapBlock,
  video: VideoBlock,
  agent: AgentBlock,
  lead_form: LeadFormBlock,
  footer: FooterBlock,
  heading: HeadingBlock,
  text: TextBlock,
  image: ImageBlock,
  button: ButtonBlock,
  divider: DividerBlock,
  spacer: SpacerBlock,
  embed: EmbedBlock,
  columns: ColumnsBlock,
}
