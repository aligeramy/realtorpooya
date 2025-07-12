"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Phone, Mail, User, Clock, Send, X, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface BookShowingMobileProps {
  isOpen: boolean
  onClose: () => void
}

type FormStep = 'contact' | 'datetime' | 'message' | 'success'

export default function BookShowingMobile({ isOpen, onClose }: BookShowingMobileProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>('contact')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  })

  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep('contact')
        setFormData({
          name: "",
          email: "",
          phone: "",
          preferredDate: "",
          preferredTime: "",
          message: "",
        })
      }, 300)
    }
  }, [isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const canProceedFromContact = formData.name && formData.email && formData.phone
  const canProceedFromDateTime = formData.preferredDate && formData.preferredTime

  const handleNext = () => {
    if (currentStep === 'contact' && canProceedFromContact) {
      setCurrentStep('datetime')
    } else if (currentStep === 'datetime' && canProceedFromDateTime) {
      setCurrentStep('message')
    }
  }

  const handleBack = () => {
    if (currentStep === 'datetime') {
      setCurrentStep('contact')
    } else if (currentStep === 'message') {
      setCurrentStep('datetime')
    }
  }

  const handleSubmit = async () => {
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
        setCurrentStep('success')
        
        // Auto close after 3 seconds
        setTimeout(() => {
          onClose()
        }, 3000)
      } else {
        throw new Error(result.error || 'Failed to submit request')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setIsLoading(false)
      alert('Sorry, there was an error submitting your request. Please try again.')
    }
  }

  // Custom date picker
  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const formatDateOption = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  // Time slots
  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
    "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM"
  ]

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-lg w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] p-0 rounded-none sm:rounded-2xl bg-white overflow-hidden fixed bottom-0 sm:bottom-auto left-0 right-0 sm:left-auto sm:right-auto [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">Book a Property Showing</DialogTitle>
        
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="h-full flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-[#f3ecdf] to-[#e9e0cc] p-4 relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4 text-[#473729]" />
            </button>
            
            <div className="text-center">
              <h3 className="font-tenor-sans text-2xl text-[#473729] mb-1">Book Your Showing</h3>
              <p className="text-[#8a7a63] text-sm">Step {currentStep === 'contact' ? '1' : currentStep === 'datetime' ? '2' : currentStep === 'message' ? '3' : '✓'} of 3</p>
            </div>

            {/* Progress bar */}
            <div className="mt-4 flex gap-2">
              <div className={cn("h-1 flex-1 rounded-full transition-colors", 
                currentStep !== 'contact' ? "bg-[#aa9578]" : "bg-white/40"
              )} />
              <div className={cn("h-1 flex-1 rounded-full transition-colors", 
                currentStep === 'datetime' || currentStep === 'message' || currentStep === 'success' ? "bg-[#aa9578]" : "bg-white/40"
              )} />
              <div className={cn("h-1 flex-1 rounded-full transition-colors", 
                currentStep === 'message' || currentStep === 'success' ? "bg-[#aa9578]" : "bg-white/40"
              )} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait" custom={1}>
              {currentStep === 'contact' && (
                <motion.div
                  key="contact"
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="p-6 space-y-4 h-full flex flex-col"
                >
                  <div className="flex-1 space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900">Your Contact Information</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 text-sm font-medium">Name</Label>
                      <div className="relative">
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="John Smith"
                          className="pl-10 h-12 rounded-lg border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578]"
                          autoFocus
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578]" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 text-sm font-medium">Email</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@email.com"
                          className="pl-10 h-12 rounded-lg border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578]"
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578]" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 text-sm font-medium">Phone Number</Label>
                      <div className="relative">
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(416) 555-1234"
                          className="pl-10 h-12 rounded-lg border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578]"
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#aa9578]" />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleNext}
                    disabled={!canProceedFromContact}
                    className="w-full bg-[#aa9578] hover:bg-[#8a7a63] text-white rounded-lg h-12 font-medium"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {currentStep === 'datetime' && (
                <motion.div
                  key="datetime"
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="p-6 space-y-4 h-full flex flex-col"
                >
                  <div className="flex-1 space-y-4 overflow-y-auto">
                    <h4 className="font-semibold text-lg text-gray-900">Select Date & Time</h4>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-700 text-sm font-medium">Choose a Date</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {generateDates().slice(0, 9).map((date, idx) => {
                          const dateStr = date.toISOString().split('T')[0]
                          return (
                            <button
                              key={idx}
                              onClick={() => setFormData(prev => ({ ...prev, preferredDate: dateStr }))}
                              className={cn(
                                "p-3 rounded-lg border text-sm font-medium transition-colors",
                                formData.preferredDate === dateStr
                                  ? "bg-[#aa9578] text-white border-[#aa9578]"
                                  : "bg-white text-gray-700 border-gray-200 hover:border-[#aa9578]"
                              )}
                            >
                              <div className="text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                              <div className="text-lg">{date.getDate()}</div>
                              <div className="text-xs">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 text-sm font-medium">Select Time</Label>
                      <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setFormData(prev => ({ ...prev, preferredTime: time }))}
                            className={cn(
                              "p-2 rounded-lg border text-sm font-medium transition-colors",
                              formData.preferredTime === time
                                ? "bg-[#aa9578] text-white border-[#aa9578]"
                                : "bg-white text-gray-700 border-gray-200 hover:border-[#aa9578]"
                            )}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="flex-1 rounded-lg h-12"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!canProceedFromDateTime}
                      className="flex-1 bg-[#aa9578] hover:bg-[#8a7a63] text-white rounded-lg h-12 font-medium"
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 'message' && (
                <motion.div
                  key="message"
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="p-6 space-y-4 h-full flex flex-col"
                >
                  <div className="flex-1 space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900">Additional Information</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-700 text-sm font-medium">Message (Optional)</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Any specific requirements or questions about the property..."
                        className="min-h-[150px] rounded-lg border-gray-200 focus:border-[#aa9578] focus:ring-[#aa9578] resize-none"
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-sm text-gray-900 mb-2">Booking Summary</h5>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">Name:</span> {formData.name}</p>
                        <p><span className="font-medium">Email:</span> {formData.email}</p>
                        <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                        <p><span className="font-medium">Date:</span> {formData.preferredDate && new Date(formData.preferredDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p><span className="font-medium">Time:</span> {formData.preferredTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="flex-1 rounded-lg h-12"
                      disabled={isLoading}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-[#aa9578] to-[#8a7a63] hover:from-[#8a7a63] hover:to-[#aa9578] text-white rounded-lg h-12 font-medium"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="p-8 text-center h-full flex flex-col items-center justify-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="font-tenor-sans text-2xl text-gray-900 mb-2">Showing Scheduled!</h3>
                  <p className="text-gray-600 mb-4">
                    Thank you! I'll contact you shortly to confirm the details.
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>Expected response time: Within 2 hours</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}