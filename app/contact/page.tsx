"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock, Send, User, MessageSquare, Calendar, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import TopNavMenu from "@/components/top-nav-menu"
import SiteFooter from "@/components/site-footer"
import ResponsiveLogo from "@/components/responsive-logo"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    inquiryType: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setIsSubmitting(false)
        setIsSubmitted(true)
        // Reset form after showing success
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            inquiryType: "",
            message: "",
          })
        }, 3000)
      } else {
        throw new Error(result.error || 'Failed to submit message')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setIsSubmitting(false)
      alert('Sorry, there was an error submitting your message. Please try again or call us directly at 416-553-7707.')
    }
  }

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

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center text-[#aa9578] font-manrope tracking-tight">
              <Phone className="h-4 w-4 mr-2" />
              <span>416-553-7707</span>
            </div>
            <TopNavMenu />
            <div className="hidden md:flex items-center space-x-4">
              <Link href="https://www.facebook.com/realtorpooya" className="text-[#aa9578] hover:text-[#473729] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>
              <Link href="https://www.instagram.com/realtorpooya/" className="text-[#aa9578] hover:text-[#473729] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>
              <Link href="https://www.linkedin.com/in/pooya-pirayesh-758998366/" className="text-[#aa9578] hover:text-[#473729] transition-colors">
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

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="text-[#aa9578] font-montserrat text-sm uppercase tracking-[0.3em] mb-4 block">
              Get in Touch
            </span>
            <h1 className="font-tenor-sans text-5xl md:text-6xl lg:text-7xl text-gray-900 mb-6 tracking-tighter">
              Let's Find Your Perfect Property
            </h1>
            <p className="text-xl text-gray-700 font-light leading-relaxed max-w-3xl mx-auto">
              Whether you're buying, selling, or investing in luxury real estate, I'm here to guide you through every step of your journey with personalized service and expert market knowledge.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods & Form Section */}
      <section className="py-16 bg-[#f9f6f1]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-tenor-sans text-3xl md:text-4xl text-gray-900 mb-6">
                  Ready to Start Your Real Estate Journey?
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  I'm committed to providing exceptional service and results. Reach out today to discuss your real estate goals and discover how I can help you achieve them.
                </p>
              </div>

              {/* Agent Card */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e9e0cc]">
                <div className="flex items-start space-x-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src="/images/agent-pooya.jpg"
                      alt="Pooya Pirayeshakbari"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-tenor-sans text-2xl text-[#473729] mb-2">Pooya Pirayeshakbari</h3>
                    <p className="text-[#aa9578] mb-4">Luxury Real Estate Specialist</p>

                  </div>
                </div>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-6 bg-white rounded-2xl border border-[#e9e0cc]">
                  <div className="w-12 h-12 bg-[#f3ecdf] rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-[#aa9578]" />
                  </div>
                  <div>
                    <h4 className="font-manrope font-semibold text-gray-900">Phone</h4>
                    <a href="tel:416-553-7707" className="text-[#aa9578] hover:text-[#473729] transition-colors">
                      416-553-7707
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-6 bg-white rounded-2xl border border-[#e9e0cc]">
                  <div className="w-12 h-12 bg-[#f3ecdf] rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-[#aa9578]" />
                  </div>
                  <div>
                    <h4 className="font-manrope font-semibold text-gray-900">Email</h4>
                    <a href="mailto:sold@realtorpooya.ca" className="text-[#aa9578] hover:text-[#473729] transition-colors">
                      sold@realtorpooya.ca
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-6 bg-white rounded-2xl border border-[#e9e0cc]">
                  <div className="w-12 h-12 bg-[#f3ecdf] rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-[#aa9578]" />
                  </div>
                  <div>
                    <h4 className="font-manrope font-semibold text-gray-900">Office</h4>
                    <p className="text-gray-700">187 King Street East,
                  <br />
                  Toronto, ON, M5A 1J5</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-6 bg-white rounded-2xl border border-[#e9e0cc]">
                  <div className="w-12 h-12 bg-[#f3ecdf] rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-[#aa9578]" />
                  </div>
                  <div>
                    <h4 className="font-manrope font-semibold text-gray-900">Availability</h4>
                    <p className="text-gray-700">Monday - Sunday<br />8:00 AM - 9:00 PM</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e9e0cc]">
                {!isSubmitted ? (
                  <>
                    <div className="text-center mb-8">
                      <h3 className="font-tenor-sans text-2xl text-gray-900 mb-2">Send Me a Message</h3>
                      <p className="text-gray-600">I'll get back to you within 24 hours</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-700 font-medium">Your Name</Label>
                          <div className="relative">
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="John Smith"
                              className="pl-12 h-14 rounded-xl border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578] bg-gray-50 hover:bg-white transition-colors"
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
                              placeholder="john@example.com"
                              className="pl-12 h-14 rounded-xl border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578] bg-gray-50 hover:bg-white transition-colors"
                              required
                            />
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#aa9578]" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                          <div className="relative">
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="(416) 555-1234"
                              className="pl-12 h-14 rounded-xl border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578] bg-gray-50 hover:bg-white transition-colors"
                              required
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

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-gray-700 font-medium">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="How can I help you?"
                          className="h-14 rounded-xl border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578] bg-gray-50 hover:bg-white transition-colors"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-gray-700 font-medium">Message</Label>
                        <div className="relative">
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Tell me more about your real estate needs..."
                            className="min-h-[120px] rounded-xl border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578] bg-gray-50 hover:bg-white transition-colors resize-none pl-12 pt-4"
                            required
                          />
                          <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-[#aa9578]" />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#aa9578] to-[#8a7a63] hover:from-[#8a7a63] hover:to-[#aa9578] text-white rounded-full py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
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
                        {isSubmitting ? "Sending Message..." : "Send Message"}
                      </Button>
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-tenor-sans text-2xl text-gray-900 mb-2">Message Sent Successfully!</h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for reaching out. I'll get back to you within 24 hours.
                    </p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <p>In the meantime, feel free to:</p>
                      <div className="flex justify-center space-x-4">
                        <a href="tel:416-553-7707" className="text-[#aa9578] hover:text-[#473729] transition-colors">
                          Call me directly
                        </a>
                        <span>•</span>
                        <Link href="/" className="text-[#aa9578] hover:text-[#473729] transition-colors">
                          Browse properties
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-tenor-sans text-3xl md:text-4xl text-gray-900 mb-4">
              Ready to Take the Next Step?
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Choose the option that best fits your needs and let's get started on your real estate journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-[#f3ecdf] rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-8 w-8 text-[#aa9578]" />
                </div>
                <h3 className="font-tenor-sans text-xl text-gray-900 mb-4">Schedule a Consultation</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Book a personalized meeting to discuss your real estate goals.
                </p>
                <Button className="bg-[#aa9578] hover:bg-[#8a7a63] text-white rounded-full px-6 py-3">
                  Book Consultation
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-[#f3ecdf] rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="h-8 w-8 text-[#aa9578]" />
                </div>
                <h3 className="font-tenor-sans text-xl text-gray-900 mb-4">Call Now</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Speak directly with me for immediate assistance with your real estate needs.
                </p>
                <Button 
                  className="bg-[#aa9578] hover:bg-[#8a7a63] text-white rounded-full px-6 py-3"
                  onClick={() => window.location.href = 'tel:416-553-7707'}
                >
                  416-553-7707
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-[#f3ecdf] rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-8 w-8 text-[#aa9578]" />
                </div>
                <h3 className="font-tenor-sans text-xl text-gray-900 mb-4">Email Me</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Send me an email and I'll respond with detailed information about your inquiry.
                </p>
                <Button 
                  className="bg-[#aa9578] hover:bg-[#8a7a63] text-white rounded-full px-6 py-3"
                  onClick={() => window.location.href = 'mailto:sold@realtorpooya.ca'}
                >
                  Send Email
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
} 