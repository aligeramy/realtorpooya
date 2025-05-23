"use client"

import { useState } from "react"
import { DollarSign, Plus, Minus, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type FilterProps = {
  onApplyFilter: (key: string, value: any) => void
  activeFilters: any
}

export default function SearchFilters({ onApplyFilter, activeFilters }: FilterProps) {
  const [beds, setBeds] = useState(activeFilters.beds || 0)
  const [baths, setBaths] = useState(activeFilters.baths || 0)
  const [priceRange, setPriceRange] = useState<[number, number]>(activeFilters.priceRange || [500000, 5000000])
  const [forSale, setForSale] = useState(activeFilters.forSale !== undefined ? activeFilters.forSale : true)
  const [keyword, setKeyword] = useState("")
  const [keywords, setKeywords] = useState<string[]>(activeFilters.keywords || [])

  const addKeyword = () => {
    if (keyword && !keywords.includes(keyword)) {
      const newKeywords = [...keywords, keyword]
      setKeywords(newKeywords)
      onApplyFilter("keywords", newKeywords)
      setKeyword("")
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    const newKeywords = keywords.filter((k) => k !== keywordToRemove)
    setKeywords(newKeywords)
    onApplyFilter("keywords", newKeywords.length > 0 ? newKeywords : undefined)
  }

  const handleBedsChange = (newValue: number) => {
    setBeds(newValue)
    onApplyFilter("beds", newValue > 0 ? newValue : undefined)
  }

  const handleBathsChange = (newValue: number) => {
    setBaths(newValue)
    onApplyFilter("baths", newValue > 0 ? newValue : undefined)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="space-y-6">
        <div>
          <Label className="text-gray-700 font-medium mb-2 block">Property Type</Label>
          <Select
            onValueChange={(value) => onApplyFilter("propertyType", value)}
            defaultValue={activeFilters.propertyType}
          >
            <SelectTrigger className="w-full h-12 rounded-full border-gray-200 bg-white">
              <SelectValue placeholder="Residential" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="land">Land</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-gray-700 font-medium mb-2 block">Home Type</Label>
          <Select onValueChange={(value) => onApplyFilter("homeType", value)} defaultValue={activeFilters.homeType}>
            <SelectTrigger className="w-full h-12 rounded-full border-gray-200 bg-white">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label className="text-gray-700 font-medium">For Sale</Label>
            <Switch
              checked={forSale}
              onCheckedChange={(checked) => {
                setForSale(checked)
                onApplyFilter("forSale", checked)
              }}
            />
          </div>
          <div className="text-sm text-gray-500">
            {forSale ? "Showing properties for sale" : "Showing properties for rent"}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-gray-700 font-medium mb-2 block">Beds</Label>
          <div className="flex items-center justify-between">
            <Select onValueChange={(value) => handleBedsChange(Number.parseInt(value))} value={beds.toString()}>
              <SelectTrigger className="w-full h-12 rounded-full border-gray-200 bg-white">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center ml-4">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-gray-300"
                onClick={() => handleBedsChange(Math.max(0, beds - 1))}
                disabled={beds === 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="mx-4 font-medium text-lg">{beds}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-gray-300"
                onClick={() => handleBedsChange(beds + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-gray-700 font-medium mb-2 block">Baths</Label>
          <div className="flex items-center justify-between">
            <Select onValueChange={(value) => handleBathsChange(Number.parseInt(value))} value={baths.toString()}>
              <SelectTrigger className="w-full h-12 rounded-full border-gray-200 bg-white">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center ml-4">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-gray-300"
                onClick={() => handleBathsChange(Math.max(0, baths - 1))}
                disabled={baths === 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="mx-4 font-medium text-lg">{baths}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-gray-300"
                onClick={() => handleBathsChange(baths + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-gray-700 font-medium mb-2 block">Square Feet</Label>
          <Select>
            <SelectTrigger className="w-full h-12 rounded-full border-gray-200 bg-white">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="500-1000">500 - 1,000 sq ft</SelectItem>
              <SelectItem value="1000-2000">1,000 - 2,000 sq ft</SelectItem>
              <SelectItem value="2000-3000">2,000 - 3,000 sq ft</SelectItem>
              <SelectItem value="3000-4000">3,000 - 4,000 sq ft</SelectItem>
              <SelectItem value="4000+">4,000+ sq ft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-gray-700 font-medium mb-2 block">Price Range</Label>
          <Select>
            <SelectTrigger className="w-full h-12 rounded-full border-gray-200 bg-white">
              <div className="flex items-center">
                <DollarSign className="mr-1 h-4 w-4" />
                <span>$500,000 - $5,000,000</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="0-500000">$0 - $500,000</SelectItem>
              <SelectItem value="500000-1000000">$500,000 - $1,000,000</SelectItem>
              <SelectItem value="1000000-2000000">$1,000,000 - $2,000,000</SelectItem>
              <SelectItem value="2000000-5000000">$2,000,000 - $5,000,000</SelectItem>
              <SelectItem value="5000000+">$5,000,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-gray-700 font-medium mb-2 block">Keywords</Label>
          <div className="flex">
            <Input
              placeholder="Pool, Parking, A/C..."
              className="rounded-l-full h-12 border-gray-200 bg-white"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addKeyword()
                }
              }}
            />
            <Button className="rounded-r-full h-12 px-6 bg-[#473729] hover:bg-[#3a9aa7]" onClick={addKeyword}>
              Add
            </Button>
          </div>
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {keywords.map((kw) => (
                <Badge
                  key={kw}
                  className="bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center gap-1 py-1.5 px-3"
                  onClick={() => removeKeyword(kw)}
                >
                  <Tag className="h-3 w-3" />
                  {kw}
                  <Minus className="h-3 w-3 ml-1 cursor-pointer" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4">
          <Button className="w-full rounded-full h-12 bg-[#473729] hover:bg-[#3a9aa7]">Apply Filters</Button>
        </div>
      </div>
    </div>
  )
}
