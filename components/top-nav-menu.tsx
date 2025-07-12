"use client"

import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import FullScreenMenu from "./full-screen-menu"
import { AnimatePresence, motion } from "framer-motion"
import BookShowingButton from "./book-showing-button"

export default function TopNavMenu() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false)

  // Listen for booking form events
  useEffect(() => {
    const handleBookingFormToggle = (event: CustomEvent) => {
      setIsBookingFormOpen(event.detail.isOpen)
      // Close menu if booking form opens
      if (event.detail.isOpen && menuOpen) {
        setMenuOpen(false)
      }
    }

    window.addEventListener('bookingFormToggle', handleBookingFormToggle as EventListener)
    
    return () => {
      window.removeEventListener('bookingFormToggle', handleBookingFormToggle as EventListener)
    }
  }, [menuOpen])

  return (
    <div className="flex items-center gap-2">
      <BookShowingButton variant="primary" size="default" />
      
      <Dialog open={menuOpen} onOpenChange={(open) => {
        // Don't open menu if booking form is open
        if (!isBookingFormOpen) {
          setMenuOpen(open)
        }
      }}>
        <DialogTrigger asChild>
          <button 
            className="flex items-center bg-[#f3ecdf] backdrop-blur-sm rounded-full p-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isBookingFormOpen}
          >
            <div className="flex items-center bg-transparent px-4 py-2">
              <Menu className="h-5 w-5 text-[#aa9578] mr-2" />
              <span className="text-[#aa9578] font-manrope tracking-tight">Menu</span>
            </div>
          </button>
        </DialogTrigger>
        <AnimatePresence>
          {menuOpen && (
            <DialogContent
              className="max-w-full w-full max-h-full h-full p-0 border-none"
              onInteractOutside={(e) => e.preventDefault()}
            >
              <DialogTitle className="sr-only">Site Navigation Menu</DialogTitle>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full h-full"
              >
                <FullScreenMenu onClose={() => setMenuOpen(false)} />
              </motion.div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>
    </div>
  )
}
