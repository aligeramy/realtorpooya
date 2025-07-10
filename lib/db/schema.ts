import { pgEnum, pgTable, uuid, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';

// Enums
export const clientTypeEnum = pgEnum('client_type', ['buyer', 'seller', 'investor', 'tenant', 'landlord']);
export const channelEnum = pgEnum('channel', ['call', 'sms', 'email', 'whatsapp']);
export const propertyStatusEnum = pgEnum('property_status', ['coming_soon', 'active', 'conditional', 'sold', 'leased', 'not_available', 'archived']);
export const propertyTypeEnum = pgEnum('property_type', ['detached', 'condo', 'townhouse', 'lot', 'multi-res']);
export const leadStageEnum = pgEnum('lead_stage', ['new lead', 'engaged', 'offer sent', 'closed won', 'closed lost']);
export const assetTypeEnum = pgEnum('asset_type', ['logo', 'listing_photo', 'floorplan', 'brochure', 'social_post']);
export const interactionChannelEnum = pgEnum('interaction_channel', ['call', 'sms', 'email', 'dm', 'meeting']);
export const showingStatusEnum = pgEnum('showing_status', ['scheduled', 'completed', 'cancelled']);
export const offerStatusEnum = pgEnum('offer_status', ['pending', 'accepted', 'rejected', 'withdrawn']);
export const taskStatusEnum = pgEnum('task_status', ['pending', 'done', 'snoozed']);
export const taskPriorityEnum = pgEnum('task_priority', ['low', 'medium', 'high']);
export const emailFolderEnum = pgEnum('email_folder', ['inbox', 'sent', 'drafts', 'archive', 'spam', 'trash']);
export const emailStatusEnum = pgEnum('email_status', ['read', 'unread']);

// Forward declare agents for references
export const agents = pgTable('agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  title: text('title'),
  bio: text('bio'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  userId: uuid('user_id'),
});

// Tables
export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  clientType: clientTypeEnum('client_type').notNull(),
  leadSource: text('lead_source'),
  stage: leadStageEnum('stage').notNull().default('new lead'),
  preferredAreas: text('preferred_areas').array(),
  propertyPreferences: jsonb('property_preferences'),
  lastContactedAt: timestamp('last_contacted_at', { withTimezone: true }),
  nextActionAt: timestamp('next_action_at', { withTimezone: true }),
  preferredChannel: channelEnum('preferred_channel'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  tags: text('tags').array(),
  archived: boolean('archived').default(false),
  avatar_url: text('avatar_url'),
  avatar_color: text('avatar_color'),
  agentId: uuid('agent_id').references(() => agents.id),
});

