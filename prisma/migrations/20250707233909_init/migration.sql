-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('FOR_SALE', 'FOR_RENT', 'SOLD', 'PENDING', 'OFF_MARKET', 'COMING_SOON');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('HOUSE', 'CONDO', 'TOWNHOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'INDUSTRIAL');

-- CreateEnum
CREATE TYPE "VideoType" AS ENUM ('UPLOAD', 'YOUTUBE', 'VIMEO');

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "mls_id" TEXT,
    "agent_owner_id" TEXT,
    "status" "PropertyStatus" NOT NULL DEFAULT 'FOR_SALE',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "postal_code" TEXT,
    "geo" TEXT,
    "property_type" "PropertyType",
    "price" DOUBLE PRECISION,
    "bedrooms" INTEGER,
    "bathrooms" DOUBLE PRECISION,
    "square_feet" INTEGER,
    "lot_dimensions" TEXT,
    "year_built" INTEGER,
    "hoa_fees" DOUBLE PRECISION,
    "property_tax" DOUBLE PRECISION,
    "description" TEXT,
    "listing_date" TIMESTAMP(3),
    "offer_date" TIMESTAMP(3),
    "closing_date" TIMESTAMP(3),
    "hero_image" TEXT,
    "youtube_video" TEXT,
    "more" JSONB,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_images" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "property_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt_text" TEXT,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_hero" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "property_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_videos" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "property_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "video_type" "VideoType" NOT NULL DEFAULT 'UPLOAD',

    CONSTRAINT "property_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_features" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "property_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,

    CONSTRAINT "property_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_tags" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "property_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "property_tags_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_videos" ADD CONSTRAINT "property_videos_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_features" ADD CONSTRAINT "property_features_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_tags" ADD CONSTRAINT "property_tags_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
