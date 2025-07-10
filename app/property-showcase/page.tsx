"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, MapPin, Calendar, Home, Bed, Bath, Square, Car, DollarSign, TrendingUp, Eye, EyeOff } from "lucide-react"
import TopNavMenu from "@/components/top-nav-menu"
import SiteFooter from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import ResponsiveLogo from "@/components/responsive-logo"

interface PropertyData {
  id: string
  title: string
  address: string
  city: string
  province: string
  status: "for_sale" | "sold" | "pending"
  price: number
  bedrooms: string  // Changed from number to string to support "3+1", "4+x" format
  bathrooms: number
  squareFeet: number
  lotSize: string
  yearBuilt: number
  propertyType: string
  propertyTax: number
  hoaFees: number
  listingDate: string
  soldDate?: string
  description: string
  features: string[]
  images: string[]
  heroImage: string
}

// Sample property data - this would typically come from an API or database
const propertyData: PropertyData = {
  id: "mw2506",
  title: "Luxury Waterfront Estate",
  address: "2506 Lakeshore Boulevard West",
  city: "Toronto",
  province: "ON",
  status: "sold",
  price: 4850000,
  bedrooms: "5+1",
  bathrooms: 4.5,
  squareFeet: 4200,
  lotSize: "80' x 150'",
  yearBuilt: 2019,
  propertyType: "Detached House",
  propertyTax: 10500,
  hoaFees: 350,
  listingDate: "2024-09-15",
  soldDate: "2024-11-20",
  description: "Exceptional waterfront estate offering unparalleled luxury and sophistication. This architectural masterpiece features soaring ceilings, floor-to-ceiling windows, and premium finishes throughout. The open-concept design seamlessly blends indoor and outdoor living with stunning lake views from every room.",
  features: [
    "Waterfront Location",
    "Private Beach Access",
    "Infinity Pool",
    "Wine Cellar",
    "Home Theater",
    "Gourmet Kitchen",
    "Master Suite with Spa",
    "3-Car Garage",
    "Smart Home System",
    "Outdoor Kitchen",
    "Private Dock",
    "Landscaped Gardens"
  ],
  images: [
    "/properties/1/1.jpg",
    "/properties/1/2.jpg",
    "/properties/1/3.jpg",
    "/properties/1/4.jpg",
    "/properties/1/5.jpg",
    "/properties/1/6.jpg",
    "/properties/1/7.jpg",
    "/properties/1/8.jpg"
  ],
  heroImage: "/properties/1/hero.jpg"
}

