"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function MobileNav() {
  const [open, setOpen] = useState(false)

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
              src="/images/logo.png"
              alt="Pooya Pirayesh Luxury Real Estate"
              width={180}
              height={45}
              className="h-auto"
            />
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="flex flex-col space-y-6 mt-8">
            <Link
              href="/"
              className="font-montserrat text-lg font-medium tracking-wide uppercase hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/listings"
              className="font-montserrat text-lg font-medium tracking-wide uppercase hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              Listings
            </Link>
            <Link
              href="/why-us"
              className="font-montserrat text-lg font-medium tracking-wide uppercase hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              Why Us
            </Link>
            <Link
              href="/resources"
              className="font-montserrat text-lg font-medium tracking-wide uppercase hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              Resources
            </Link>
            <Link
              href="/contact"
              className="font-montserrat text-lg font-medium tracking-wide uppercase hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
