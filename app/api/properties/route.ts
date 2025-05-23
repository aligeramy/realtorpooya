import { NextResponse } from "next/server"
import type { Property } from "@/types/property"

// Mock data for properties
const mockProperties: Property[] = [
  {
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
    hero_image: "/images/property-1.jpg",
    status: "for_sale",
    listing_date: new Date().toISOString(),
    description: "Modern architectural masterpiece with floor-to-ceiling windows and open concept living",
  },
  {
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
    description: "Contemporary waterfront villa with infinity pool and stunning night lighting",
  },
  {
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
    description: "Mediterranean-inspired luxury estate with pool and elegant columns",
  },
]

export async function GET(request: Request) {
  // In a real app, you would fetch properties from a database
  // const properties = await db.query('SELECT * FROM properties WHERE status = $1', ['for_sale'])

  return NextResponse.json(mockProperties)
}
