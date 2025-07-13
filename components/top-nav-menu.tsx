"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import FullScreenMenu from "./full-screen-menu"
import { AnimatePresence, motion } from "framer-motion"
import BookShowingButton from "./book-showing-button"

export default function TopNavMenu() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
      <div className="flex items-center bg-[#f3ecdf] backdrop-blur-sm rounded-full p-1">
        <BookShowingButton variant="primary" size="default" className="mr-2" />
        <DialogTrigger asChild>
          <div className="flex items-center bg-transparent px-4 py-2 cursor-pointer">
            <Menu className="h-5 w-5 text-[#aa9578] mr-2" />
            <span className="text-[#aa9578] font-manrope tracking-tight">Menu</span>
          </div>
        </DialogTrigger>
      </div>
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
  )
}
