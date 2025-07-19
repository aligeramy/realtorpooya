"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Send, User, MessageSquare, Calendar, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

function ContactForm() {
  const searchParams = useSearchParams()
  const typeParam = searchParams.get("type")
  
  // Initialize formData with prefilled inquiryType if typeParam exists
  const getInitialInquiryType = () => {
    if (typeParam === "buy") return "buying"
    if (typeParam === "sell") return "selling"
    return ""
  }
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    inquiryType: getInitialInquiryType(),
    preferredContact: "",
    timeline: "",
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  // Debug log to check if typeParam is being received
  useEffect(() => {
    console.log("typeParam:", typeParam)
    if (typeParam) {
      const inquiryType = typeParam === "buy" ? "buying" : typeParam === "sell" ? "selling" : ""
      console.log("Setting inquiryType to:", inquiryType)
      if (inquiryType) {
        setFormData(prev => ({ ...prev, inquiryType }))
      }
    }
  }, [typeParam])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          inquiryType: "",
          preferredContact: "",
          timeline: "",
        })
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f6f1] to-[#f3ecdf]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-[#e9e0cc]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image
                src="/icon.png"
                alt="Pooya Pirayeshakbari Luxury Real Estate"
                width={40}
                height={40}
                className="h-auto w-auto text-[#aa9578]"
              />
            </Link>
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-[#aa9578]">
                <Phone className="h-4 w-4 mr-2" />
                <span className="font-medium">416-553-7707</span>
              </div>
              <div className="flex items-center text-[#aa9578]">
                <Mail className="h-4 w-4 mr-2" />
                <span className="font-medium">sold@realtorpooya.ca</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="font-tenor-sans text-4xl md:text-5xl lg:text-6xl text-[#473729] mb-6">
              Let's Start a Conversation
            </h1>
            <p className="text-[#8a7a63] text-lg max-w-2xl mx-auto font-light">
              Ready to make your real estate dreams a reality? Get in touch today and let's discuss how we can help you achieve your goals.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <Card className="border-[#e9e0cc] shadow-xl">
                <CardContent className="p-8">
                  <div className="mb-8">
                    <h2 className="font-tenor-sans text-2xl text-[#473729] mb-2">Send us a Message</h2>
                    <p className="text-[#8a7a63] font-light">Fill out the form below and we'll get back to you within 24 hours.</p>
                  </div>

                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center text-green-800">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </motion.svg>
                        </div>
                        <span className="font-medium">Message sent successfully! We'll be in touch soon.</span>
                      </div>
                    </motion.div>
                  )}

                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex items-center text-red-800">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm">!</span>
                        </div>
                        <span className="font-medium">Something went wrong. Please try again or call us directly.</span>
                      </div>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                        <div className="relative">
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="h-14 pl-12 rounded-xl border-gray-200 bg-gray-50 hover:bg-white transition-colors"
                            placeholder="John Smith"
                            required
                          />
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#aa9578]" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                        <div className="relative">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="h-14 pl-12 rounded-xl border-gray-200 bg-gray-50 hover:bg-white transition-colors"
                            placeholder="john@example.com"
                            required
                          />
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#aa9578]" />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                        <div className="relative">
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="h-14 pl-12 rounded-xl border-gray-200 bg-gray-50 hover:bg-white transition-colors"
                            placeholder="(416) 555-0123"
                          />
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#aa9578]" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="inquiryType" className="text-gray-700 font-medium">Inquiry Type</Label>
                        <Select
                          name="inquiryType"
                          value={formData.inquiryType}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, inquiryType: value }))}
                        >
                          <SelectTrigger className="h-14 rounded-xl border-gray-200 bg-gray-50 hover:bg-white transition-colors">
                            <SelectValue placeholder="Select inquiry type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="buying">I'm Looking to Buy</SelectItem>
                            <SelectItem value="selling">I'm Looking to Sell</SelectItem>
                            <SelectItem value="investing">Investment Opportunities</SelectItem>
                            <SelectItem value="consultation">Market Consultation</SelectItem>
                            <SelectItem value="valuation">Property Valuation</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="preferredContact" className="text-gray-700 font-medium">Preferred Contact Method</Label>
                        <Select
                          name="preferredContact"
                          value={formData.preferredContact}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, preferredContact: value }))}
                        >
                          <SelectTrigger className="h-14 rounded-xl border-gray-200 bg-gray-50 hover:bg-white transition-colors">
                            <SelectValue placeholder="How should we contact you?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone Call</SelectItem>
                            <SelectItem value="text">Text Message</SelectItem>
                            <SelectItem value="any">Any Method</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeline" className="text-gray-700 font-medium">Timeline</Label>
                        <Select
                          name="timeline"
                          value={formData.timeline}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}
                        >
                          <SelectTrigger className="h-14 rounded-xl border-gray-200 bg-gray-50 hover:bg-white transition-colors">
                            <SelectValue placeholder="When are you looking to buy?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediately">Immediately</SelectItem>
                            <SelectItem value="1-3months">1-3 Months</SelectItem>
                            <SelectItem value="3-6months">3-6 Months</SelectItem>
                            <SelectItem value="6-12months">6-12 Months</SelectItem>
                            <SelectItem value="exploring">Just Exploring</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-700 font-medium">Message</Label>
                      <div className="relative">
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          className="min-h-[120px] pl-12 pt-4 rounded-xl border-gray-200 bg-gray-50 hover:bg-white transition-colors resize-none"
                          placeholder="Tell us about your real estate needs, preferences, or any questions you have..."
                          required
                        />
                        <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-[#aa9578]" />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 bg-gradient-to-r from-[#aa9578] to-[#8a7a63] hover:from-[#8a7a63] hover:to-[#aa9578] text-white rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                          </motion.div>
                        ) : (
                          <Send className="h-5 w-5 mr-2" />
                        )}
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Contact Cards */}
              <div className="space-y-6">
                <Card className="border-[#e9e0cc] shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#f3ecdf] rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-[#aa9578]" />
                      </div>
                      <div>
                        <h3 className="font-tenor-sans text-lg text-[#473729] mb-1">Phone</h3>
                        <a href="tel:416-553-7707" className="text-[#000] font-medium hover:text-[#8a7a63] transition-colors">
                          416-553-7707
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#e9e0cc] shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#f3ecdf] rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-[#aa9578]" />
                      </div>
                      <div>
                        <h3 className="font-tenor-sans text-lg text-[#473729] mb-1">Email</h3>
                        <a href="mailto:sold@realtorpooya.ca" className="text-[#000] font-medium hover:text-[#8a7a63] transition-colors">
                          sold@realtorpooya.ca
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#e9e0cc] shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#f3ecdf] rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-[#aa9578]" />
                      </div>
                      <div>
                        <h3 className="font-tenor-sans text-lg text-[#473729] mb-1">Office</h3>
                        <p className="text-[#000] font-medium">
                         187 King Street East,
                         <br />
                         Toronto, ON, M5A 1J5
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Availability */}
              <Card className="border-[#e9e0cc] shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-[#f3ecdf] rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-[#aa9578]" />
                    </div>
                    <h3 className="font-tenor-sans text-lg text-[#473729]">Availability</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#8a7a63]">Monday - Friday</span>
                      <span className="text-[#473729] font-medium">9:00 AM - 7:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8a7a63]">Saturday</span>
                      <span className="text-[#473729] font-medium">10:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8a7a63]">Sunday</span>
                      <span className="text-[#473729] font-medium">12:00 PM - 5:00 PM</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-[#f3ecdf] rounded-lg">
                    <p className="text-xs text-[#8a7a63]">
                      <strong>Emergency?</strong> Call anytime for urgent real estate matters.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Specialties */}
              <Card className="border-[#e9e0cc] shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-[#f3ecdf] rounded-full flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-[#aa9578]" />
                    </div>
                    <h3 className="font-tenor-sans text-lg text-[#473729]">Specialties</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-[#f3ecdf] text-[#8a7a63] hover:bg-[#e9e0cc]">
                      Luxury Homes
                    </Badge>
                    <Badge variant="secondary" className="bg-[#f3ecdf] text-[#8a7a63] hover:bg-[#e9e0cc]">
                      Condominiums
                    </Badge>
                    <Badge variant="secondary" className="bg-[#f3ecdf] text-[#8a7a63] hover:bg-[#e9e0cc]">
                      Investment Properties
                    </Badge>
                    <Badge variant="secondary" className="bg-[#f3ecdf] text-[#8a7a63] hover:bg-[#e9e0cc]">
                      First-Time Buyers
                    </Badge>
                    <Badge variant="secondary" className="bg-[#f3ecdf] text-[#8a7a63] hover:bg-[#e9e0cc]">
                      Relocation
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ContactForm />
    </Suspense>
  )
} 