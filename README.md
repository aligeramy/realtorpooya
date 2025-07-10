# Pooya Pirayesh Real Estate Website

A modern real estate website built with Next.js 15, featuring property listings, blog, and CRM integration capabilities.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: Tailwind CSS + shadcn/ui components
- **TypeScript**: Full type safety
- **Deployment**: Vercel

## Features

- 🏠 Property listings with search and filters
- 📝 Blog system for real estate content
- 📱 Responsive design for all devices
- 🔍 SEO optimized
- 📧 Contact forms and showing requests
- 🎨 Modern, luxury design aesthetic

## Database Setup

This project uses Drizzle ORM with PostgreSQL. The schema supports:

- Properties with images, videos, features, and tags
- Blog posts with rich content
- Support for bedroom formats like "3+1", "4+x"
- Property ordering and featured listings

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

### Database Commands

```bash
# Generate migrations
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Push schema changes (development)
pnpm db:push

# Open Drizzle Studio
pnpm db:studio
```

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## CRM Integration Ready

The application is prepared for CRM integration:

- Clean API endpoints for properties and blog posts
- Structured data models compatible with external systems
- Contact form handlers ready for CRM webhook integration
- Property data format designed for MLS/CRM synchronization

## API Endpoints

- `GET /api/properties` - All properties with search/filter
- `GET /api/properties/featured` - Featured properties only
- `GET /api/properties/[id]` - Individual property details
- `GET /api/blog` - Published blog posts
- `GET /api/blog/[slug]` - Individual blog post
- `POST /api/contact` - Contact form submission
- `POST /api/book-showing` - Property showing requests

## Next Steps

Ready for your property data! The system is configured to:

1. Receive property data from your CRM
2. Display featured listings on the homepage
3. Handle property searches and filtering
4. Manage blog content
5. Process contact inquiries

All admin functionality has been removed in favor of CRM-driven content management.
