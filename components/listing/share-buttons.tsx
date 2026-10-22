'use client'

import { useState } from 'react'
import { Share2, Heart, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ListingShareButtonsProps {
  title: string
}

export function ListingShareButtons({ title }: ListingShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* user dismissed the share sheet */
    }
  }

  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-gray-200" aria-label="Save listing">
        <Heart className="h-5 w-5 text-[#aa9578]" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full h-10 w-10 border-gray-200"
        onClick={share}
        aria-label={copied ? 'Link copied' : 'Share listing'}
      >
        {copied ? <Check className="h-5 w-5 text-green-600" /> : <Share2 className="h-5 w-5 text-[#aa9578]" />}
      </Button>
    </div>
  )
}
