'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface MLSLookupProps {
  onPropertyFound: (propertyData: any, mlsNumber: string) => void
}

export default function MLSLookup({ onPropertyFound }: MLSLookupProps) {
  const [mlsNumber, setMlsNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleLookup = async () => {
    if (!mlsNumber.trim()) {
      setError('Please enter an MLS number')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/mls-lookup?mls=${encodeURIComponent(mlsNumber.trim())}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to lookup property')
      }

      if (data.success && data.property) {
        console.log('Property data received:', data.property)
        setSuccess(`✅ Form populated with MLS data. Review and click "Create Property" to save.`)
        onPropertyFound(data.property, mlsNumber.trim())
        
        // Clear the success message after 8 seconds to give time to see the form populate
        setTimeout(() => setSuccess(''), 8000)
      } else {
        console.log('No property found in response:', data)
        setError('Property not found')
      }
    } catch (err) {
      console.error('MLS lookup error:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to lookup property. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault() // Prevent form submission
      handleLookup()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          MLS Lookup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="mls-number">MLS Number</Label>
            <Input
              id="mls-number"
              value={mlsNumber}
              onChange={(e) => setMlsNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter MLS number (e.g., N1234567)"
              disabled={loading}
            />
          </div>
          <div className="flex items-end">
            <Button 
              type="button"
              onClick={handleLookup} 
              disabled={false}
              className="bg-[#473729] hover:bg-[#473729]/90 enabled:hover:bg-[#473729]/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Looking up...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Lookup
                </>
              )}
            </Button>
          </div>
        </div>

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

      
      </CardContent>
    </Card>
  )
} 