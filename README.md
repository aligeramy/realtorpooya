# Pooya Pirayesh Real Estate Website

A modern, luxury real estate website built with Next.js, featuring property listings, contact forms, and an admin interface for property management.

## Features

- 🏠 Property listings with image galleries and videos
- 📱 Responsive design optimized for all devices
- 🎥 YouTube video integration for property tours
- 📧 Contact forms with email notifications
- 🔐 Admin interface for property management
- 📸 Image and video upload capabilities
- 🎨 Modern, luxury-focused design

## Admin Access

The admin interface is accessible at `/admin` and includes:

- **Property Management**: Create, edit, and delete property listings
- **Media Upload**: Drag-and-drop image and video uploads
- **Video Integration**: YouTube video embedding for property tours
- **Image Management**: Set hero images, add captions, and reorder media
- **Feature & Tag Management**: Add property features and tags

### Admin Features:
- **Image Upload**: Drag and drop multiple images with automatic upload to Vercel Blob storage
- **Video Upload**: Support for MP4, MOV, AVI, and MKV video files
- **YouTube Integration**: Easy embedding of YouTube property tour videos
- **Media Organization**: Set hero images, add alt text and captions
- **Drag & Drop Reordering**: Easily reorder images and videos

## Recent Updates

### Videos Added:
- **Westlake Property** (266 Westlake Ave): https://www.youtube.com/watch?v=PpAnSuBf7Fc
- **Howick Property** (10 Howick Ln): https://www.youtube.com/watch?v=O6CvUZSxeT0&feature=youtu.be

### Hero Image Management:
- **Automatic Sync**: The `hero_image` field automatically syncs with images marked as `is_hero: true`
- **Gallery Priority**: Hero images always appear first in property galleries
- **Video Posters**: Hero images serve as video thumbnails and posters
- **API Sync Endpoint**: `/api/admin/properties/sync-hero` to manually sync all properties

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **File Storage**: Vercel Blob
- **Email**: Resend
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run database migrations: `npx prisma migrate dev`
5. Seed the database: `npx tsx scripts/seed.ts`
6. Start the development server: `npm run dev`

## Environment Variables

```env
DATABASE_URL="your-postgresql-connection-string"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
RESEND_API_KEY="your-resend-api-key"
EMAIL_TO="your-email@example.com"
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin interface pages
│   ├── api/               # API routes
│   ├── listings/          # Property listing pages
│   └── contact/           # Contact page
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   └── ui/               # UI components
├── lib/                  # Utility libraries
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── scripts/              # Database scripts
```
