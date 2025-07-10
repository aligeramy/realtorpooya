"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"

interface PropertyImageGalleryProps {
  images: string[]
  videoUrl?: string
  heroImage?: string
}

export default function PropertyImageGallery({ images, videoUrl, heroImage }: PropertyImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFullGallery, setShowFullGallery] = useState(false)
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null)
  const [direction, setDirection] = useState(0)
  const slideRef = useRef<HTMLDivElement>(null)

  // Make sure we have valid images
  const validImages = images.filter((img) => img && (img.startsWith("/") || img.startsWith("https://")))

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (showFullGallery) {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault()
            prevImage()
            break
          case 'ArrowRight':
            event.preventDefault()
            nextImage()
            break
          case 'Escape':
            event.preventDefault()
            setShowFullGallery(false)
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showFullGallery, currentIndex, validImages.length])

  // Get the background image - use hero image for first slide if available, otherwise use current image
  const getBackgroundImage = (index: number) => {
    if (index === 0 && heroImage) {
      return heroImage
    }
    return validImages[index] || "/placeholder.svg"
  }

  const nextImage = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % validImages.length)
  }

  const prevImage = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + validImages.length) % validImages.length)
  }

  const goToImage = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const openFullScreen = (image: string) => {
    // Close the gallery popup before showing full screen image
    setShowFullGallery(false)
    // Set a small timeout to ensure the gallery is closed first
    setTimeout(() => {
      setFullScreenImage(image)
    }, 100)
  }

  const closeFullScreen = () => {
    setFullScreenImage(null)
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500, // Reduced from 1000 to 500
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -500 : 500, // Reduced from 1000 to 500
      opacity: 0,
    }),
  }

  return (
    <div className="relative">
      {/* Main Image Slider */}
      <div className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30, duration: 0.3 }, // Added shorter duration
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            {/* Blurred Background */}
            <div className="absolute inset-0">
              <Image
                src={getBackgroundImage(currentIndex)}
                alt="Property Background"
                fill
                priority
                className="object-cover blur-sm scale-110"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
            
            {/* Main Image with Shadow */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative w-full h-full shadow-2xl rounded-lg overflow-hidden">
                <Image
                  src={validImages[currentIndex] || "/placeholder.svg"}
                  alt="Property"
                  fill
                  priority
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Video Button - Positioned with pointer-events-none to not interfere with navigation */}
        {videoUrl && currentIndex === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-white/80 hover:bg-white text-gray-800 rounded-full h-16 w-16 flex items-center justify-center pointer-events-auto">
                  <Play className="h-8 w-8" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-full p-0">
                <DialogTitle className="sr-only">Property Video Tour</DialogTitle>
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoUrl.split("v=")[1]}?autoplay=1`}
                    title="Property Video Tour"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Navigation Arrows - Increased z-index to ensure they're above the video button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full h-12 w-12 z-20"
          onClick={prevImage}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full h-12 w-12 z-20"
          onClick={nextImage}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Full Gallery Button */}
        <Button
          variant="ghost"
          className="absolute right-4 bottom-4 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg z-10 font-medium"
          onClick={() => setShowFullGallery(true)}
        >
          See all {validImages.length} photos
        </Button>
      </div>

      {/* Thumbnail Navigation */}
      <div className="container mx-auto px-4  relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-4 relative">
          <div className="overflow-x-auto overflow-y-visible p-1" ref={slideRef}>
            <div className="flex space-x-4 min-w-max py-1 px-1">
              {validImages.map((image, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.975 }}
                  className={`relative h-20 w-32 flex-shrink-0 overflow-hidden transition-all cursor-pointer ${
                    currentIndex === index ? "ring-2 ring-[#aa9578] ring-offset-1 rounded-lg" : "rounded-lg"
                  }`}
                  onClick={() => goToImage(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Property thumbnail ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </motion.div>
              ))}
            </div>
          </div>
          {/* Right fade gradient */}
          <div className="absolute right-4 top-4 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none rounded-r-xl"></div>
        </div>
      </div>

      {/* Full Gallery Modal */}
      <Dialog open={showFullGallery} onOpenChange={setShowFullGallery}>
        <DialogContent className="max-w-[100vw] w-full h-[100vh] p-0 overflow-hidden bg-black border-none ring-0">
          <DialogTitle className="sr-only">Property Image Gallery</DialogTitle>
          <div className="relative h-full w-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/40 text-white rounded-full"
              onClick={() => setShowFullGallery(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Main Gallery Image */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30, duration: 0.3 },
                  opacity: { duration: 0.2 },
                }}
                className="relative w-full h-full flex items-center justify-center p-8"
                onClick={() => setShowFullGallery(false)}
              >
                <div className="relative w-full h-full max-w-6xl max-h-full">
                  <Image
                    src={validImages[currentIndex] || "/placeholder.svg"}
                    alt={`Property image ${currentIndex + 1}`}
                    fill
                    className="object-contain cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowFullGallery(false)
                    }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {validImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full h-12 w-12 z-20"
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full h-12 w-12 z-20"
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full z-20">
              {currentIndex + 1} of {validImages.length}
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 max-w-4xl w-full px-4">
              <div className="flex justify-center space-x-2 overflow-x-auto py-2">
                {validImages.map((image, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative h-16 w-24 flex-shrink-0 overflow-hidden cursor-pointer transition-all ${
                      currentIndex === index 
                        ? "ring-1 ring-[#473729] ring-offset-2 ring-offset-black rounded-lg opacity-100" 
                        : "rounded-lg opacity-60 hover:opacity-80"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      goToImage(index)
                    }}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Screen Image Modal - Using a separate portal with higher z-index */}
      <AnimatePresence>
        {fullScreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center"
            onClick={closeFullScreen}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative w-[90vw] h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={fullScreenImage || "/placeholder.svg"}
                alt="Full screen property image"
                fill
                className="object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  closeFullScreen()
                }}
              >
                <X className="h-6 w-6" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
