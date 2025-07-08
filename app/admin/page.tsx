'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye, DollarSign, Home, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Property {
  id: string
  title: string
  address: string
  city: string
  province: string
  price: number
  bedrooms: number
  bathrooms: number
  square_feet: number
  status: string
  featured: boolean
  hero_image: string
  images: Array<{ url: string }>
  createdAt: string
}

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/admin/properties')
      const data = await response.json()
      setProperties(data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return

    try {
      await fetch(`/api/admin/properties/${id}`, {
        method: 'DELETE',
      })
      setProperties(properties.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting property:', error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FOR_SALE': return 'bg-green-100 text-green-800'
      case 'SOLD': return 'bg-blue-100 text-blue-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'OFF_MARKET': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#473729] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
              <p className="text-gray-600">Manage your real estate listings</p>
            </div>
            <Link href="/admin/properties/new">
              <Button className="bg-[#473729] hover:bg-[#473729]/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Home className="h-8 w-8 text-[#473729]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">For Sale</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {properties.filter(p => p.status === 'FOR_SALE').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {properties.filter(p => p.featured).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sold</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {properties.filter(p => p.status === 'SOLD').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={property.hero_image || property.images[0]?.url || '/placeholder.jpg'}
                  alt={property.title || property.address}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {property.featured && (
                    <Badge className="bg-yellow-500 text-white">Featured</Badge>
                  )}
                  <Badge className={getStatusColor(property.status)}>
                    {property.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {property.title || property.address}
                </h3>
                
                <p className="text-gray-600 text-sm mb-2">
                  {property.address}, {property.city}, {property.province}
                </p>
                
                <div className="flex justify-between items-center mb-4">
                  <p className="text-2xl font-bold text-[#473729]">
                    {property.price ? formatPrice(property.price) : 'Price on request'}
                  </p>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>{property.bedrooms} bed</span>
                  <span>{property.bathrooms} bath</span>
                  <span>{property.square_feet?.toLocaleString()} sq ft</span>
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/listings/${property.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/admin/properties/${property.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(property.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-12">
            <Home className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No properties</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new property.</p>
            <div className="mt-6">
              <Link href="/admin/properties/new">
                <Button className="bg-[#473729] hover:bg-[#473729]/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Property
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 