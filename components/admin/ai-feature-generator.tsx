'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface AIFeatureGeneratorProps {
  formData: {
    description?: string
    bedrooms?: string
    bathrooms?: string
    square_feet?: string
    year_built?: string
    property_type?: string
    address?: string
    city?: string
    price?: string
  }
  onFeaturesGenerated: (features: string[]) => void
  onTagsGenerated: (tags: string[]) => void
}

export default function AIFeatureGenerator({ 
  formData, 
  onFeaturesGenerated, 
  onTagsGenerated 
}: AIFeatureGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleGenerateFeatures = async () => {
    if (!formData.description && !formData.bedrooms && !formData.bathrooms) {
      setError('Please add a description or property details first')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/ai/generate-features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate features')
      }

      if (data.success) {
        if (data.features && data.features.length > 0) {
          onFeaturesGenerated(data.features)
        }
        if (data.tags && data.tags.length > 0) {
          onTagsGenerated(data.tags)
        }
        
        const featureCount = data.features?.length || 0
        const tagCount = data.tags?.length || 0
        
        setSuccess(`✨ Generated ${featureCount} features and ${tagCount} tags!${data.fallback ? ' (Using fallback due to AI error)' : ''}`)
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000)
      } else {
        setError('Failed to generate features and tags')
      }
    } catch (err) {
      console.error('AI feature generation error:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to generate features. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const hasPropertyData = formData.description || formData.bedrooms || formData.bathrooms || formData.address

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Feature Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>Use AI to automatically generate property features and tags based on your description and property details.</p>
        </div>

        <Button 
          onClick={handleGenerateFeatures} 
          disabled={loading || !hasPropertyData}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating with AI...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Features & Tags
            </>
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {!hasPropertyData && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Add a property description, address, or basic details (bedrooms, bathrooms) to enable AI feature generation.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>How it works:</strong></p>
          <p>• AI analyzes your property description and details</p>
          <p>• Generates relevant features (e.g., "Hardwood Floors", "Granite Countertops")</p>
          <p>• Creates searchable tags (e.g., "Luxury", "Family-Friendly")</p>
          <p>• You can edit or remove any generated items</p>
        </div>
      </CardContent>
    </Card>
  )
} 