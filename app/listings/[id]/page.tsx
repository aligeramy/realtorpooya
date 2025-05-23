import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Bath, Square, Calendar, Home, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TopNavMenu from '@/components/top-nav-menu';
import SiteFooter from '@/components/site-footer';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { query } from '@/lib/db/connection';
import { MediaService } from '@/lib/services/media-service';
import type { Property } from '@/types/property';

// Mock properties for featured listings
const mockProperties: Record<string, Property> = {
  "1": {
    id: "1",
    address: "266 Westlake Ave",
    city: "Toronto",
    province: "ON",
    postal_code: "M5M 3H5",
    property_type: "house",
    price: 4800500,
    bedrooms: 4,
    bathrooms: 3,
    square_feet: 3200,
    lot_dimensions: "50 x 120 ft",
    year_built: 2020,
    features: [
      "Floor-to-Ceiling Windows",
      "Open Concept Design",
      "Smart Home System",
      "Heated Floors",
      "Walk-in Closet",
      "Home Theater",
      "Wine Cellar",
      "Chef's Kitchen",
    ],
    hero_image: "/properties/1/hero.jpg",
    status: "for_sale",
    listing_date: new Date().toISOString(),
    description:
      "Modern architectural masterpiece with floor-to-ceiling windows and open concept living. This stunning contemporary home features sleek lines, abundant natural light, and premium finishes throughout. The perfect blend of luxury and functionality in Toronto's most prestigious neighborhood.",
    media_urls: [
      "/properties/1/1.jpg",
      "/properties/1/2.jpg",
      "/properties/1/3.jpg",
      "/properties/1/4.jpg",
      "/properties/1/5.jpg",
      "/properties/1/6.jpg",
      "/properties/1/7.jpg",
      "/properties/1/8.jpg",
      "/properties/1/9.jpg",
      "/properties/1/10.jpg",
      "/properties/1/11.jpg",
      "/properties/1/12.jpg",
      "/properties/1/13.jpg",
      "/properties/1/14.jpg",
      "/properties/1/15.jpg",
    ],
    youtube_video: "https://www.youtube.com/watch?v=PpAnSuBf7Fc",
    property_tax: 12000,
    hoa_fees: 500,
    more: {
      Parking: "2-Car Garage",
      Cooling: "Central Air",
      Heating: "Forced Air, Radiant",
      Basement: "Finished, Walkout",
      Roof: "Flat Roof",
      View: "City, Park",
      Fireplace: "2 Gas Fireplaces",
    },
  },
  "2": {
    id: "2",
    address: "10 Howick Ln",
    city: "Toronto",
    province: "ON",
    postal_code: "M2N 0B4",
    property_type: "house",
    price: 4250000,
    bedrooms: 5,
    bathrooms: 4,
    square_feet: 3500,
    hero_image: "/properties/2/hero.jpg",
    status: "for_sale",
    listing_date: new Date().toISOString(),
    description:
      "Contemporary waterfront villa with infinity pool and stunning night lighting. This architectural gem offers breathtaking views and seamless indoor-outdoor living. Perfect for the discerning buyer seeking luxury and privacy.",
    media_urls: [
      "/properties/2/1.jpg",
      "/properties/2/2.jpg",
      "/properties/2/3.jpg",
      "/properties/2/4.jpg",
      "/properties/2/5.jpg",
      "/properties/2/6.jpg",
      "/properties/2/7.jpg",
      "/properties/2/8.jpg",
      "/properties/2/9.jpg",
      "/properties/2/10.jpg",
      "/properties/2/11.jpg",
      "/properties/2/12.jpg",
      "/properties/2/13.jpg",
      "/properties/2/14.jpg",
      "/properties/2/15.jpg",
      "/properties/2/16.jpg",
      "/properties/2/17.jpg",
      "/properties/2/18.jpg",
      "/properties/2/19.jpg",
      "/properties/2/20.jpg",
      "/properties/2/21.jpg",
      "/properties/2/22.jpg",
      "/properties/2/23.jpg",
      "/properties/2/24.jpg",
      "/properties/2/25.jpg",
      "/properties/2/26.jpg",
      "/properties/2/27.jpg",
      "/properties/2/28.jpg",
      "/properties/2/29.jpg",
      "/properties/2/30.jpg",
    ],
    youtube_video: "https://www.youtube.com/watch?v=O6CvUZSxeT0",
    features: [
      "Infinity Pool",
      "Waterfront",
      "Outdoor Lighting",
      "Rooftop Terrace",
      "Smart Home",
      "Floor-to-Ceiling Windows",
    ],
    year_built: 2021,
    property_tax: 10500,
    hoa_fees: 350,
    more: {
      Parking: "3-Car Garage",
      Cooling: "Central Air",
      Heating: "Forced Air",
      Basement: "Finished",
      Roof: "Slate",
      View: "Waterfront",
      Fireplace: "3 Gas Fireplaces",
    },
  },
};

