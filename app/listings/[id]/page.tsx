import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Phone, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import PropertyImageGallery from '@/components/property-image-gallery'
import TopNavMenu from '@/components/top-nav-menu'
import BookShowingButton from '@/components/book-showing-button'
import { PropertyContactForm } from '@/components/property-contact-form'
import ResponsiveLogo from '@/components/responsive-logo'
import { ListingBody } from '@/components/listing/listing-body'
import { ListingShareButtons } from '@/components/listing/share-buttons'
import { loadListing, listingGalleryImages } from '@/lib/listing/load'
import { descriptionToText, formatPrice, statusBadgeClass, statusLabel } from '@/lib/listing/render'

// Rendered on the server per request: the HTML already contains the listing,
// so the browser no longer waits for JavaScript and an API round trip before
// it can show anything.
export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const listing = await loadListing(id)
  if (!listing) return { title: 'Property not found' }
  const address = listing.address.trim()
  const title = `${address}, ${listing.city} | Pooya Pirayeshakbari`
  const summary = descriptionToText(listing.description)
  const description =
    summary.length > 160
      ? `${summary.slice(0, 157).trimEnd()}…`
      : summary || `${listing.bedrooms || ''} bed, ${listing.bathrooms ?? ''} bath home in ${listing.city}.`
  const image = listing.heroImage || listing.mediaUrls[0]
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', images: image ? [{ url: image }] : undefined },
  }
}

export default async function PropertyPage({ params }: PageProps) {
  const { id } = await params
  const listing = await loadListing(id)
  if (!listing) notFound()

  const address = listing.address.trim()
  const isSold = listing.status === 'sold'

  return (
    <main className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="w-full py-6 px-6 bg-white">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <Link href="/">
              <ResponsiveLogo variant="color" />
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center text-[#aa9578] font-manrope tracking-tight">
              <Phone className="h-4 w-4 mr-2" />
              <span>416-553-7707</span>
            </div>

            <TopNavMenu />

            <div className="hidden md:flex items-center space-x-4">
              <Link href="https://www.facebook.com/realtorpooya" className="text-[#aa9578] hover:text-[#473729] transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>
              <Link href="https://www.instagram.com/realtorpooya/" className="text-[#aa9578] hover:text-[#473729] transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>
              <Link href="https://www.linkedin.com/in/pooya-pirayesh-758998366/" className="text-[#aa9578] hover:text-[#473729] transition-colors" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery with back button */}
      <div className="relative">
        <PropertyImageGallery
          images={listingGalleryImages(listing)}
          videoUrl={listing.youtubeVideo || undefined}
          heroImage={listing.heroImage || undefined}
        />
        <div className="absolute top-4 left-4 z-30">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-black/40 transition-colors"
            aria-label="Back to listings"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="font-tenor-sans text-4xl md:text-5xl text-gray-900 mb-2">{address}</h1>
                <div className="flex items-center text-[#aa9578]">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-lg">
                    {listing.city}, {listing.province || 'ON'} {listing.postalCode}
                  </span>
                </div>
              </div>
              <ListingShareButtons title={`${address}, ${listing.city}`} />
            </div>

            <ListingBody listing={listing} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-tenor-sans text-3xl text-gray-900">
                      {listing.status === 'not_available' ? 'NOT AVAILABLE' : formatPrice(listing.price)}
                    </h3>
                    <Badge className={`px-3 py-1 rounded-full ${statusBadgeClass(listing.status)}`}>
                      {statusLabel(listing.status)}
                    </Badge>
                  </div>

                  {listing.propertyTax && !isSold && (
                    <div className="flex justify-between text-gray-600 mb-2">
                      <span>Property Tax:</span>
                      <span>${listing.propertyTax.toLocaleString()}/year</span>
                    </div>
                  )}

                  {listing.hoaFees && !isSold && (
                    <div className="flex justify-between text-gray-600">
                      <span>HOA Fees:</span>
                      <span>${listing.hoaFees.toLocaleString()}/month</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {isSold ? (
                    <Button disabled className="w-full bg-gray-400 text-gray-600 cursor-not-allowed rounded-full py-6 font-manrope text-lg mb-4">
                      Property Sold
                    </Button>
                  ) : (
                    <BookShowingButton fullWidth size="xl" className="mb-4" propertyId={listing.id} />
                  )}

                  <Link href="/contact">
                    <Button
                      variant="outline"
                      className="w-full border-[#aa9578] text-[#aa9578] hover:bg-[#f3ecdf] rounded-full py-6 font-manrope text-lg flex items-center justify-center mb-4"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Contact Agent
                    </Button>
                  </Link>
                </div>

                <div className="p-6 border-t border-gray-100">
                  <PropertyContactForm property={listing} />
                </div>

                <div className="p-6 bg-[#f3ecdf] border-t border-gray-100">
                  <h4 className="font-tenor-sans text-xl text-[#473729] mb-4">Agent Information</h4>
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 overflow-hidden relative">
                      <Image src="/images/agent-pooya.jpg" alt="Pooya Pirayeshakbari" fill sizes="64px" className="object-cover" />
                    </div>
                    <div>
                      <h5 className="font-manrope font-semibold text-[#473729]">Pooya Pirayeshakbari</h5>
                      <p className="text-[#aa9578]">Luxury Real Estate Specialist</p>
                      <p className="text-[#aa9578]">416-553-7707</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
