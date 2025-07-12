"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useRouter, usePathname } from "next/navigation"

const menuItems = [
  { name: "Home", href: "#home" },
  { name: "Listings", href: "#listings" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" }
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-white">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center py-4">
            <Image
              src="/icon.png"
              alt="Pooya Pirayeshakbari Luxury Real Estate"
              width={60}
              height={20}
              className="h-auto max-h-[35px] w-auto"
            />
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="flex flex-col space-y-6 mt-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-montserrat text-lg font-medium tracking-wide uppercase hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  setOpen(false)
                  
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
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
