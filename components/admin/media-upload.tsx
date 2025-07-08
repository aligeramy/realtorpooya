'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Upload, Image as ImageIcon, Video, GripVertical, Star } from 'lucide-react'
import Image from 'next/image'

interface MediaFile {
  id: string
  url: string
  file?: File
  type: 'image' | 'video'
  alt_text?: string
  caption?: string
  title?: string
  description?: string
  is_hero?: boolean
  uploading?: boolean
}

interface MediaUploadProps {
  images: MediaFile[]
  videos: MediaFile[]
  onImagesChange: (images: MediaFile[]) => void
  onVideosChange: (videos: MediaFile[]) => void
}

function SortableMediaItem({ 
  media, 
  onUpdate, 
  onRemove, 
  onSetHero,
  heroImageUrl
}: { 
  media: MediaFile
  onUpdate: (id: string, updates: Partial<MediaFile>) => void
  onRemove: (id: string) => void
  onSetHero?: (id: string) => void
  heroImageUrl?: string
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: media.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Card className="overflow-hidden">
        <div className="relative">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="absolute top-2 left-2 z-10 bg-white/80 rounded p-1 cursor-grab hover:bg-white"
          >
            <GripVertical className="h-4 w-4 text-gray-600" />
          </div>

          {/* Remove Button */}
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
            onClick={() => onRemove(media.id)}
          >
            <X className="h-3 w-3" />
          </Button>

          {/* Hero Badge */}
          {media.is_hero && (
            <div className="absolute top-2 right-12 z-10 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
              Hero
            </div>
          )}

          {/* Media Preview */}
          <div className="aspect-video bg-gray-100 relative">
            {media.uploading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#473729]"></div>
              </div>
            ) : media.type === 'image' ? (
              <Image
                src={media.url}
                alt={media.alt_text || 'Property image'}
                fill
                className="object-cover"
              />
            ) : (
              <video
                src={media.url}
                className="w-full h-full object-cover"
                controls
                poster={heroImageUrl}
              />
            )}
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {media.type === 'image' ? (
            <>
              <div>
                <Label htmlFor={`alt-${media.id}`} className="text-xs">Alt Text</Label>
                <Input
                  id={`alt-${media.id}`}
                  value={media.alt_text || ''}
                  onChange={(e) => onUpdate(media.id, { alt_text: e.target.value })}
                  placeholder="Describe this image..."
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor={`caption-${media.id}`} className="text-xs">Caption</Label>
                <Input
                  id={`caption-${media.id}`}
                  value={media.caption || ''}
                  onChange={(e) => onUpdate(media.id, { caption: e.target.value })}
                  placeholder="Image caption..."
                  className="text-sm"
                />
              </div>
              {onSetHero && (
                <Button
                  variant={media.is_hero ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSetHero(media.id)}
                  className="w-full"
                >
                  <Star className="mr-1 h-3 w-3" />
                  {media.is_hero ? 'Hero Image' : 'Set as Hero'}
                </Button>
              )}
            </>
          ) : (
            <>
              <div>
                <Label htmlFor={`title-${media.id}`} className="text-xs">Title</Label>
                <Input
                  id={`title-${media.id}`}
                  value={media.title || ''}
                  onChange={(e) => onUpdate(media.id, { title: e.target.value })}
                  placeholder="Video title..."
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor={`desc-${media.id}`} className="text-xs">Description</Label>
                <Input
                  id={`desc-${media.id}`}
                  value={media.description || ''}
                  onChange={(e) => onUpdate(media.id, { description: e.target.value })}
                  placeholder="Video description..."
                  className="text-sm"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function MediaUpload({ images, videos, onImagesChange, onVideosChange }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false)

  // Get hero image URL
  const heroImageUrl = images.find(img => img.is_hero)?.url

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&folder=properties`, {
      method: 'POST',
      body: file,
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    return data.url
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)

    try {
      const newFiles = acceptedFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        file,
        type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
        uploading: true,
      }))

      // Add files to appropriate arrays immediately
      const newImages = newFiles.filter(f => f.type === 'image')
      const newVideos = newFiles.filter(f => f.type === 'video')

      // Update state with new files
      let currentImages = [...images, ...newImages]
      let currentVideos = [...videos, ...newVideos]

      if (newImages.length > 0) {
        onImagesChange(currentImages)
      }
      if (newVideos.length > 0) {
        onVideosChange(currentVideos)
      }

      // Upload files one by one
      for (const newFile of newFiles) {
        try {
          const url = await uploadFile(newFile.file!)
          
          if (newFile.type === 'image') {
            // Update current images array and state
            currentImages = currentImages.map((img: MediaFile) => 
              img.id === newFile.id 
                ? { ...img, url, uploading: false, file: undefined }
                : img
            )
            onImagesChange(currentImages)
          } else {
            // Update current videos array and state
            currentVideos = currentVideos.map((vid: MediaFile) => 
              vid.id === newFile.id 
                ? { ...vid, url, uploading: false, file: undefined }
                : vid
            )
            onVideosChange(currentVideos)
          }
        } catch (error) {
          console.error('Upload failed:', error)
          // Remove failed upload from current arrays
          if (newFile.type === 'image') {
            currentImages = currentImages.filter(img => img.id !== newFile.id)
            onImagesChange(currentImages)
          } else {
            currentVideos = currentVideos.filter(vid => vid.id !== newFile.id)
            onVideosChange(currentVideos)
          }
        }
      }
    } finally {
      setUploading(false)
    }
  }, [images, videos, onImagesChange, onVideosChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
    },
    multiple: true,
  })

  const updateImage = (id: string, updates: Partial<MediaFile>) => {
    onImagesChange(images.map(img => img.id === id ? { ...img, ...updates } : img))
  }

  const updateVideo = (id: string, updates: Partial<MediaFile>) => {
    onVideosChange(videos.map(vid => vid.id === id ? { ...vid, ...updates } : vid))
  }

  const removeImage = (id: string) => {
    onImagesChange(images.filter(img => img.id !== id))
  }

  const removeVideo = (id: string) => {
    onVideosChange(videos.filter(vid => vid.id !== id))
  }

  const setHeroImage = (id: string) => {
    onImagesChange(images.map(img => ({ ...img, is_hero: img.id === id })))
  }

  const handleImageDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = images.findIndex(img => img.id === active.id)
      const newIndex = images.findIndex(img => img.id === over.id)
      onImagesChange(arrayMove(images, oldIndex, newIndex))
    }
  }

  const handleVideoDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = videos.findIndex(vid => vid.id === active.id)
      const newIndex = videos.findIndex(vid => vid.id === over.id)
      onVideosChange(arrayMove(videos, oldIndex, newIndex))
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-[#473729] bg-[#473729]/5'
            : 'border-gray-300 hover:border-[#473729]'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-lg text-[#473729]">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-lg text-gray-600 mb-2">
              Drag & drop images and videos here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supports: JPEG, PNG, WebP, MP4, MOV, AVI, MKV
            </p>
          </div>
        )}
      </div>

      {/* Images Section */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="h-5 w-5 text-[#473729]" />
            <h3 className="text-lg font-semibold">Images ({images.length})</h3>
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleImageDragEnd}
          >
            <SortableContext items={images.map(img => img.id)} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image) => (
                  <SortableMediaItem
                    key={image.id}
                    media={image}
                    onUpdate={updateImage}
                    onRemove={removeImage}
                    onSetHero={setHeroImage}
                    heroImageUrl={heroImageUrl}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Videos Section */}
      {videos.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Video className="h-5 w-5 text-[#473729]" />
            <h3 className="text-lg font-semibold">Videos ({videos.length})</h3>
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleVideoDragEnd}
          >
            <SortableContext items={videos.map(vid => vid.id)} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <SortableMediaItem
                    key={video.id}
                    media={video}
                    onUpdate={updateVideo}
                    onRemove={removeVideo}
                    heroImageUrl={heroImageUrl}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  )
} 