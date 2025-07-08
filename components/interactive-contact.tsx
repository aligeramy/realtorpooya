"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Home, DollarSign, Phone, Mail, User, Calendar, MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample properties for the buyer form
const sampleProperties = [
  {
    id: "prop1",
    title: "Modern Architectural Masterpiece",
    address: "123 Luxury Lane, Toronto",
    price: "$4,800,500",
    image: "/images/property-1.jpg",
    beds: 4,
    baths: 2,
  },
  {
    id: "prop2",
    title: "Contemporary Waterfront Villa",
    address: "456 Prestige Ave, Toronto",
    price: "$4,250,000",
    image: "/images/property-2.jpg",
    beds: 4,
    baths: 2,
  },
  {
    id: "prop3",
    title: "Mediterranean-inspired Luxury Estate",
    address: "789 Elite Street, Toronto",
    price: "$3,508,000",
    image: "/images/property-3.jpg",
    beds: 3,
    baths: 2,
  },
]

export default function InteractiveContact() {
  const [contactType, setContactType] = useState<"buy" | "sell" | null>(null)
  const [step, setStep] = useState(1)
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    budget: "",
    timeframe: "",
    bedrooms: "",
    bathrooms: "",
    propertyType: "",
    propertyAddress: "",
    propertySize: "",
    sellingReason: "",
  })
  const formRef = useRef<HTMLDivElement>(null)

  // Scroll to form when contact type is selected
  useEffect(() => {
    if (contactType && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [contactType])

  const handlePropertyToggle = (propertyId: string) => {
    setSelectedProperties((prev) =>
      prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId],
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the form data to your backend
    console.log("Form submitted:", { formData, selectedProperties })
    alert("Thank you for your submission! We'll be in touch soon.")
    // Reset form
    setContactType(null)
    setStep(1)
    setSelectedProperties([])
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      budget: "",
      timeframe: "",
      bedrooms: "",
      bathrooms: "",
      propertyType: "",
      propertyAddress: "",
      propertySize: "",
      sellingReason: "",
    })
  }

  const nextStep = () => {
    setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
  }

  return (
    <section className="py-24 bg-[#f9f6f1]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#aa9578] font-montserrat text-sm uppercase tracking-widest mb-4 block">
            Get in Touch
          </span>
          <h2 className="font-tenor-sans text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">How Can We Help You?</h2>
          <p className="text-gray-700 max-w-2xl mx-auto font-light">
            Whether you're looking to buy your dream home or sell your property for maximum value, we're here to guide
            you every step of the way.
          </p>
        </motion.div>

        {/* Contact Type Selection */}
        {!contactType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col md:flex-row justify-center gap-6 md:gap-12 max-w-4xl mx-auto"
          >
            <Link href="/contact" className="flex-1">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
                className="h-full"
            >
              <div className="bg-white rounded-2xl p-8 h-full cursor-pointer border border-[#e9e0cc] hover:border-[#aa9578] transition-colors">
                <div className="w-16 h-16 bg-[#f3ecdf] rounded-full flex items-center justify-center mb-6">
                  <Home className="h-8 w-8 text-[#aa9578]" />
                </div>
                <h3 className="font-tenor-sans text-2xl text-gray-900 mb-4">I Want to Buy</h3>
                <p className="text-gray-700 font-light mb-6">
                  Find your dream property with our expert guidance and exclusive listings.
                </p>
                <Button className="w-full bg-[#aa9578] hover:bg-[#8a7a63] rounded-full">Get Started</Button>
              </div>
            </motion.div>
            </Link>

            <Link href="/contact" className="flex-1">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
                className="h-full"
            >
              <div className="bg-white rounded-2xl p-8 h-full cursor-pointer border border-[#e9e0cc] hover:border-[#aa9578] transition-colors">
                <div className="w-16 h-16 bg-[#f3ecdf] rounded-full flex items-center justify-center mb-6">
                  <DollarSign className="h-8 w-8 text-[#aa9578]" />
                </div>
                <h3 className="font-tenor-sans text-2xl text-gray-900 mb-4">I Want to Sell</h3>
                <p className="text-gray-700 font-light mb-6">
                  Maximize your property's value with our strategic marketing and negotiation expertise.
                </p>
                <Button className="w-full bg-[#aa9578] hover:bg-[#8a7a63] rounded-full">Get Started</Button>
              </div>
            </motion.div>
            </Link>
          </motion.div>
        )}

        {/* Dynamic Form Based on Selection */}
        <AnimatePresence mode="wait">
          {contactType && (
            <motion.div
              ref={formRef}
              key={contactType}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto mt-16 bg-white rounded-2xl overflow-hidden border border-[#e9e0cc]"
            >
              {/* Form Header */}
              <div className="bg-[#f3ecdf] p-8 border-b border-[#e9e0cc]">
                <h3 className="font-tenor-sans text-3xl text-[#473729] mb-2">
                  {contactType === "buy" ? "Find Your Dream Home" : "Sell Your Property"}
                </h3>
                <p className="font-light text-[#8a7a63]">
                  {contactType === "buy"
                    ? "Tell us what you're looking for and we'll help you find it."
                    : "Let us help you get the best value for your property."}
                </p>
              </div>

              {/* Progress Steps */}
              <div className="px-8 pt-6">
                <div className="flex justify-between mb-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                          step >= i
                            ? "bg-[#f3ecdf] text-[#aa9578] border-[#aa9578]"
                            : "bg-white text-gray-400 border-gray-200"
                        }`}
                      >
                        {step > i ? <Check className="h-5 w-5" /> : i}
                      </div>
                      <span className={`text-xs mt-2 ${step >= i ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                        {contactType === "buy"
                          ? i === 1
                            ? "Your Info"
                            : i === 2
                              ? "Preferences"
                              : "Properties"
                          : i === 1
                            ? "Your Info"
                            : i === 2
                              ? "Property Details"
                              : "Additional Info"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-8">
                <AnimatePresence mode="wait">
                  {/* Buyer Form Steps */}
                  {contactType === "buy" && step === 1 && (
                    <motion.div
                      key="buy-step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Name</Label>
                          <div className="relative">
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="John Smith"
                              className="pl-10 h-12 rounded-lg border-[#e9e0cc] focus:border-[#aa9578] focus:ring-[#aa9578]"
                              required
                            />
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578]" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="john@example.com"
                              className="pl-10 h-12 rounded-lg border-[#e9e0cc] focus:border-[#aa9578] focus:ring-[#aa9578]"
                              required
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578]" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="(416) 555-1234"
                              className="pl-10 h-12 rounded-lg border-[#e9e0cc] focus:border-[#aa9578] focus:ring-[#aa9578]"
                              required
                            />
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578]" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timeframe">Timeframe</Label>
                          <div className="relative">
                            <Select
                              name="timeframe"
                              value={formData.timeframe}
                              onValueChange={(value) => setFormData((prev) => ({ ...prev, timeframe: value }))}
                            >
                              <SelectTrigger className="h-12 rounded-lg pl-10 border-[#e9e0cc]">
                                <SelectValue placeholder="When are you looking to buy?" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="immediate">Immediately</SelectItem>
                                <SelectItem value="1-3months">1-3 months</SelectItem>
                                <SelectItem value="3-6months">3-6 months</SelectItem>
                                <SelectItem value="6-12months">6-12 months</SelectItem>
                                <SelectItem value="just-browsing">Just browsing</SelectItem>
                              </SelectContent>
                            </Select>
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578]" />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-[#aa9578] hover:bg-[#8a7a63] rounded-full px-8"
                        >
                          Next Step
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {contactType === "buy" && step === 2 && (
                    <motion.div
                      key="buy-step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                          <Label htmlFor="budget">Budget Range</Label>
                          <Select
                            name="budget"
                            value={formData.budget}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, budget: value }))}
                          >
                            <SelectTrigger className="h-12 rounded-lg border-[#e9e0cc]">
                              <SelectValue placeholder="Select your budget range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under-1m">Under $1,000,000</SelectItem>
                              <SelectItem value="1m-2m">$1,000,000 - $2,000,000</SelectItem>
                              <SelectItem value="2m-3m">$2,000,000 - $3,000,000</SelectItem>
                              <SelectItem value="3m-5m">$3,000,000 - $5,000,000</SelectItem>
                              <SelectItem value="over-5m">Over $5,000,000</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="propertyType">Property Type</Label>
                          <Select
                            name="propertyType"
                            value={formData.propertyType}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, propertyType: value }))}
                          >
                            <SelectTrigger className="h-12 rounded-lg border-[#e9e0cc]">
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="house">House</SelectItem>
                              <SelectItem value="condo">Condo</SelectItem>
                              <SelectItem value="townhouse">Townhouse</SelectItem>
                              <SelectItem value="land">Land</SelectItem>
                              <SelectItem value="commercial">Commercial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bedrooms">Bedrooms</Label>
                          <Select
                            name="bedrooms"
                            value={formData.bedrooms}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, bedrooms: value }))}
                          >
                            <SelectTrigger className="h-12 rounded-lg border-[#e9e0cc]">
                              <SelectValue placeholder="Select number of bedrooms" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1+ Bedroom</SelectItem>
                              <SelectItem value="2">2+ Bedrooms</SelectItem>
                              <SelectItem value="3">3+ Bedrooms</SelectItem>
                              <SelectItem value="4">4+ Bedrooms</SelectItem>
                              <SelectItem value="5">5+ Bedrooms</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bathrooms">Bathrooms</Label>
                          <Select
                            name="bathrooms"
                            value={formData.bathrooms}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, bathrooms: value }))}
                          >
                            <SelectTrigger className="h-12 rounded-lg border-[#e9e0cc]">
                              <SelectValue placeholder="Select number of bathrooms" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1+ Bathroom</SelectItem>
                              <SelectItem value="2">2+ Bathrooms</SelectItem>
                              <SelectItem value="3">3+ Bathrooms</SelectItem>
                              <SelectItem value="4">4+ Bathrooms</SelectItem>
                              <SelectItem value="5">5+ Bathrooms</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2 mb-8">
                        <Label htmlFor="message">Additional Requirements</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us more about what you're looking for..."
                          className="min-h-[120px] rounded-lg border-[#e9e0cc] focus:border-[#aa9578] focus:ring-[#aa9578]"
                        />
                      </div>

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          className="rounded-full px-8 border-[#e9e0cc] text-[#aa9578] hover:bg-[#f9f6f1] hover:text-[#8a7a63]"
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-[#aa9578] hover:bg-[#8a7a63] rounded-full px-8"
                        >
                          Next Step
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {contactType === "buy" && step === 3 && (
                    <motion.div
                      key="buy-step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-6">
                        <h4 className="font-tenor-sans text-xl text-gray-900 mb-4">
                          Select Properties You're Interested In
                        </h4>
                        <p className="text-gray-600 font-light mb-6">
                          Click on the properties you'd like to learn more about or schedule a viewing.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                          {sampleProperties.map((property) => (
                            <motion.div
                              key={property.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                                selectedProperties.includes(property.id) ? "border-[#aa9578]" : "border-[#e9e0cc]"
                              }`}
                              onClick={() => handlePropertyToggle(property.id)}
                            >
                              <div className="relative aspect-[4/3]">
                                <Image
                                  src={property.image || "/placeholder.svg"}
                                  alt={property.title}
                                  fill
                                  className="object-cover"
                                />
                                {selectedProperties.includes(property.id) && (
                                  <div className="absolute top-2 right-2 bg-[#aa9578] text-white rounded-full p-1">
                                    <Check className="h-4 w-4" />
                                  </div>
                                )}
                              </div>
                              <div className="p-4 bg-white">
                                <h5 className="font-tenor-sans text-lg text-gray-900 mb-1 truncate">
                                  {property.title}
                                </h5>
                                <div className="flex items-center text-gray-500 text-sm mb-2">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span className="truncate">{property.address}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-[#aa9578]">{property.price}</span>
                                  <div className="text-xs text-gray-500">
                                    {property.beds} beds • {property.baths} baths
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          className="rounded-full px-8 border-[#e9e0cc] text-[#aa9578] hover:bg-[#f9f6f1] hover:text-[#8a7a63]"
                        >
                          Back
                        </Button>
                        <Button type="submit" className="bg-[#aa9578] hover:bg-[#8a7a63] rounded-full px-8">
                          Submit Request
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Seller Form Steps */}
                  {contactType === "sell" && step === 1 && (
                    <motion.div
                      key="sell-step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Name</Label>
                          <div className="relative">
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="John Smith"
                              className="pl-10 h-12 rounded-lg border-[#e9e0cc] focus:border-[#aa9578] focus:ring-[#aa9578]"
                              required
                            />
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578]" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="john@example.com"
                              className="pl-10 h-12 rounded-lg border-[#e9e0cc] focus:border-[#aa9578] focus:ring-[#aa9578]"
                              required
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578]" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="(416) 555-1234"
                              className="pl-10 h-12 rounded-lg border-[#e9e0cc] focus:border-[#aa9578] focus:ring-[#aa9578]"
                              required
                            />
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578]" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timeframe">Timeframe</Label>
                          <div className="relative">
                            <Select
                              name="timeframe"
                              value={formData.timeframe}
                              onValueChange={(value) => setFormData((prev) => ({ ...prev, timeframe: value }))}
                            >
                              <SelectTrigger className="h-12 rounded-lg pl-10 border-[#e9e0cc]">
                                <SelectValue placeholder="When are you looking to sell?" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="immediate">Immediately</SelectItem>
                                <SelectItem value="1-3months">1-3 months</SelectItem>
                                <SelectItem value="3-6months">3-6 months</SelectItem>
                                <SelectItem value="6-12months">6-12 months</SelectItem>
                                <SelectItem value="just-exploring">Just exploring options</SelectItem>
                              </SelectContent>
                            </Select>
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578]" />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-[#aa9578] hover:bg-[#8a7a63] rounded-full px-8"
                        >
                          Next Step
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {contactType === "sell" && step === 2 && (
                    <motion.div
                      key="sell-step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                          <Label htmlFor="propertyAddress">Property Address</Label>
                          <div className="relative">
                            <Input
                              id="propertyAddress"
                              name="propertyAddress"
                              value={formData.propertyAddress}
                              onChange={handleInputChange}
                              placeholder="123 Main St, Toronto, ON"
                              className="pl-10 h-12 rounded-lg border-[#e9e0cc] focus:border-[#aa9578] focus:ring-[#aa9578]"
                              required
                            />
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578]" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="propertyType">Property Type</Label>
                          <Select
                            name="propertyType"
                            value={formData.propertyType}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, propertyType: value }))}
                          >
                            <SelectTrigger className="h-12 rounded-lg border-[#e9e0cc]">
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="house">House</SelectItem>
                              <SelectItem value="condo">Condo</SelectItem>
                              <SelectItem value="townhouse">Townhouse</SelectItem>
                              <SelectItem value="land">Land</SelectItem>
                              <SelectItem value="commercial">Commercial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bedrooms">Bedrooms</Label>
                          <Select
                            name="bedrooms"
                            value={formData.bedrooms}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, bedrooms: value }))}
                          >
                            <SelectTrigger className="h-12 rounded-lg border-[#e9e0cc]">
                              <SelectValue placeholder="Select number of bedrooms" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Bedroom</SelectItem>
                              <SelectItem value="2">2 Bedrooms</SelectItem>
                              <SelectItem value="3">3 Bedrooms</SelectItem>
                              <SelectItem value="4">4 Bedrooms</SelectItem>
                              <SelectItem value="5">5+ Bedrooms</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bathrooms">Bathrooms</Label>
                          <Select
                            name="bathrooms"
                            value={formData.bathrooms}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, bathrooms: value }))}
                          >
                            <SelectTrigger className="h-12 rounded-lg border-[#e9e0cc]">
                              <SelectValue placeholder="Select number of bathrooms" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Bathroom</SelectItem>
                              <SelectItem value="2">2 Bathrooms</SelectItem>
                              <SelectItem value="3">3 Bathrooms</SelectItem>
                              <SelectItem value="4">4 Bathrooms</SelectItem>
                              <SelectItem value="5">5+ Bathrooms</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="propertySize">Property Size (sq ft)</Label>
                          <Input
                            id="propertySize"
                            name="propertySize"
                            value={formData.propertySize}
                            onChange={handleInputChange}
                            placeholder="e.g. 2,000"
                            className="h-12 rounded-lg border-[#e9e0cc] focus:border-[#aa9578] focus:ring-[#aa9578]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          className="rounded-full px-8 border-[#e9e0cc] text-[#aa9578] hover:bg-[#f9f6f1] hover:text-[#8a7a63]"
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-[#aa9578] hover:bg-[#8a7a63] rounded-full px-8"
                        >
                          Next Step
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {contactType === "sell" && step === 3 && (
                    <motion.div
                      key="sell-step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-6 mb-8">
                        <div className="space-y-2">
                          <Label htmlFor="sellingReason">Reason for Selling</Label>
                          <Select
                            name="sellingReason"
                            value={formData.sellingReason}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, sellingReason: value }))}
                          >
                            <SelectTrigger className="h-12 rounded-lg border-[#e9e0cc]">
                              <SelectValue placeholder="Select your primary reason" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="upgrading">Upgrading to a larger home</SelectItem>
                              <SelectItem value="downsizing">Downsizing</SelectItem>
                              <SelectItem value="relocating">Relocating</SelectItem>
                              <SelectItem value="investment">Investment decision</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Additional Information</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Tell us more about your property and any specific requirements..."
                            className="min-h-[120px] rounded-lg border-[#e9e0cc] focus:border-[#aa9578] focus:ring-[#aa9578]"
                          />
                        </div>

                        <div className="p-6 bg-[#f9f6f1] rounded-xl border border-[#e9e0cc]">
                          <h5 className="font-tenor-sans text-lg text-gray-900 mb-4">Our Selling Process</h5>
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <div className="bg-white rounded-full p-1 mr-3 mt-0.5 border border-[#e9e0cc]">
                                <Check className="h-3 w-3 text-[#aa9578]" />
                              </div>
                              <span className="text-gray-700 font-light">Free property valuation</span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-white rounded-full p-1 mr-3 mt-0.5 border border-[#e9e0cc]">
                                <Check className="h-3 w-3 text-[#aa9578]" />
                              </div>
                              <span className="text-gray-700 font-light">
                                Professional photography and virtual tours
                              </span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-white rounded-full p-1 mr-3 mt-0.5 border border-[#e9e0cc]">
                                <Check className="h-3 w-3 text-[#aa9578]" />
                              </div>
                              <span className="text-gray-700 font-light">
                                Strategic marketing to our exclusive buyer network
                              </span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-white rounded-full p-1 mr-3 mt-0.5 border border-[#e9e0cc]">
                                <Check className="h-3 w-3 text-[#aa9578]" />
                              </div>
                              <span className="text-gray-700 font-light">
                                Expert negotiation to maximize your sale price
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          className="rounded-full px-8 border-[#e9e0cc] text-[#aa9578] hover:bg-[#f9f6f1] hover:text-[#8a7a63]"
                        >
                          Back
                        </Button>
                        <Button type="submit" className="bg-[#aa9578] hover:bg-[#8a7a63] rounded-full px-8">
                          Submit Request
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              {/* Form Footer */}
              <div className="bg-[#f9f6f1] p-6 text-center border-t border-[#e9e0cc]">
                <p className="text-gray-500 text-sm">
                  By submitting this form, you agree to our{" "}
                  <a href="#" className="text-[#aa9578] hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => setContactType(null)}
                className="absolute top-4 right-4 text-[#aa9578] hover:text-[#8a7a63]"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
