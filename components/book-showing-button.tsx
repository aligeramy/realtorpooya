"use client"

import * as React from "react"
import { useState } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Calendar as CalendarIcon, Phone, Mail, User, Clock, Send, X, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BookShowingButtonProps extends Omit<ButtonProps, "variant" | "size"> {
  variant?: "primary" | "secondary" | "outline" | "text"
  size?: "default" | "sm" | "lg" | "icon" | "xl"
  showIcon?: boolean
  fullWidth?: boolean
  className?: string
}

interface FormData {
  name: string
  email: string
  phone: string
  preferredDate: string
  preferredTime: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  preferredDate?: string
  preferredTime?: string
}

export default function BookShowingButton({
  variant = "primary",
  size = "default",
  showIcon = true,
  fullWidth = false,
  className,
  ...props
}: BookShowingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  })

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }
    
    if (!formData.preferredDate) {
      newErrors.preferredDate = "Please select a date"
    } else {
      const selectedDate = new Date(formData.preferredDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.preferredDate = "Please select a future date"
      }
    }
    
    if (!formData.preferredTime) {
      newErrors.preferredTime = "Please select a time"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: FormData) => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev: FormErrors) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: FormData) => ({ ...prev, [name]: value }))
    
    // Clear error when user makes selection
    if (errors[name as keyof FormErrors]) {
      setErrors((prev: FormErrors) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)

    try {
      const response = await fetch('/api/book-showing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setIsLoading(false)
        setIsSubmitted(true)
        // Reset after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false)
          setIsOpen(false)
          setFormData({
            name: "",
            email: "",
            phone: "",
            preferredDate: "",
            preferredTime: "",
            message: "",
          })
          setErrors({})
        }, 3000)
      } else {
        throw new Error(result.error || 'Failed to submit request')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setIsLoading(false)
      alert('Sorry, there was an error submitting your request. Please try again or call us directly at 416-553-7707.')
    }
  }

  const closeDialog = () => {
    setIsOpen(false)
    setIsSubmitted(false)
    setErrors({})
  }

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date()
  const todayString = today.toISOString().split('T')[0]

  // Generate time slots
  const timeSlots = [
    { value: "morning", label: "Morning (9:00 AM - 12:00 PM)" },
    { value: "early-afternoon", label: "Early Afternoon (12:00 PM - 3:00 PM)" },
    { value: "afternoon", label: "Afternoon (3:00 PM - 6:00 PM)" },
    { value: "evening", label: "Evening (6:00 PM - 8:00 PM)" },
  ]

  // Define variant styles
  const variantStyles = {
    primary: "bg-[#473729] hover:bg-[#3a9aa7] text-white",
    secondary: "bg-[#f3ecdf] text-[#aa9578] hover:bg-[#e9e0cc]",
    outline: "border-[#aa9578] text-[#aa9578] hover:bg-[#f3ecdf] bg-transparent",
    text: "bg-transparent hover:bg-transparent text-[#aa9578] hover:text-[#473729] p-0",
  }

  // Define size styles
  const sizeStyles = {
    default: "px-6 py-2",
    sm: "px-4 py-1 text-sm",
    lg: "px-8 py-3 text-lg",
    xl: "px-8 py-6 text-lg",
    icon: "p-2",
  }

  // Combine styles
  const buttonStyles = `
    ${variantStyles[variant]} 
    ${variant !== "text" ? sizeStyles[size] : ""} 
    ${fullWidth ? "w-full" : ""} 
    rounded-full font-manrope tracking-tight flex items-center justify-center
    ${className || ""}
  `

  return (
    <>
      <Button className={buttonStyles} onClick={() => setIsOpen(true)} {...props}>
        {showIcon && <CalendarIcon className="h-5 w-5 mr-2" />}
        {props.children || "Book a Showing"}
      </Button>

      <Dialog open={isOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg w-full mx-2 sm:mx-4 p-0 rounded-2xl bg-white overflow-hidden max-h-[95vh] [&>button]:hidden">
          <DialogTitle className="sr-only">Book a Property Showing</DialogTitle>
          
          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="bg-gradient-to-br from-[#f3ecdf] to-[#e9e0cc] p-4 sm:p-6 relative">
                <button
                  onClick={closeDialog}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="h-4 w-4 text-[#473729]" />
                </button>
                
                <div className="text-center">
                  <h3 className="font-tenor-sans text-xl sm:text-2xl text-[#473729] mb-2">Book Your Showing</h3>
                  <p className="text-[#8a7a63] text-sm">Quick and easy scheduling</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Name - Full width */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 text-sm font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className={cn(
                        "pl-10 h-11 rounded-lg border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578] text-sm",
                        errors.name && "border-red-500 focus:border-red-500 focus:ring-red-500"
                      )}
                      required
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578]" />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email & Phone Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className={cn(
                          "pl-10 h-11 rounded-lg border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578] text-sm",
                          errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578]" />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 text-sm font-medium">
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(416) 555-1234"
                        className={cn(
                          "pl-10 h-11 rounded-lg border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578] text-sm",
                          errors.phone && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
                        required
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578]" />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Date & Time Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate" className="text-gray-700 text-sm font-medium">
                      Date <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="preferredDate"
                        name="preferredDate"
                        type="date"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        min={todayString}
                        className={cn(
                          "pl-10 h-11 rounded-lg border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578] text-sm",
                          errors.preferredDate && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}
                        required
                      />
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578] pointer-events-none" />
                    </div>
                    {errors.preferredDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.preferredDate}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredTime" className="text-gray-700 text-sm font-medium">
                      Time <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onValueChange={(value) => handleSelectChange("preferredTime", value)}
                      >
                        <SelectTrigger className={cn(
                          "h-11 rounded-lg pl-10 border-gray-200 text-sm",
                          errors.preferredTime && "border-red-500 focus:border-red-500 focus:ring-red-500"
                        )}>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot.value} value={slot.value}>
                              {slot.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578] pointer-events-none z-10" />
                    </div>
                    {errors.preferredTime && (
                      <p className="text-red-500 text-xs mt-1">{errors.preferredTime}</p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700 text-sm font-medium">
                    Additional Message (Optional)
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Any specific requirements, questions, or preferences..."
                    className="min-h-[80px] rounded-lg border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578] resize-none text-sm"
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#aa9578] to-[#8a7a63] hover:from-[#8a7a63] hover:to-[#aa9578] text-white rounded-lg h-12 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
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
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? "Scheduling..." : "Schedule Showing"}
                </Button>

                {/* Form Footer */}
                <div className="text-center text-xs text-gray-500 mt-4">
                  <p>* Required fields</p>
                  <p className="mt-1">Need help? Call us at <a href="tel:416-553-7707" className="text-[#aa9578] hover:underline">416-553-7707</a></p>
                </div>
              </form>
            </>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="p-6 sm:p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-tenor-sans text-xl text-gray-900 mb-2">Showing Scheduled!</h3>
              <p className="text-gray-600 text-sm mb-4">
                Thank you! I'll contact you shortly to confirm the details.
              </p>
              <div className="text-xs text-gray-500">
                <p>Expected response time: Within 2 hours</p>
                <p className="mt-1">Check your email for confirmation</p>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
