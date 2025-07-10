import type {
  Property,
  NewProperty,
  PropertyImage,
  NewPropertyImage,
  Client,
  NewClient,
  Agent,
  NewAgent,
  BlogPost,
  NewBlogPost
} from '@/lib/db/schema'

// Re-export types from Drizzle schema
export type {
  Property,
  NewProperty,
  PropertyImage,
  NewPropertyImage,
  Client,
  NewClient,
  Agent,
  NewAgent,
  BlogPost,
  NewBlogPost
}

// Additional types for frontend use
export interface PropertyWithDetails extends Property {
  images: PropertyImage[]
  // Legacy field mappings for frontend compatibility
  media_urls?: string[]
  hero_image?: string
  youtube_video?: string
  square_feet?: number
  year_built?: number
  property_type?: string
  postal_code?: string
  listing_date?: string
  created_at?: string
}