async function getListingData(id: string) {
  // Check if it's a mock property first
  if (mockProperties[id]) {
    return { mockProperty: mockProperties[id] };
  }

  try {
    // Get listing details from database
    const listingResult = await query(`
      SELECT 
        id,
        listing_key,
        unparsed_address,
        street_number,
        street_name,
        street_suffix,
        unit_number,
        city,
        province,
        postal_code,
        property_type,
        property_sub_type,
        bedrooms_total,
        bathrooms_total,
        bathrooms_total_integer,
        living_area,
        lot_size_area,
        list_price,
        public_remarks,
        media_keys,
        preferred_media_key,
        virtual_tour_url,
        list_date,
        latitude,
        longitude,
        year_built,
        parking_features,
        interior_features,
        exterior_features,
        rooms_total,
        kitchens_total
      FROM listings 
      WHERE id = $1 AND standard_status = 'Active'
      LIMIT 1
    `, [id]);

    if (listingResult.rows.length === 0) {
      return null;
    }

    const listing = listingResult.rows[0];

    // Get media for this listing
    const media = await MediaService.getListingMedia(id);

    return {
      listing,
      media
    };
  } catch (error) {
    console.error('Error fetching listing:', error);
    return null;
  }
}

interface PageProps {
  params: { id: string }
}

