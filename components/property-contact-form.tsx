"use client"

import { useState } from "react"
import { Phone, Mail, User, MessageSquare, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Property } from "@/types/property"

interface PropertyContactFormProps {
  property: Property
  className?: string
}

export function PropertyContactForm({ property, className }: PropertyContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Build property details string
      const propertyDetails = `
Property Details:
- Address: ${property.address || "N/A"}
- City: ${property.city || "N/A"}
- Price: ${property.price ? new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(property.price) : "N/A"}
- Bedrooms: ${property.bedrooms || "N/A"}
- Bathrooms: ${property.bathrooms || "N/A"}
- Square Feet: ${property.squareFeet || "N/A"}
- Property Type: ${property.propertyType || "N/A"}
- MLS ID: ${property.mlsId || property.mlsListingKey || "N/A"}
- Property ID: ${property.id}
      `.trim()

      const fullMessage = `${formData.message}\n\n${propertyDetails}`

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: fullMessage,
          propertyId: property.id,
          propertyAddress: property.address,
          inquiryType: "property_inquiry",
        }),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", phone: "", message: "" })
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitStatus("idle"), 5000)
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={className}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100 bg-[#f3ecdf]">
          <h3 className="font-tenor-sans text-2xl text-[#473729] mb-2">Contact About This Property</h3>
          <p className="text-sm text-gray-600">
            Interested in this property? Send us a message and we'll get back to you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Name *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 h-11 rounded-lg border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578]"
              placeholder="Your full name"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 h-11 rounded-lg border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578]"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-gray-700 font-medium">
              Phone
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 h-11 rounded-lg border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578]"
              placeholder="(416) 555-1234"
            />
          </div>

          <div>
            <Label htmlFor="message" className="text-gray-700 font-medium">
              Message *
            </Label>
            <Textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 rounded-lg border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578]"
              placeholder="Tell us about your interest in this property..."
            />
          </div>

          {submitStatus === "success" && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                Thank you! Your message has been sent. We'll get back to you soon.
              </p>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                There was an error sending your message. Please try again or call us directly.
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#aa9578] hover:bg-[#8a7a63] text-white rounded-full py-6 font-manrope text-lg flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Send Message
              </>
            )}
          </Button>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <a href="tel:416-553-7707" className="flex items-center hover:text-[#aa9578] transition-colors">
                <Phone className="h-4 w-4 mr-1" />
                416-553-7707
              </a>
              <a href="mailto:alger.555@gmail.com" className="flex items-center hover:text-[#aa9578] transition-colors">
                <Mail className="h-4 w-4 mr-1" />
                Email Us
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
