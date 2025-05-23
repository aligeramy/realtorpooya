"use client"

import { useState } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Calendar, Phone, Mail, User, Clock, Sparkles, Send } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"

interface BookShowingButtonProps extends Omit<ButtonProps, "variant" | "size"> {
  variant?: "primary" | "secondary" | "outline" | "text"
  size?: "default" | "sm" | "lg" | "icon" | "xl"
  showIcon?: boolean
  fullWidth?: boolean
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsOpen(false)
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      })
      alert("Thank you! We'll contact you shortly to confirm your showing.")
    }, 2000)
  }

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
        {showIcon && <Calendar className="h-5 w-5 mr-2" />}
        {props.children || "Book a Showing"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl w-full p-0 overflow-hidden bg-white rounded-3xl">
          <DialogTitle className="sr-only">Book a Property Showing</DialogTitle>
          
          {/* Header */}
          <div className="bg-gradient-to-br from-[#f3ecdf] to-[#e9e0cc] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-[#473729] mr-2" />
                <span className="text-[#8a7a63] font-montserrat text-sm uppercase tracking-[0.3em]">
                  Exclusive Viewing
                </span>
                <Sparkles className="h-6 w-6 text-[#473729] ml-2" />
              </div>
              <h3 className="font-tenor-sans text-4xl text-[#473729] mb-2">Book Your Private Showing</h3>
              <p className="text-[#8a7a63] font-light">Experience luxury properties with personalized attention</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name */}
              <div className="space-y-3">
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

              {/* Email */}
              <div className="space-y-3">
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

              {/* Phone */}
              <div className="space-y-3">
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

              {/* Preferred Date */}
              <div className="space-y-3">
                <Label htmlFor="preferredDate" className="text-gray-700 font-medium">Preferred Date</Label>
                <div className="relative">
                  <Input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    className="pl-12 h-14 rounded-xl border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578] bg-gray-50 hover:bg-white transition-colors"
                    required
                  />
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#aa9578]" />
                </div>
              </div>

              {/* Preferred Time */}
              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="preferredTime" className="text-gray-700 font-medium">Preferred Time</Label>
                <div className="relative">
                  <Select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, preferredTime: value }))}
                  >
                    <SelectTrigger className="h-14 rounded-xl pl-12 border-gray-200 bg-gray-50 hover:bg-white transition-colors">
                      <SelectValue placeholder="Select your preferred time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (9:00 AM - 12:00 PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12:00 PM - 5:00 PM)</SelectItem>
                      <SelectItem value="evening">Evening (5:00 PM - 8:00 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#aa9578] pointer-events-none z-10" />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="message" className="text-gray-700 font-medium">Additional Information (Optional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your specific interests or requirements..."
                  className="min-h-[120px] rounded-xl border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578] bg-gray-50 hover:bg-white transition-colors resize-none"
                />
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-br from-[#f9f6f1] to-[#f3ecdf] rounded-2xl p-6 mb-6">
              <h4 className="font-tenor-sans text-xl text-[#473729] mb-4">What to Expect</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#aa9578] rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Personalized property tour with expert guidance</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#aa9578] rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Detailed insights about the neighborhood</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#aa9578] rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Market analysis and investment potential</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#aa9578] rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">No pressure, client-focused experience</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#aa9578] to-[#8a7a63] hover:from-[#8a7a63] hover:to-[#aa9578] text-white rounded-full py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
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
              {isLoading ? "Scheduling..." : "Schedule Your Showing"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
