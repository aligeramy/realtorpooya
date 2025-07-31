'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

interface PropertyDetails {
  address: string
  city: string
  province: string
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  heroImage?: string
}

interface SoldNotificationFormProps {
  onSuccess?: () => void
}

export default function SoldNotificationForm({ onSuccess }: SoldNotificationFormProps) {
  const [loading, setLoading] = useState(false)
  const [showOriginalPrice, setShowOriginalPrice] = useState(false)
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    province: 'ON',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    heroImage: '',
    soldPrice: '',
    originalPrice: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const propertyDetails: PropertyDetails = {
        address: formData.address,
        city: formData.city,
        province: formData.province,
        ...(formData.bedrooms && { bedrooms: parseInt(formData.bedrooms) }),
        ...(formData.bathrooms && { bathrooms: parseInt(formData.bathrooms) }),
        ...(formData.squareFeet && { squareFeet: parseInt(formData.squareFeet) }),
        ...(formData.heroImage && { heroImage: formData.heroImage }),
      }

      const payload = {
        propertyDetails,
        soldPrice: parseInt(formData.soldPrice),
        ...(showOriginalPrice && formData.originalPrice && { 
          originalPrice: parseInt(formData.originalPrice) 
        }),
        showOriginalPrice: showOriginalPrice && !!formData.originalPrice,
      }

      const response = await fetch('/api/sold-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok) {
        alert('Sold notification sent successfully! 🎉')
        setFormData({
          address: '',
          city: '',
          province: 'ON',
          bedrooms: '',
          bathrooms: '',
          squareFeet: '',
          heroImage: '',
          soldPrice: '',
          originalPrice: '',
        })
        setShowOriginalPrice(false)
        onSuccess?.()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error sending sold notification:', error)
      alert('Failed to send sold notification. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-[#aa9578]">
      <CardHeader className="bg-gradient-to-r from-[#aa9578] to-[#8a7a63] text-white">
        <CardTitle className="text-2xl font-bold">🎉 Send Sold Notification</CardTitle>
        <CardDescription className="text-white/90">
          Create a beautiful sold notification email with luxury styling
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Property Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address" className="text-[#473729] font-semibold">
                Property Address *
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main Street"
                required
                className="border-[#aa9578] focus:border-[#8a7a63]"
              />
            </div>
            <div>
              <Label htmlFor="city" className="text-[#473729] font-semibold">
                City *
              </Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Toronto"
                required
                className="border-[#aa9578] focus:border-[#8a7a63]"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="province" className="text-[#473729] font-semibold">
              Province *
            </Label>
            <Input
              id="province"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              placeholder="ON"
              required
              className="border-[#aa9578] focus:border-[#8a7a63]"
            />
          </div>

          {/* Property Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bedrooms" className="text-[#473729] font-semibold">
                Bedrooms
              </Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleInputChange}
                placeholder="3"
                className="border-[#aa9578] focus:border-[#8a7a63]"
              />
            </div>
            <div>
              <Label htmlFor="bathrooms" className="text-[#473729] font-semibold">
                Bathrooms
              </Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleInputChange}
                placeholder="2"
                className="border-[#aa9578] focus:border-[#8a7a63]"
              />
            </div>
            <div>
              <Label htmlFor="squareFeet" className="text-[#473729] font-semibold">
                Square Feet
              </Label>
              <Input
                id="squareFeet"
                name="squareFeet"
                type="number"
                value={formData.squareFeet}
                onChange={handleInputChange}
                placeholder="2500"
                className="border-[#aa9578] focus:border-[#8a7a63]"
              />
            </div>
          </div>

          {/* Property Image */}
          <div>
            <Label htmlFor="heroImage" className="text-[#473729] font-semibold">
              Property Image URL
            </Label>
            <Input
              id="heroImage"
              name="heroImage"
              type="url"
              value={formData.heroImage}
              onChange={handleInputChange}
              placeholder="https://example.com/property-image.jpg"
              className="border-[#aa9578] focus:border-[#8a7a63]"
            />
          </div>

          {/* Price Information */}
          <div className="bg-[#f3ecdf] p-4 rounded-lg border border-[#aa9578]">
            <h3 className="text-[#473729] font-bold text-lg mb-4">💰 Price Information</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="soldPrice" className="text-[#473729] font-semibold">
                  Sold Price * (CAD)
                </Label>
                <Input
                  id="soldPrice"
                  name="soldPrice"
                  type="number"
                  value={formData.soldPrice}
                  onChange={handleInputChange}
                  placeholder="850000"
                  required
                  className="border-[#aa9578] focus:border-[#8a7a63]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showOriginalPrice"
                  checked={showOriginalPrice}
                  onCheckedChange={(checked) => setShowOriginalPrice(checked === true)}
                />
                <Label htmlFor="showOriginalPrice" className="text-[#473729] font-semibold">
                  Show original asking price (to display "over asking" amount)
                </Label>
              </div>

              {showOriginalPrice && (
                <div>
                  <Label htmlFor="originalPrice" className="text-[#473729] font-semibold">
                    Original Asking Price (CAD)
                  </Label>
                  <Input
                    id="originalPrice"
                    name="originalPrice"
                    type="number"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    placeholder="800000"
                    className="border-[#aa9578] focus:border-[#8a7a63]"
                  />
                  {formData.originalPrice && formData.soldPrice && 
                   parseInt(formData.soldPrice) > parseInt(formData.originalPrice) && (
                    <p className="text-sm text-[#aa9578] font-semibold mt-2">
                      💰 ${(parseInt(formData.soldPrice) - parseInt(formData.originalPrice)).toLocaleString()} over asking!
                      ({(((parseInt(formData.soldPrice) - parseInt(formData.originalPrice)) / parseInt(formData.originalPrice)) * 100).toFixed(1)}%)
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#aa9578] hover:bg-[#8a7a63] text-white font-semibold py-3"
          >
            {loading ? '📧 Sending...' : '🎉 Send Sold Notification'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}