export const properties = pgTable('properties', {
  id: uuid('id').primaryKey().defaultRandom(),
  mlsId: text('mls_id').unique(),
  agentOwnerId: uuid('agent_owner_id').references(() => agents.id),
  status: propertyStatusEnum('status').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  province: text('province').notNull(),
  postalCode: text('postal_code').notNull(),
  geo: text('geo'), // PostGIS point will be handled in migration
  propertyType: propertyTypeEnum('property_type').notNull(),
  price: integer('price').notNull(),
  bedrooms: text('bedrooms'), // Text to support "3+1", "4+x" format
  bathrooms: integer('bathrooms'),
  squareFeet: integer('square_feet'),
  lotDimensions: text('lot_dimensions'),
  yearBuilt: integer('year_built'),
  features: jsonb('features'),
  listingDate: timestamp('listing_date', { mode: 'date' }).notNull(),
  offerDate: timestamp('offer_date', { mode: 'date' }),
  closingDate: timestamp('closing_date', { mode: 'date' }),
  hoaFees: integer('hoa_fees'),
  propertyTax: integer('property_tax'),
  description: jsonb('description'),
  mediaUrls: text('media_urls').array(),
  tags: text('tags').array(),
  heroImage: text('hero_image'), // Optional hero image URL
  youtubeVideo: text('youtube_video'), // Optional YouTube video URL
  more: jsonb('more'), // Optional JSONB for custom fields
  displayOrder: integer('display_order').default(0), // Order field for reordering properties on website
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const assets = pgTable('assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: assetTypeEnum('type').notNull(),
  fileName: text('file_name').notNull(),
  url: text('url').notNull(),
  propertyId: uuid('property_id').references(() => properties.id),
  clientId: uuid('client_id').references(() => clients.id),
  sizeBytes: integer('size_bytes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const propertyImages = pgTable('property_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').references(() => properties.id).notNull(),
  url: text('url').notNull(),
  fileName: text('file_name').notNull(),
  sizeBytes: integer('size_bytes'),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const interactions = pgTable('interactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  channel: interactionChannelEnum('channel').notNull(),
  agentId: uuid('agent_id').references(() => agents.id).notNull(),
  subject: text('subject'),
  body: text('body'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  durationSec: integer('duration_sec'),
});

export const showings = pgTable('showings', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').references(() => properties.id).notNull(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
  status: showingStatusEnum('status').notNull().default('scheduled'),
  feedback: text('feedback'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  agentId: uuid('agent_id').references(() => agents.id),
});

export const offers = pgTable('offers', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  propertyId: uuid('property_id').references(() => properties.id).notNull(),
  offerPrice: integer('offer_price').notNull(),
  deposit: integer('deposit'),
  conditions: text('conditions'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull(),
  status: offerStatusEnum('status').notNull().default('pending'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  dueAt: timestamp('due_at', { withTimezone: true }).notNull(),
  status: taskStatusEnum('status').notNull().default('pending'),
  priority: taskPriorityEnum('priority').notNull().default('medium'),
  clientId: uuid('client_id').references(() => clients.id),
  propertyId: uuid('property_id').references(() => properties.id),
  createdBy: uuid('created_by').references(() => agents.id).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  notes: text('notes'),
});

export const emails = pgTable('emails', {
  id: uuid('id').primaryKey().defaultRandom(),
  messageId: text('message_id').notNull().unique(),
  conversationId: text('conversation_id'),
  from: text('from').notNull(),
  to: text('to').array().notNull(),
  cc: text('cc').array(),
  bcc: text('bcc').array(),
  subject: text('subject'),
  body: text('body'),
  bodyText: text('body_text'),
  receivedAt: timestamp('received_at', { withTimezone: true }).notNull(),
  folder: emailFolderEnum('folder').default('inbox'),
  status: emailStatusEnum('status').default('unread'),
  hasAttachments: boolean('has_attachments').default(false),
  importance: text('importance'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const emailClients = pgTable('email_clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  emailId: uuid('email_id').references(() => emails.id).notNull(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  isFrom: boolean('is_from').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const emailAttachments = pgTable('email_attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  emailId: uuid('email_id').references(() => emails.id).notNull(),
  fileName: text('file_name').notNull(),
  contentType: text('content_type'),
  sizeBytes: integer('size_bytes'),
  url: text('url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Client-Property relationship table
export const clientProperties = pgTable('client_properties', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  propertyId: uuid('property_id').references(() => properties.id).notNull(),
  relationshipType: text('relationship_type').notNull(), // 'owner', 'buyer', 'interested', 'tenant', etc.
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Blog posts table (read-only from external system)
export const blog_posts = pgTable('blog_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content'),
  hero_image: text('hero_image'),
  published: boolean('published').default(false),
  published_at: timestamp('published_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// TypeScript types
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type PropertyImage = typeof propertyImages.$inferSelect;
export type NewPropertyImage = typeof propertyImages.$inferInsert;
export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
export type Interaction = typeof interactions.$inferSelect;
export type NewInteraction = typeof interactions.$inferInsert;
export type Showing = typeof showings.$inferSelect;
export type NewShowing = typeof showings.$inferInsert;
export type Offer = typeof offers.$inferSelect;
export type NewOffer = typeof offers.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Agent = typeof agents.$inferSelect;
export type NewAgent = typeof agents.$inferInsert;
export type Email = typeof emails.$inferSelect;
export type NewEmail = typeof emails.$inferInsert;
export type BlogPost = typeof blog_posts.$inferSelect;
export type NewBlogPost = typeof blog_posts.$inferInsert; 