import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import PropertyImageGallery from '@/components/property-image-gallery'
import { ListingBody } from '@/components/listing/listing-body'
import { loadListing, listingGalleryImages } from '@/lib/listing/load'
import { formatPrice, statusBadgeClass, statusLabel } from '@/lib/listing/render'

/**
 * Unbranded listing page for MLS "virtual tour" links: photos, details,
 * description, features, floor plans and tours only. No logo, navigation,
 * agent, brokerage, contact details or links back to the main site.
 */
export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const listing = await loadListing(id)
  if (!listing) return { title: 'Property not found', robots: { index: false, follow: false } }
  const facts = [
    listing.bedrooms ? `${listing.bedrooms} bed` : null,
    listing.bathrooms ? `${listing.bathrooms} bath` : null,
    listing.squareFeet ? `${listing.squareFeet.toLocaleString()} sq ft` : null,
  ].filter(Boolean)
  return {
    title: `${listing.address.trim()}, ${listing.city}`,
    description: facts.length ? `${facts.join(', ')} in ${listing.city}` : `Property in ${listing.city}`,
    robots: { index: false, follow: false },
    openGraph: { images: listing.heroImage ? [{ url: listing.heroImage }] : undefined },
  }
}

export default async function UnbrandedListingPage({ params }: PageProps) {
  const { id } = await params
  const listing = await loadListing(id)
  if (!listing) notFound()

  const address = listing.address.trim()

  return (
    <main className="min-h-screen bg-white">
      <PropertyImageGallery
        images={listingGalleryImages(listing)}
        videoUrl={listing.youtubeVideo || undefined}
        heroImage={listing.heroImage || undefined}
      />

      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-tenor-sans text-4xl md:text-5xl text-gray-900 mb-2">{address}</h1>
            <div className="flex items-center text-[#aa9578]">
              <MapPin className="h-5 w-5 mr-2" />
              <span className="text-lg">
                {listing.city}, {listing.province || 'ON'} {listing.postalCode}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:flex-col sm:items-end">
            <span className="font-tenor-sans text-3xl text-gray-900">
              {listing.status === 'not_available' ? 'Not Available' : formatPrice(listing.price)}
            </span>
            <Badge className={`px-3 py-1 rounded-full ${statusBadgeClass(listing.status)}`}>{statusLabel(listing.status)}</Badge>
          </div>
        </div>

        <ListingBody listing={listing} />
      </div>

      <footer className="border-t border-gray-100 py-8 text-center font-manrope text-xs text-gray-400">
        Information deemed reliable but not guaranteed. Measurements are approximate.
      </footer>
    </main>
  )
}
