export type PropertyStatus = "for_sale" | "for_rent" | "sold" | "pending" | "off_market" | "coming_soon"
export type PropertyType = "house" | "condo" | "townhouse" | "apartment" | "land" | "commercial" | "industrial"

export interface Property {
  id: string
  mls_id?: string
  agent_owner_id?: string
  status: PropertyStatus
  address: string
  city: string
  province: string
  postal_code?: string
  geo?: string
  property_type?: PropertyType
  price?: number
  bedrooms?: number
  bathrooms?: number
  square_feet?: number
  lot_dimensions?: string
  year_built?: number
  features?: string[]
  listing_date?: string
  offer_date?: string
  closing_date?: string
  hoa_fees?: number
  property_tax?: number
  description?: string
  media_urls?: string[]
  tags?: string[]
  created_at?: string
  hero_image?: string
  youtube_video?: string
  more?: Record<string, any>
}
