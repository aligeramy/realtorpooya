import { NextResponse } from "next/server"
import type { Property } from "@/types/property"

// Mock data for a single property
const mockProperties: Record<string, Property> = {
  "1": {
    id: "1",
    address: "123 Luxury Lane",
    city: "Toronto",
    province: "ON",
    postal_code: "M5V 2A1",
    property_type: "house",
    price: 4800500,
    bedrooms: 4,
    bathrooms: 2,
    square_feet: 2824,
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
    hero_image: "/images/property-1.jpg",
    status: "for_sale",
    listing_date: new Date().toISOString(),
    description:
      "Modern architectural masterpiece with floor-to-ceiling windows and open concept living. This stunning contemporary home features sleek lines, abundant natural light, and premium finishes throughout. The perfect blend of luxury and functionality in Toronto's most prestigious neighborhood.",
    media_urls: [
      "/images/property-interior-1.jpg",
      "/images/property-interior-2.png",
      "/images/property-interior-3.png",
      "/images/property-interior-4.png",
    ],
    youtube_video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
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
    address: "456 Prestige Ave",
    city: "Toronto",
    province: "ON",
    postal_code: "M4W 1A3",
    property_type: "house",
    price: 4250000,
    bedrooms: 4,
    bathrooms: 2,
    square_feet: 2820,
    hero_image: "/images/property-2.jpg",
    status: "for_sale",
    listing_date: new Date().toISOString(),
    description:
      "Contemporary waterfront villa with infinity pool and stunning night lighting. This architectural gem offers breathtaking views and seamless indoor-outdoor living. Perfect for the discerning buyer seeking luxury and privacy.",
    media_urls: ["/images/property-interior-1.jpg", "/images/property-interior-2.png"],
    features: [
      "Infinity Pool",
      "Waterfront",
      "Outdoor Lighting",
      "Rooftop Terrace",
      "Smart Home",
      "Floor-to-Ceiling Windows",
    ],
  },
  "3": {
    id: "3",
    address: "789 Elite Street",
    city: "Toronto",
    province: "ON",
    postal_code: "M5R 2S8",
    property_type: "house",
    price: 3508000,
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 2640,
    hero_image: "/images/property-3.jpg",
    status: "for_sale",
    listing_date: new Date().toISOString(),
    description:
      "Mediterranean-inspired luxury estate with pool and elegant columns. This timeless property combines classic architecture with modern amenities, offering a serene retreat in the heart of the city.",
    features: ["Swimming Pool", "Columns", "Mediterranean Style", "Landscaped Garden", "Outdoor Living Space"],
  },
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // In a real app, you would fetch the property from a database
  // const property = await db.query('SELECT * FROM properties WHERE id = $1', [id])

  const property = mockProperties[id]

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 })
  }

  return NextResponse.json(property)
}
