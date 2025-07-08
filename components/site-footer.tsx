"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SiteFooter() {
  const [email, setEmail] = useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the email to your newsletter service
    console.log("Subscribing email:", email)
    alert("Thank you for subscribing to our newsletter!")
    setEmail("")
  }

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Logo and About */}
          <div className="space-y-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_Black_RealtorPooya-pj0A0Uo2XwYRg6zyPepeLZYVH9KRL8.png"
              alt="Pooya Pirayesh Luxury Real Estate"
              width={250}
              height={100}
              className="h-auto"
            />
            <p className="text-gray-600 font-light">
              Pooya Pirayesh is a Toronto-based luxury realtor who shepherds clients through the full property
              lifecycle—from sourcing land to selling the finished home for maximum return.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#aa9578] hover:border-[#aa9578] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#aa9578] hover:border-[#aa9578] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#aa9578] hover:border-[#aa9578] transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#aa9578] hover:border-[#aa9578] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-tenor-sans text-xl text-gray-900 mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-gray-600 hover:text-[#aa9578] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/listings" className="text-gray-600 hover:text-[#aa9578] transition-colors">
                  Listings
                </Link>
              </li>
              <li>
                <Link href="/property-showcase" className="text-gray-600 hover:text-[#aa9578] transition-colors">
                  Property Showcase
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-[#aa9578] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-[#aa9578] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Information */}
          <div>
            <h3 className="font-tenor-sans text-xl text-gray-900 mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-[#aa9578] mr-3 mt-0.5" />
                <div>
                  <p className="text-gray-600">416-553-7707</p>
                  <p className="text-gray-600">905-731-2000</p>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-[#aa9578] mr-3 mt-0.5" />
                <p className="text-gray-600">info@realtorpooya.ca</p>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-[#aa9578] mr-3 mt-0.5" />
                <p className="text-gray-600">
                  187 King Street East,
                  <br />
                  Toronto, ON, M5A 1J5
                </p>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="font-tenor-sans text-xl text-gray-900 mb-6">Newsletter</h3>
            <p className="text-gray-600 mb-4 font-light">
              Subscribe to our newsletter to receive the latest updates on luxury properties and market insights.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 pl-4 pr-12 rounded-lg border-[#e9e0cc] focus:border-[#aa9578] focus:ring-[#aa9578]"
                />
                <Button
                  type="submit"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-[#aa9578] hover:bg-[#8a7a63] rounded-full h-10 w-10 flex items-center justify-center p-0"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </form>
            <p className="text-gray-500 text-sm mt-4">
              By subscribing, you agree to our{" "}
              <Link href="#" className="text-[#aa9578] hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <p className="text-gray-500 text-sm mr-4">
                © {new Date().getFullYear()} Pooya Pirayesh Luxury Real Estate. All rights reserved.
              </p>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mls-black-1rmnXlTHQTGR6fPeklCHx40wdv3Lgx.png"
                alt="MLS Realtor"
                width={80}
                height={27}
                className="h-auto"
              />
            </div>
            <div className="text-gray-500 text-sm">
              <p className="text-center md:text-right">
                The trademarks REALTOR®, REALTORS®, and the REALTOR® logo are controlled by The Canadian Real Estate
                Association (CREA).
              </p>
              <p className="text-center md:text-right mt-1">
                The trademarks MLS®, Multiple Listing Service® and the associated logos are owned by CREA.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
