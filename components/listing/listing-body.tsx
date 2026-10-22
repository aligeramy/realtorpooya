import { Bed, Bath, Square, Calendar, Car } from 'lucide-react'
import PropertyFeatures from '@/components/property-features'
import VideoPlayer from '@/components/video-player'
import FloorPlans from './floor-plans'
import MatterportTour from './matterport-tour'
import type { Listing } from '@/lib/listing/load'
import { extractFeatures, getMatterportEmbedSrc, renderDescriptionContent, totalParkingSpaces } from '@/lib/listing/render'

interface ListingBodyProps {
  listing: Listing
}

/**
 * The property content shared by the branded listing page and the unbranded
 * page: key numbers, description, features, floor plans, video and 3D tour.
 * Server component; only the floor-plan lightbox, video and tour are client code.
 */
export function ListingBody({ listing }: ListingBodyProps) {
  const features = extractFeatures(listing)
  const parking = totalParkingSpaces(listing)
  const sqft = listing.squareFeet
  const matterportSrc = getMatterportEmbedSrc(listing.matterportUrl)
  const poster = listing.heroImage || listing.mediaUrls[0] || null

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-12 p-4 sm:p-6 bg-[#f3ecdf] rounded-2xl">
        <div className="flex flex-col items-center p-2 sm:p-0">
          <Bed className="h-6 w-6 sm:h-8 sm:w-8 text-[#aa9578] mb-1 sm:mb-2" />
          <span className="text-2xl sm:text-3xl font-tenor-sans font-semibold text-[#473729] mb-1">{listing.bedrooms || 'N/A'}</span>
          <span className="text-xs sm:text-sm text-gray-600 text-center">BEDROOMS</span>
        </div>
        <div className="flex flex-col items-center p-2 sm:p-0">
          <Bath className="h-6 w-6 sm:h-8 sm:w-8 text-[#aa9578] mb-1 sm:mb-2" />
          <span className="text-2xl sm:text-3xl font-tenor-sans font-semibold text-[#473729] mb-1">{listing.bathrooms ?? 'N/A'}</span>
          <span className="text-xs sm:text-sm text-gray-600 text-center">BATHROOMS</span>
        </div>
        <div className="flex flex-col items-center p-2 sm:p-0">
          <Square className="h-6 w-6 sm:h-8 sm:w-8 text-[#aa9578] mb-1 sm:mb-2" />
          <span className="text-2xl sm:text-3xl font-tenor-sans font-semibold text-[#473729] mb-1">
            {sqft ? sqft.toLocaleString() : 'N/A'}
          </span>
          <span className="text-xs sm:text-sm text-gray-600 text-center">SQ FT</span>
        </div>
        {parking ? (
          <div className="flex flex-col items-center p-2 sm:p-0">
            <Car className="h-6 w-6 sm:h-8 sm:w-8 text-[#aa9578] mb-1 sm:mb-2" />
            <span className="text-2xl sm:text-3xl font-tenor-sans font-semibold text-[#473729] mb-1">{parking}</span>
            <span className="text-xs sm:text-sm text-gray-600 text-center">PARKING</span>
          </div>
        ) : (
          <div className="flex flex-col items-center p-2 sm:p-0">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-[#aa9578] mb-1 sm:mb-2" />
            <span className="text-2xl sm:text-3xl font-tenor-sans font-semibold text-[#473729] mb-1">{listing.yearBuilt || 'N/A'}</span>
            <span className="text-xs sm:text-sm text-gray-600 text-center">BUILT</span>
          </div>
        )}
      </div>

      <div className="mb-12">
        <h2 className="font-tenor-sans text-2xl text-gray-900 mb-4">Description</h2>
        <div className="prose prose-gray max-w-none">{renderDescriptionContent(listing.description)}</div>
      </div>

      {features.length > 0 && (
        <div className="mb-12">
          <h2 className="font-tenor-sans text-2xl text-gray-900 mb-4">Features</h2>
          <PropertyFeatures features={features} />
        </div>
      )}

      {listing.floorPlans.length > 0 && (
        <div className="mb-12">
          <h2 className="font-tenor-sans text-2xl text-gray-900 mb-4">Floor Plans</h2>
          <FloorPlans plans={listing.floorPlans} />
        </div>
      )}

      {listing.youtubeVideo && (
        <div className="mb-12">
          <h2 className="font-tenor-sans text-2xl text-gray-900 mb-4">Video Tour</h2>
          <VideoPlayer videoUrl={listing.youtubeVideo} posterImage={listing.heroImage || undefined} />
        </div>
      )}

      {matterportSrc && (
        <div className="mb-12">
          <h2 className="font-tenor-sans text-2xl text-gray-900 mb-4">3D Virtual Tour</h2>
          <MatterportTour src={matterportSrc} poster={poster} />
        </div>
      )}
    </>
  )
}
