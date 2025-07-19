"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ListingsPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/property-showcase")
  }, [router])

  return null
}
