"use client"

import * as React from "react"
import { useState } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Calendar as CalendarIcon, Phone, Mail, User, Clock, Send, X, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { motion } from "framer-motion"
import { format } from "date-fns"
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
  preferredDate: Date | undefined
  preferredTime: string
  message: string
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
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    preferredDate: undefined,
    preferredTime: "",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: FormData) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/book-showing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          preferredDate: formData.preferredDate ? format(formData.preferredDate, 'yyyy-MM-dd') : '',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit request')
      }

      setIsSubmitted(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setIsOpen(false)
        setFormData({
          name: "",
          email: "",
          phone: "",
          preferredDate: undefined,
          preferredTime: "",
          message: "",
        })
      }, 3000)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Sorry, there was an error submitting your request. Please try again or call us directly at 416-553-7707.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setIsOpen(false)
    setIsSubmitted(false)
    setFormData({
      name: "",
      email: "",
      phone: "",
      preferredDate: undefined,
      preferredTime: "",
      message: "",
    })
  }

  // Button styles
  const variantStyles = {
    primary: "bg-[#473729] hover:bg-[#3a9aa7] text-white",
    secondary: "bg-[#f3ecdf] text-[#aa9578] hover:bg-[#e9e0cc]",
    outline: "border-[#aa9578] text-[#aa9578] hover:bg-[#f3ecdf] bg-transparent",
    text: "bg-transparent hover:bg-transparent text-[#aa9578] hover:text-[#473729] p-0",
  }

  const sizeStyles = {
    default: "px-6 py-2",
    sm: "px-4 py-1 text-sm",
    lg: "px-8 py-3 text-lg",
    xl: "px-8 py-6 text-lg",
    icon: "p-2",
  }

  const buttonStyles = cn(
    variantStyles[variant],
    variant !== "text" && sizeStyles[size],
    fullWidth && "w-full",
    "rounded-full font-manrope tracking-tight flex items-center justify-center transition-all duration-200",
    className
  )

  return (
    <>
      <Button className={buttonStyles} onClick={() => setIsOpen(true)} {...props}>
        {showIcon && <CalendarIcon className="h-5 w-5 mr-2" />}
        {props.children || "Book a Showing"}
      </Button>

      <Dialog open={isOpen} onOpenChange={resetForm}>
        <DialogContent className="sm:max-w-md w-[95%] sm:w-full p-0 rounded-xl bg-white overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Book a Property Showing</DialogTitle>
          </DialogHeader>
          
          {/* Close button - positioned to avoid mobile nav conflicts */}
          <Button
            variant="ghost"
            size="icon"
            onClick={resetForm}
            className="absolute top-4 left-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4 text-gray-600" />
          </Button>

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-[#f3ecdf] to-[#e9e0cc] px-6 py-8 text-center">
                <h2 className="font-tenor-sans text-2xl text-[#473729] mb-2">Book Your Showing</h2>
                <p className="text-[#8a7a63] text-sm">Let's schedule your property visit</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578]" />
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="pl-10 h-11 border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578]"
                      required
                    />
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578]" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className="pl-10 h-11 border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578]" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(416) 555-0123"
                        className="pl-10 h-11 border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578]"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Preferred Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-11 pl-10 justify-start text-left font-normal border-gray-200 hover:border-[#aa9578]",
                            !formData.preferredDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578]" />
                          <span className="ml-6">
                            {formData.preferredDate ? (
                              format(formData.preferredDate, "PPP")
                            ) : (
                              "Select date"
                            )}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.preferredDate}
                          onSelect={(date) => setFormData(prev => ({ ...prev, preferredDate: date }))}
                          disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Preferred Time
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578] z-10" />
                      <Select
                        value={formData.preferredTime}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, preferredTime: value }))}
                      >
                        <SelectTrigger className="h-11 pl-10 border-gray-200 focus:border-[#aa9578]">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                          <SelectItem value="evening">Evening (5 PM - 8 PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                    Additional Message (Optional)
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Any specific requirements or questions..."
                    className="min-h-[80px] border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578] resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-[#aa9578] to-[#8a7a63] hover:from-[#8a7a63] hover:to-[#aa9578] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      </motion.div>
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Schedule Showing
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="h-8 w-8 text-green-600" />
              </motion.div>
              <h3 className="font-tenor-sans text-xl text-gray-900 mb-2">
                Showing Scheduled!
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Thank you for your request. I'll contact you within 2 hours to confirm the details.
              </p>
              <div className="text-xs text-gray-500">
                <p>Questions? Call directly: 416-553-7707</p>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
