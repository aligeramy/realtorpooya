"use client"

import * as React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, CheckCircle, ArrowLeft, Send, Clock, Home } from "lucide-react"
import { motion } from "framer-motion"
import { format, startOfWeek, endOfWeek, addDays, isBefore, isSameDay, startOfToday } from "date-fns"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface FormData {
  name: string
  email: string
  phone: string
  preferredDate?: Date
  preferredTime: string
  propertyId?: string
}

interface Property {
  id: string
  address: string
  city: string
  province: string
  price: number
  bedrooms?: string
  bathrooms?: number
  squareFeet?: number
  heroImage?: string
  images?: Array<{ url: string }>
}

function BookShowingForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const propertyId = searchParams.get("propertyId") ?? undefined

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    preferredTime: "",
    propertyId,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [property, setProperty] = useState<Property | null>(null)
  const [selectedWeek, setSelectedWeek] = useState<'this' | 'next' | null>(null)
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])

  // Fetch featured properties for selection
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await fetch('/api/properties/featured')
        if (response.ok) {
          const data = await response.json()
          setFeaturedProperties(data)
        }
      } catch (error) {
        console.error("Error fetching featured properties:", error)
      }
    }
    fetchFeaturedProperties()
  }, [])

  useEffect(() => {
    if (propertyId) {
      const fetchProperty = async () => {
        try {
          const response = await fetch(`/api/properties/${propertyId}`)
          if (response.ok) {
            const data = await response.json()
            setProperty(data)
          }
        } catch (error) {
          console.error("Error fetching property:", error)
        }
      }
      fetchProperty()
    }
  }, [propertyId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePropertySelect = (selectedPropertyId: string) => {
    setFormData((prev) => ({ ...prev, propertyId: selectedPropertyId }))
    const selectedProperty = featuredProperties.find(p => p.id === selectedPropertyId)
    setProperty(selectedProperty || null)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, preferredDate: date }))
  }

  const handleTimeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, preferredTime: value }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/book-showing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          preferredDate: formData.preferredDate ? format(formData.preferredDate, "yyyy-MM-dd") : "",
        }),
      })
      if (response.ok) {
        setIsSubmitted(true)
        setTimeout(() => {
          router.push("/")
        }, 3000)
      } else {
        throw new Error("Failed to submit")
      }
    } catch (error) {
      console.error(error)
      alert("Error submitting request")
    } finally {
      setIsLoading(false)
    }
  }

  const today = startOfToday()
  const startThisWeek = startOfWeek(today, { weekStartsOn: 1 })
  const daysThisWeek = Array.from({ length: 7 }, (_, i) => addDays(startThisWeek, i))
  const startNextWeek = addDays(startThisWeek, 7)
  const daysNextWeek = Array.from({ length: 7 }, (_, i) => addDays(startNextWeek, i))

  const renderTimeCard = (time: string, label: string) => {
    const isSelected = formData.preferredTime === time
    return (
      <Card
        key={time}
        className={cn(
          "w-full h-20 flex items-center justify-center cursor-pointer",
          isSelected ? "border-[#aa9578] bg-[#f3ecdf]" : ""
        )}
        onClick={() => handleTimeChange(time)}
      >
        <CardContent className="p-2 text-center">
          <div className="font-bold whitespace-pre-line">{label}</div>
        </CardContent>
      </Card>
    )
  }

  const renderDayCard = (day: Date) => {
    const isPast = isBefore(day, today)
    const isSelected = formData.preferredDate && isSameDay(formData.preferredDate, day)
    return (
      <Card
        key={day.toString()}
        className={cn(
          "w-full h-16 md:h-20 flex flex-col items-center justify-center cursor-pointer",
          isPast ? "opacity-50 cursor-not-allowed" : "",
          isSelected ? "border-[#aa9578] bg-[#f3ecdf]" : ""
        )}
        onClick={() => !isPast && handleDateSelect(day)}
      >
        <CardContent className="p-1 md:p-2 text-center">
          <div className="font-bold text-sm md:text-base">{format(day, "EEE")}</div>
          <div className="text-lg md:text-2xl">{format(day, "d")}</div>
        </CardContent>
      </Card>
    )
  }

  const renderPropertyCard = (prop: Property) => {
    const isSelected = formData.propertyId === prop.id
    const imageUrl = prop.heroImage || (prop.images && prop.images.length > 0 ? prop.images[0].url : null)
    
    return (
      <Card
        key={prop.id}
        className={cn(
          "w-full cursor-pointer transition-all duration-200 hover:shadow-lg",
          isSelected ? "border-[#aa9578] bg-[#f3ecdf] ring-2 ring-[#aa9578]" : "hover:border-[#aa9578]"
        )}
        onClick={() => handlePropertySelect(prop.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            {imageUrl && (
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={imageUrl}
                  alt={prop.address}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#473729] text-sm mb-1 truncate">
                {prop.address}
              </h4>
              <p className="text-[#8a7a63] text-xs mb-1">
                {prop.city}, {prop.province}
              </p>
              <div className="flex items-center justify-between">
                <p className="font-bold text-[#473729] text-sm">
                  ${prop.price.toLocaleString()}
                </p>
                <div className="flex items-center space-x-2 text-xs text-[#8a7a63]">
                  {prop.bedrooms && (
                    <span>{prop.bedrooms} bed</span>
                  )}
                  {prop.bathrooms && (
                    <span>{prop.bathrooms} bath</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Determine steps based on whether a property is pre-selected
  const steps = propertyId ? [
    {
      title: "Your Information",
      content: (
        <div className="space-y-6">
          {property && (
            <div className="p-4 bg-[#f3ecdf] rounded-lg shadow-md">
              <h4 className="font-semibold text-[#473729] mb-2">Booking for:</h4>
              <p className="text-[#8a7a63]">{property.address}, {property.city}, {property.province}</p>
              <p className="text-[#473729] font-semibold">${property.price.toLocaleString()}</p>
            </div>
          )}
          <div>
            <Label htmlFor="name" className="text-[#473729]">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required className="border-[#aa9578] focus:border-[#8a7a63]" />
          </div>
          <div>
            <Label htmlFor="email" className="text-[#473729]">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className="border-[#aa9578] focus:border-[#8a7a63]" />
          </div>
          <div>
            <Label htmlFor="phone" className="text-[#473729]">Phone</Label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required className="border-[#aa9578] focus:border-[#8a7a63]" />
          </div>
        </div>
      ),
    },
    {
      title: "Select Date & Time",
      content: (
        <div className="space-y-6">
          {!selectedWeek ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <Button onClick={() => setSelectedWeek('this')} className="w-full bg-[#f3ecdf] text-[#473729] hover:bg-[#e9e0cc]">
                This Week
              </Button>
              <Button onClick={() => setSelectedWeek('next')} className="w-full bg-[#f3ecdf] text-[#473729] hover:bg-[#e9e0cc]">
                Next Week
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full border-[#aa9578] text-[#aa9578] hover:bg-[#f3ecdf]">
                    <CalendarIcon className="mr-2 h-4 w-4" /> Later
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.preferredDate}
                    onSelect={(date) => {
                      handleDateSelect(date)
                      setSelectedWeek(null) // Reset after selection
                    }}
                    disabled={(date) => isBefore(date, addDays(today, 14))} // Disable before two weeks from now for 'Later'
                  />
                </PopoverContent>
              </Popover>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-semibold mb-2 text-[#473729]">{selectedWeek === 'this' ? 'This Week' : 'Next Week'}</h3>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                {(selectedWeek === 'this' ? daysThisWeek : daysNextWeek).map(renderDayCard)}
              </div>
              <Button variant="outline" onClick={() => setSelectedWeek(null)} className="mt-4 w-full border-[#aa9578] text-[#aa9578] hover:bg-[#f3ecdf]">
                Change Week
              </Button>
            </motion.div>
          )}
          <div>
            <Label className="text-[#473729] text-center text-md block mb-2">Preferred Time</Label>
            <div className="grid grid-cols-3 gap-2">
              {renderTimeCard("morning", "Morning\n(9am-12pm)")}
              {renderTimeCard("afternoon", "Afternoon\n(12pm-5pm)")}
              {renderTimeCard("evening", "Evening\n(5pm-8pm)")}
            </div>
          </div>
        </div>
      ),
    },
  ] : [
    {
      title: "Select Property",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Home className="h-12 w-12 text-[#aa9578] mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-[#473729] mb-2">Choose a Property</h3>
            <p className="text-[#8a7a63]">Select the property you'd like to view</p>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {featuredProperties.map(renderPropertyCard)}
          </div>
        </div>
      ),
    },
    {
      title: "Your Information",
      content: (
        <div className="space-y-6">
          {property && (
            <div className="p-4 bg-[#f3ecdf] rounded-lg shadow-md">
              <h4 className="font-semibold text-[#473729] mb-2">Booking for:</h4>
              <p className="text-[#8a7a63]">{property.address}, {property.city}, {property.province}</p>
              <p className="text-[#473729] font-semibold">${property.price.toLocaleString()}</p>
            </div>
          )}
          <div>
            <Label htmlFor="name" className="text-[#473729]">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required className="border-[#aa9578] focus:border-[#8a7a63]" />
          </div>
          <div>
            <Label htmlFor="email" className="text-[#473729]">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className="border-[#aa9578] focus:border-[#8a7a63]" />
          </div>
          <div>
            <Label htmlFor="phone" className="text-[#473729]">Phone</Label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required className="border-[#aa9578] focus:border-[#8a7a63]" />
          </div>
        </div>
      ),
    },
    {
      title: "Select Date & Time",
      content: (
        <div className="space-y-6">
          {!selectedWeek ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <Button onClick={() => setSelectedWeek('this')} className="w-full bg-[#f3ecdf] text-[#473729] hover:bg-[#e9e0cc]">
                This Week
              </Button>
              <Button onClick={() => setSelectedWeek('next')} className="w-full bg-[#f3ecdf] text-[#473729] hover:bg-[#e9e0cc]">
                Next Week
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full border-[#aa9578] text-[#aa9578] hover:bg-[#f3ecdf]">
                    <CalendarIcon className="mr-2 h-4 w-4" /> Later
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.preferredDate}
                    onSelect={(date) => {
                      handleDateSelect(date)
                      setSelectedWeek(null) // Reset after selection
                    }}
                    disabled={(date) => isBefore(date, addDays(today, 14))} // Disable before two weeks from now for 'Later'
                  />
                </PopoverContent>
              </Popover>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-semibold mb-2 text-[#473729]">{selectedWeek === 'this' ? 'This Week' : 'Next Week'}</h3>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                {(selectedWeek === 'this' ? daysThisWeek : daysNextWeek).map(renderDayCard)}
              </div>
              <Button variant="outline" onClick={() => setSelectedWeek(null)} className="mt-4 w-full border-[#aa9578] text-[#aa9578] hover:bg-[#f3ecdf]">
                Change Week
              </Button>
            </motion.div>
          )}
          <div>
            <Label className="text-[#473729] text-center text-md block mb-2">Preferred Time</Label>
            <div className="grid grid-cols-3 gap-2">
              {renderTimeCard("morning", "Morning\n(9am-12pm)")}
              {renderTimeCard("afternoon", "Afternoon\n(12pm-5pm)")}
              {renderTimeCard("evening", "Evening\n(5pm-8pm)")}
            </div>
          </div>
        </div>
      ),
    },
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f3ecdf] to-[#e9e0cc] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md w-full"
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Showing Scheduled!</h2>
          <p className="text-gray-600 mb-4">Thank you! I'll contact you shortly.</p>
          <p className="text-sm text-gray-500">Redirecting to home...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3ecdf] to-[#e9e0cc] p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 md:p-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-[#aa9578]">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-3xl font-bold mb-8 text-center text-[#473729]">Book Your Showing</h1>
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-2 flex-1 mx-1 rounded-full",
                    index < currentStep ? "bg-[#aa9578]" : index === currentStep ? "bg-[#8a7a63]" : "bg-gray-200"
                  )}
                />
              ))}
            </div>
            <p className="text-sm text-center text-[#8a7a63]">Step {currentStep + 1} of {steps.length}</p>
          </div>
          <h2 className="text-xl font-semibold mb-6 text-[#473729]">{steps[currentStep].title}</h2>
          {steps[currentStep].content}
          <div className="flex justify-between mt-8 gap-4">
            {currentStep > 0 && (
              <Button variant="outline" onClick={() => setCurrentStep((p) => p - 1)} className="w-full border-[#aa9578] text-[#aa9578] hover:bg-[#f3ecdf]">
                Back
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep((p) => p + 1)}
                disabled={
                  currentStep === 0 && !propertyId ? !formData.propertyId : 
                  currentStep === (propertyId ? 0 : 1) ? !formData.name || !formData.email || !formData.phone : 
                  !formData.preferredDate || !formData.preferredTime
                }
                className="w-full bg-[#aa9578] hover:bg-[#8a7a63] text-white"
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading} className="w-full bg-[#aa9578] hover:bg-[#8a7a63] text-white">
                {isLoading ? "Submitting..." : "Submit"} <Send className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookShowingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookShowingForm />
    </Suspense>
  )
} 