CREATE TYPE "public"."asset_type" AS ENUM('logo', 'listing_photo', 'floorplan', 'brochure', 'social_post');--> statement-breakpoint
CREATE TYPE "public"."channel" AS ENUM('call', 'sms', 'email', 'whatsapp');--> statement-breakpoint
CREATE TYPE "public"."client_type" AS ENUM('buyer', 'seller', 'investor', 'tenant', 'landlord');--> statement-breakpoint
CREATE TYPE "public"."email_folder" AS ENUM('inbox', 'sent', 'drafts', 'archive', 'spam', 'trash');--> statement-breakpoint
CREATE TYPE "public"."email_status" AS ENUM('read', 'unread');--> statement-breakpoint
CREATE TYPE "public"."interaction_channel" AS ENUM('call', 'sms', 'email', 'dm', 'meeting');--> statement-breakpoint
CREATE TYPE "public"."lead_stage" AS ENUM('new lead', 'engaged', 'offer sent', 'closed won', 'closed lost');--> statement-breakpoint
CREATE TYPE "public"."offer_status" AS ENUM('pending', 'accepted', 'rejected', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."property_status" AS ENUM('coming_soon', 'active', 'conditional', 'sold', 'leased', 'archived');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('detached', 'condo', 'townhouse', 'lot', 'multi-res');--> statement-breakpoint
CREATE TYPE "public"."showing_status" AS ENUM('scheduled', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."task_priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('pending', 'done', 'snoozed');--> statement-breakpoint
CREATE TABLE "agents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"title" text,
	"bio" text,
	"photo_url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"user_id" uuid,
	CONSTRAINT "agents_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "asset_type" NOT NULL,
	"file_name" text NOT NULL,
	"url" text NOT NULL,
	"property_id" uuid,
	"client_id" uuid,
	"size_bytes" integer,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text,
	"content" text,
	"hero_image" text,
	"published" boolean DEFAULT false,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "client_properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"property_id" uuid NOT NULL,
	"relationship_type" text NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"client_type" "client_type" NOT NULL,
	"lead_source" text,
	"stage" "lead_stage" DEFAULT 'new lead' NOT NULL,
	"preferred_areas" text[],
	"property_preferences" jsonb,
	"last_contacted_at" timestamp with time zone,
	"next_action_at" timestamp with time zone,
	"preferred_channel" "channel",
	"created_at" timestamp with time zone DEFAULT now(),
	"tags" text[],
	"archived" boolean DEFAULT false,
	"avatar_url" text,
	"avatar_color" text,
	"agent_id" uuid
);
--> statement-breakpoint
CREATE TABLE "email_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email_id" uuid NOT NULL,
	"file_name" text NOT NULL,
	"content_type" text,
	"size_bytes" integer,
	"url" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "email_clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"is_from" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "emails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_id" text NOT NULL,
	"conversation_id" text,
	"from" text NOT NULL,
	"to" text[] NOT NULL,
	"cc" text[],
	"bcc" text[],
	"subject" text,
	"body" text,
	"body_text" text,
	"received_at" timestamp with time zone NOT NULL,
	"folder" "email_folder" DEFAULT 'inbox',
	"status" "email_status" DEFAULT 'unread',
	"has_attachments" boolean DEFAULT false,
	"importance" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "emails_message_id_unique" UNIQUE("message_id")
);
--> statement-breakpoint
CREATE TABLE "interactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"channel" "interaction_channel" NOT NULL,
	"agent_id" uuid NOT NULL,
	"subject" text,
	"body" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"duration_sec" integer
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"property_id" uuid NOT NULL,
	"offer_price" integer NOT NULL,
	"deposit" integer,
	"conditions" text,
	"submitted_at" timestamp with time zone NOT NULL,
	"status" "offer_status" DEFAULT 'pending' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mls_id" text,
	"agent_owner_id" uuid,
	"status" "property_status" NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"province" text NOT NULL,
	"postal_code" text NOT NULL,
	"geo" text,
	"property_type" "property_type" NOT NULL,
	"price" integer NOT NULL,
	"bedrooms" text,
	"bathrooms" integer,
	"square_feet" integer,
	"lot_dimensions" text,
	"year_built" integer,
	"features" text[],
	"listing_date" timestamp NOT NULL,
	"offer_date" timestamp,
	"closing_date" timestamp,
	"hoa_fees" integer,
	"property_tax" integer,
	"description" text,
	"media_urls" text[],
	"tags" text[],
	"hero_image" text,
	"youtube_video" text,
	"more" jsonb,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "properties_mls_id_unique" UNIQUE("mls_id")
);
--> statement-breakpoint
CREATE TABLE "property_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"url" text NOT NULL,
	"file_name" text NOT NULL,
	"size_bytes" integer,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "showings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"scheduled_at" timestamp with time zone NOT NULL,
	"status" "showing_status" DEFAULT 'scheduled' NOT NULL,
	"feedback" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"agent_id" uuid
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"due_at" timestamp with time zone NOT NULL,
	"status" "task_status" DEFAULT 'pending' NOT NULL,
	"priority" "task_priority" DEFAULT 'medium' NOT NULL,
	"client_id" uuid,
	"property_id" uuid,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_properties" ADD CONSTRAINT "client_properties_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_properties" ADD CONSTRAINT "client_properties_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_attachments" ADD CONSTRAINT "email_attachments_email_id_emails_id_fk" FOREIGN KEY ("email_id") REFERENCES "public"."emails"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_clients" ADD CONSTRAINT "email_clients_email_id_emails_id_fk" FOREIGN KEY ("email_id") REFERENCES "public"."emails"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_clients" ADD CONSTRAINT "email_clients_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_agent_owner_id_agents_id_fk" FOREIGN KEY ("agent_owner_id") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showings" ADD CONSTRAINT "showings_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showings" ADD CONSTRAINT "showings_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showings" ADD CONSTRAINT "showings_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_agents_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;