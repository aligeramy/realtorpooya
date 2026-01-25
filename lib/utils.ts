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

// Find property by address slug (supports format: address-slug-id-suffix)
export function findPropertyBySlug(properties: any[], slug: string): any | null {
  // Extract ID suffix if present (last 8 hex characters after last hyphen)
  // Format: "23-hollywood-ave-507209fa" -> address: "23-hollywood-ave", idSuffix: "507209fa"
  // Format: "523-parliament-st-1-7596735f" -> address: "523-parliament-st-1", idSuffix: "7596735f"
  const parts = slug.split('-')
  let addressSlug = slug
  let idSuffix: string | null = null
  
  // Check if last part is an 8-character hex string (UUID suffix)
  const lastPart = parts[parts.length - 1]
  if (lastPart && lastPart.length === 8 && /^[0-9a-f]{8}$/i.test(lastPart)) {
    idSuffix = lastPart.toLowerCase()
    addressSlug = parts.slice(0, -1).join('-')
  }
  
  // First try exact match with ID suffix (most reliable and fastest)
  if (idSuffix) {
    const property = properties.find(p => {
      if (!p.id) return false
      const propertyAddressSlug = createAddressSlug(p.address || '')
      const propertyIdSuffix = p.id.slice(-8).toLowerCase()
      return propertyAddressSlug === addressSlug && propertyIdSuffix === idSuffix
    })
    if (property) return property
  }
  
  // Try exact address slug match (without ID suffix)
  let property = properties.find(p => {
    const propertySlug = createAddressSlug(p.address || '')
    return propertySlug === slug || propertySlug === addressSlug
  })
  
  // If no exact match, try fuzzy matching (fallback)
  if (!property) {
    property = properties.find(p => {
      const propertySlug = createAddressSlug(p.address || '')
      const normalizedSlug = slug.replace(/-/g, '').toLowerCase()
      const normalizedPropertySlug = propertySlug.replace(/-/g, '').toLowerCase()
      // Check if slug is contained in property slug or vice versa
      return normalizedPropertySlug.includes(normalizedSlug) || 
             normalizedSlug.includes(normalizedPropertySlug)
    })
  }
  
  return property || null
}
