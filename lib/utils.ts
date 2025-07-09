import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Create a URL-friendly slug from an address
export function createAddressSlug(address: string): string {
  return address
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

// Convert slug back to search for address (for reverse lookup)
export function slugToAddressPattern(slug: string): string {
  return slug
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/\s+/g, ' ') // Normalize multiple spaces
    .trim()
}

// Find property by address slug
export function findPropertyBySlug(properties: any[], slug: string): any | null {
  const addressPattern = slugToAddressPattern(slug)
  
  // First try exact match after slug conversion
  let property = properties.find(p => 
    createAddressSlug(p.address) === slug
  )
  
  // If no exact match, try fuzzy matching
  if (!property) {
    property = properties.find(p => {
      const propertySlug = createAddressSlug(p.address)
      const normalizedSlug = slug.replace(/-/g, '').toLowerCase()
      const normalizedPropertySlug = propertySlug.replace(/-/g, '').toLowerCase()
      return normalizedPropertySlug.includes(normalizedSlug) || 
             normalizedSlug.includes(normalizedPropertySlug)
    })
  }
  
  return property || null
}
