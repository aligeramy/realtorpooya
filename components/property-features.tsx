import { Check } from "lucide-react"

interface PropertyFeaturesProps {
  features: string[]
}

export default function PropertyFeatures({ features }: PropertyFeaturesProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center">
          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#4AAEBB]/10 flex items-center justify-center mr-3">
            <Check className="h-4 w-4 text-[#4AAEBB]" />
          </div>
          <span className="text-gray-700">{feature}</span>
        </div>
      ))}
    </div>
  )
}
