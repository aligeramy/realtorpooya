"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'

interface VideoPlayerProps {
  videoUrl: string
  posterImage?: string
}

export default function VideoPlayer({ videoUrl, posterImage }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : ''
  }

  const videoId = getVideoId(videoUrl)

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
      {!isPlaying && posterImage ? (
        // Poster with play button
        <div 
          className="relative w-full h-full cursor-pointer group"
          onClick={handlePlay}
        >
          <Image
            src={posterImage}
            alt="Video thumbnail"
            fill
            className="object-contain"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity group-hover:bg-black/40">
            <div className="bg-white/90 hover:bg-white rounded-full p-6 transition-colors group-hover:scale-110 transform">
              <Play className="h-12 w-12 text-gray-800" />
            </div>
          </div>
        </div>
      ) : (
        // YouTube iframe
        <iframe
          src={`https://www.youtube.com/embed/${videoId}${isPlaying ? '?autoplay=1' : ''}`}
          title="Property Video Tour"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  )
} 