export default function PropertyShowcasePage() {
  const [showFinancialInfo, setShowFinancialInfo] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sold':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sold':
        return 'SOLD'
      case 'pending':
        return 'PENDING'
      default:
        return 'FOR SALE'
    }
  }

  const isSold = propertyData.status === 'sold'

  return (
    <main className="min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="w-full py-6 px-6 bg-white">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <Link href="/">
              <ResponsiveLogo variant="color" />
            </Link>
          </div>
          <TopNavMenu />
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <Link
          href="/"
          className="inline-flex items-center text-[#aa9578] hover:text-[#473729] transition-colors font-manrope"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Property Header */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center mb-4">
                <Badge className={`${getStatusColor(propertyData.status)} px-4 py-2 text-sm font-semibold`}>
                  {getStatusText(propertyData.status)}
                </Badge>
              </div>
              <h1 className="font-tenor-sans text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4">
                {propertyData.title}
              </h1>
              <div className="flex items-center justify-center text-gray-600 mb-6">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">{propertyData.address}, {propertyData.city}, {propertyData.province}</span>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-[#aa9578] mb-4">
                {formatPrice(propertyData.price)}
              </div>
              <div className="flex items-center justify-center space-x-8 text-gray-600">
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2" />
                  <span>{propertyData.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2" />
                  <span>{propertyData.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center">
                  <Square className="h-5 w-5 mr-2" />
                  <span>{propertyData.squareFeet.toLocaleString()} sq ft</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Property Images */}
      <section className="py-16 bg-[#f9f6f1]">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6">
                <Image
                  src={propertyData.images[selectedImageIndex]}
                  alt={`${propertyData.title} - Image ${selectedImageIndex + 1}`}
                  fill
                  className="object-contain bg-gray-100"
                />
              </div>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {propertyData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-[4/3] rounded-lg overflow-hidden transition-all ${
                      selectedImageIndex === index
                        ? 'ring-2 ring-[#aa9578] opacity-100'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Main Content */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h2 className="font-tenor-sans text-3xl text-gray-900 mb-6">Property Description</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-8">
                    {propertyData.description}
                  </p>

                  <h3 className="font-tenor-sans text-2xl text-gray-900 mb-6">Premium Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {propertyData.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-[#aa9578] rounded-full mr-3"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <h3 className="font-tenor-sans text-2xl text-gray-900 mb-6">Property Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-5 w-5 mr-3 text-[#aa9578]" />
                      <span>Listed: {formatDate(propertyData.listingDate)}</span>
                    </div>
                    {propertyData.soldDate && (
                      <div className="flex items-center text-gray-700">
                        <TrendingUp className="h-5 w-5 mr-3 text-[#aa9578]" />
                        <span>Sold: {formatDate(propertyData.soldDate)}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Card className="mb-8">
                    <CardContent className="p-6">
                      <h3 className="font-tenor-sans text-xl text-gray-900 mb-4">Property Details</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Property Type:</span>
                          <span className="font-medium">{propertyData.propertyType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Year Built:</span>
                          <span className="font-medium">{propertyData.yearBuilt}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lot Size:</span>
                          <span className="font-medium">{propertyData.lotSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Square Footage:</span>
                          <span className="font-medium">{propertyData.squareFeet.toLocaleString()} sq ft</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Financial Information - Hidden for Sold Properties */}
                  <Card className="mb-8">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-tenor-sans text-xl text-gray-900">Financial Information</h3>
                        {isSold && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowFinancialInfo(!showFinancialInfo)}
                            className="text-[#aa9578] hover:text-[#473729]"
                          >
                            {showFinancialInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        )}
                      </div>
                      
                      {(!isSold || showFinancialInfo) ? (
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Property Tax:</span>
                            <span className="font-medium">${propertyData.propertyTax.toLocaleString()}/year</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">HOA Fees:</span>
                            <span className="font-medium">${propertyData.hoaFees}/month</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Financial details hidden for sold properties</p>
                          <p className="text-xs mt-1">Click the eye icon to view</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Contact Card */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-tenor-sans text-xl text-gray-900 mb-4">Interested in This Property?</h3>
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4">
                          <Image
                            src="/images/agent-pooya.jpg"
                            alt="Pooya Pirayesh"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-tenor-sans text-lg text-gray-900">Pooya Pirayesh</h4>
                        <p className="text-[#aa9578] text-sm">Luxury Real Estate Specialist</p>
                      </div>
                      <div className="space-y-3">
                        <Button
                          asChild
                          className="w-full bg-[#aa9578] hover:bg-[#8a7a63] text-white rounded-full"
                        >
                          <Link href="/contact">Schedule Viewing</Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full border-[#aa9578] text-[#aa9578] hover:bg-[#aa9578] hover:text-white rounded-full"
                        >
                          <Link href="tel:416-553-7707">Call Now</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      <section className="py-16 bg-[#f9f6f1]">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-tenor-sans text-3xl md:text-4xl text-gray-900 mb-4">
                Similar Properties
              </h2>
              <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                Explore other exceptional properties in Toronto's luxury market
              </p>
            </motion.div>
            
            <div className="text-center">
              <Button
                asChild
                className="bg-[#aa9578] hover:bg-[#8a7a63] text-white rounded-full px-8 py-6 text-lg"
              >
                <Link href="#listings">View All Properties</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
} 