export default async function ListingDetailPage({ params }: PageProps) {
  const data = await getListingData(params.id);

  if (!data) {
    notFound();
  }

  // Handle mock property
  if ('mockProperty' in data) {
    const property = data.mockProperty;
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/">
                <Image
                  src="/images/logo-color.png"
                  alt="Pooya Pirayesh Luxury Real Estate"
                  width={180}
                  height={60}
                  className="h-auto"
                />
              </Link>

              {/* Navigation */}
              <div className="flex items-center space-x-6">
                <div className="hidden md:flex items-center text-gray-700 font-manrope">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>416-553-7707</span>
                </div>
                
                <TopNavMenu />
                
                {/* Social Media */}
                <div className="hidden md:flex items-center space-x-4">
                  <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                    <Facebook className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                    <Instagram className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {/* Image Gallery */}
          <section className="relative">
            <div className="relative h-[60vh] md:h-[70vh] bg-gray-900">
              <Image
                src={property.hero_image!}
                alt={property.address}
                fill
                className="object-cover"
                priority
              />
              {property.media_urls && property.media_urls.length > 0 && (
                <div className="absolute bottom-4 right-4">
                  <Badge className="bg-black/70 text-white">
                    {property.media_urls.length + 1} Photos
                  </Badge>
                </div>
              )}
            </div>
          </section>

          {/* Property Details */}
          <section className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Details */}
              <div className="lg:col-span-2">
                {/* Title and Price */}
                <div className="mb-6">
                  <h1 className="font-tenor-sans text-3xl md:text-4xl text-gray-900 mb-2">
                    {property.address}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{property.city}, {property.province} {property.postal_code}</span>
                  </div>
                  <div className="text-4xl font-semibold text-[#aa9578]">
                    ${property.price.toLocaleString()}
                  </div>
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-sm">
                    <Bed className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-semibold">{property.bedrooms}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-sm">
                    <Bath className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-semibold">{property.bathrooms}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-sm">
                    <Square className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-semibold">{property.square_feet?.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Sq Ft</div>
                    </div>
                  </div>
                  {property.year_built && (
                    <div className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-sm">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="font-semibold">{property.year_built}</div>
                        <div className="text-sm text-gray-600">Year Built</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                  <h2 className="font-tenor-sans text-2xl text-gray-900 mb-4">About This Property</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {property.description}
                  </p>
                </div>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <h2 className="font-tenor-sans text-2xl text-gray-900 mb-4">Features</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-[#aa9578] rounded-full mr-3"></span>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Details */}
                {property.more && Object.keys(property.more).length > 0 && (
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="font-tenor-sans text-2xl text-gray-900 mb-4">Additional Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(property.more).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Contact */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                  <h3 className="font-tenor-sans text-xl text-gray-900 mb-4">Interested in this property?</h3>
                  <div className="space-y-4">
                    <Button className="w-full bg-[#aa9578] hover:bg-[#9a8568] text-white">
                      Book a Showing
                    </Button>
                    <Button variant="outline" className="w-full">
                      Request More Info
                    </Button>
                  </div>
                  
                  {property.property_tax && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Property Tax:</span>
                          <span className="font-medium">${property.property_tax.toLocaleString()}/year</span>
                        </div>
                        {property.hoa_fees && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">HOA Fees:</span>
                            <span className="font-medium">${property.hoa_fees.toLocaleString()}/month</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 pt-6 border-t">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 mb-1">Pooya Pirayesh</div>
                      <div className="text-gray-600 text-sm mb-3">Luxury Real Estate Specialist</div>
                      <div className="space-y-2">
                        <a href="tel:416-553-7707" className="flex items-center justify-center text-gray-700 hover:text-[#aa9578]">
                          <Phone className="h-4 w-4 mr-2" />
                          416-553-7707
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <SiteFooter />
      </div>
    );
  }

  // Handle database property (existing code continues below)
  const { listing, media } = data;

  // Format address
  const address = `${listing.street_number} ${listing.street_name} ${listing.street_suffix || ''}`.trim();
  const fullAddress = listing.unit_number ? `${listing.unit_number} - ${address}` : address;

  // Format price
  const price = parseFloat(listing.list_price || 0);
  const formattedPrice = price.toLocaleString('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0
  });

  // Get image URLs
  const imageUrls = media
    .filter(m => m.media_type?.includes('image') || m.media_type === 'Photo')
    .map(m => m.media_url)
    .filter(Boolean);

  // Get primary image
  const primaryImage = media.find(m => m.is_preferred)?.media_url || imageUrls[0] || '/placeholder.jpg';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <Image
                src="/images/logo-color.png"
                alt="Pooya Pirayesh Luxury Real Estate"
                width={180}
                height={60}
                className="h-auto"
              />
            </Link>

            {/* Navigation */}
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center text-gray-700 font-manrope">
                <Phone className="h-4 w-4 mr-2" />
                <span>416-553-7707</span>
              </div>
              
              <TopNavMenu />
              
              {/* Social Media */}
              <div className="hidden md:flex items-center space-x-4">
                <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Image Gallery */}
        <section className="relative">
          {imageUrls.length > 0 ? (
            <div className="relative h-[60vh] md:h-[70vh] bg-gray-900">
              <Image
                src={primaryImage}
                alt={fullAddress}
                fill
                className="object-cover"
                priority
              />
              {imageUrls.length > 1 && (
                <div className="absolute bottom-4 right-4">
                  <Badge className="bg-black/70 text-white">
                    {imageUrls.length} Photos
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="relative h-[60vh] md:h-[70vh] bg-gray-200 flex items-center justify-center">
              <Home className="h-24 w-24 text-gray-400" />
            </div>
          )}
        </section>

        {/* Property Details */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2">
              {/* Title and Price */}
              <div className="mb-6">
                <h1 className="font-tenor-sans text-3xl md:text-4xl text-gray-900 mb-2">
                  {fullAddress}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{listing.city}, {listing.province} {listing.postal_code}</span>
                </div>
                <div className="text-4xl font-semibold text-[#aa9578]">
                  {formattedPrice}
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {listing.bedrooms_total && (
                  <div className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-sm">
                    <Bed className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-semibold">{listing.bedrooms_total}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                  </div>
                )}
                {(listing.bathrooms_total || listing.bathrooms_total_integer) && (
                  <div className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-sm">
                    <Bath className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-semibold">{listing.bathrooms_total || listing.bathrooms_total_integer}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                  </div>
                )}
                {listing.living_area && (
                  <div className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-sm">
                    <Square className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-semibold">{Math.round(listing.living_area).toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Sq Ft</div>
                    </div>
                  </div>
                )}
                {listing.year_built && (
                  <div className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-sm">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-semibold">{listing.year_built}</div>
                      <div className="text-sm text-gray-600">Year Built</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {listing.public_remarks && (
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                  <h2 className="font-tenor-sans text-2xl text-gray-900 mb-4">About This Property</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {listing.public_remarks}
                  </p>
                </div>
              )}

              {/* Additional Details */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="font-tenor-sans text-2xl text-gray-900 mb-4">Property Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">General</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Type:</dt>
                        <dd className="font-medium">{listing.property_type}</dd>
                      </div>
                      {listing.property_sub_type && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Style:</dt>
                          <dd className="font-medium">{listing.property_sub_type}</dd>
                        </div>
                      )}
                      {listing.lot_size_area && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Lot Size:</dt>
                          <dd className="font-medium">{Math.round(listing.lot_size_area).toLocaleString()} sq ft</dd>
                        </div>
                      )}
                      {listing.rooms_total && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Total Rooms:</dt>
                          <dd className="font-medium">{listing.rooms_total}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  {/* Features */}
                  <div>
                    {listing.interior_features && listing.interior_features.length > 0 && (
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Interior Features</h3>
                        <div className="flex flex-wrap gap-2">
                          {listing.interior_features.slice(0, 5).map((feature: string, index: number) => (
                            <Badge key={index} variant="secondary">{feature}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {listing.parking_features && listing.parking_features.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Parking</h3>
                        <div className="flex flex-wrap gap-2">
                          {listing.parking_features.map((feature: string, index: number) => (
                            <Badge key={index} variant="secondary">{feature}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                <h3 className="font-tenor-sans text-xl text-gray-900 mb-4">Interested in this property?</h3>
                <div className="space-y-4">
                  <Button className="w-full bg-[#aa9578] hover:bg-[#9a8568] text-white">
                    Book a Showing
                  </Button>
                  <Button variant="outline" className="w-full">
                    Request More Info
                  </Button>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 mb-1">Pooya Pirayesh</div>
                    <div className="text-gray-600 text-sm mb-3">Luxury Real Estate Specialist</div>
                    <div className="space-y-2">
                      <a href="tel:416-553-7707" className="flex items-center justify-center text-gray-700 hover:text-[#aa9578]">
                        <Phone className="h-4 w-4 mr-2" />
                        416-553-7707
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
