'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'

interface MatterportTourProps {
  src: string
  poster?: string | null
}

/**
 * Click-to-load facade for the Matterport showcase. The embed pulls several
 * megabytes of WebGL code the moment it is in the document, which competed with
 * the listing's own photos on every page view; now it only loads on demand.
 */
export default function MatterportTour({ src, poster }: MatterportTourProps) {
  const [active, setActive] = useState(false)

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-900 shadow-lg">
      {active ? (
        <iframe
          src={src}
          className="h-full w-full border-0"
          allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
          allowFullScreen
          title="Matterport 3D Tour"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 flex items-center justify-center"
          aria-label="Start the 3D virtual tour"
        >
          {poster ? (
            <Image
              src={poster}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover opacity-60 transition-opacity group-hover:opacity-70"
            />
          ) : null}
          <span className="relative flex items-center gap-3 rounded-full bg-white/90 px-6 py-3 font-manrope text-base font-medium text-gray-900 shadow-lg transition-transform group-hover:scale-105">
            <Play className="h-5 w-5 fill-current" />
            Start 3D Tour
          </span>
        </button>
      )}
    </div>
  )
}
