"use client"

import { X, Phone, Mail, Building2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"

interface FullScreenMenuProps {
  onClose: () => void
}

const menuItems = [
  { name: "Home", href: "#home" },
  { name: "Listings", href: "#listings" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" }
]

export default function FullScreenMenu({ onClose }: FullScreenMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  const menuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 + i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  const contactItemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.8,
        duration: 0.5,
      },
    },
  }

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      {/* Left Side - Background Image */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden md:block md:w-1/2 h-full relative"
      >
        <Image src="/images/menu-bg.jpg" alt="Interior" fill className="object-cover" />
      </motion.div>

      {/* Right Side - Menu */}
      <div className="w-full md:w-1/2 h-full bg-black flex flex-col p-12 md:p-16 lg:p-20 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-8 right-8 text-white hover:bg-white/10"
        >
          <X className="h-8 w-8" />
          <span className="sr-only">Close menu</span>
        </Button>

        {/* Logo in Menu - Using the same logo as hero section */}
        <div className="mb-12">
          <Image
            src="/images/logo.png"
            alt="Pooya Pirayeshakbari Luxury Real Estate"
            width={250}
            height={60}
            className="h-auto"
          />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <nav className="space-y-6 md:space-y-8">
            {menuItems.map((item, i) => (
              <motion.div key={item.name} custom={i} initial="hidden" animate="visible" variants={menuItemVariants}>
                <Link
                  href={item.href}
                  className="block font-tenor-sans text-3xl md:text-4xl text-white hover:text-[#473729] transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    onClose()
                    
                    // If we're not on the home page, navigate to home first
                    if (pathname !== '/') {
                      router.push('/' + item.href)
                    } else {
                      // If we're on the home page, scroll to the section
                      const element = document.querySelector(item.href)
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' })
                      }
                    }
                  }}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Contact Information */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={contactItemVariants}
          className="mt-12 text-white/70 font-manrope space-y-3"
        >
          <p className="flex items-center">
            <Phone className="h-5 w-5 text-white mr-3" />
            <span>416-553-7707</span>
          </p>
          <p className="flex items-center">
            <Building2 className="h-5 w-5 text-white mr-3" />
            <span>905-731-2000</span>
          </p>
          <p className="flex items-center">
            <Mail className="h-5 w-5 text-white mr-3" />
            <span>sold@realtorpooya.ca</span>
          </p>
        </motion.div>

        {/* MLS Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8"
        >
          <Image src="/images/mls.png" alt="MLS" width={120} height={40} />
        </motion.div>
      </div>
    </div>
  )
}
