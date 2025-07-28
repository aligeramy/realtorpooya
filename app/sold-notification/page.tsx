import SoldNotificationForm from '@/components/sold-notification-form'

export default function SoldNotificationPage() {
  return (
    <div className="min-h-screen bg-[#f9f6f1] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#473729] mb-4">
            🎉 Sold Property Notification
          </h1>
          <p className="text-[#8a7a63] text-lg max-w-2xl mx-auto">
            Send beautiful, luxury-themed email notifications when a property is sold. 
            Showcase your successful sales with professional email templates that match your brand.
          </p>
        </div>

        <div className="mb-8 bg-white rounded-lg border border-[#aa9578] p-6">
          <h2 className="text-2xl font-bold text-[#473729] mb-4">✨ Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#8a7a63]">
            <div className="flex items-start space-x-2">
              <span className="text-[#aa9578] font-bold">•</span>
              <span>Luxury-themed email design matching your brand</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-[#aa9578] font-bold">•</span>
              <span>Optional original price display with "over asking" calculation</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-[#aa9578] font-bold">•</span>
              <span>Property details with bedrooms, bathrooms, and square footage</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-[#aa9578] font-bold">•</span>
              <span>Professional agent branding and contact information</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-[#aa9578] font-bold">•</span>
              <span>Mobile-responsive design for all devices</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-[#aa9578] font-bold">•</span>
              <span>Celebration elements to highlight successful sales</span>
            </div>
          </div>
        </div>

        <SoldNotificationForm />

        <div className="mt-8 text-center text-[#8a7a63]">
          <p className="text-sm">
            This replaces the modern listing email template with a sold-focused design 
            using the same luxury theme as your existing brand materials.
          </p>
          <p className="text-xs mt-2 opacity-75">
            Email notifications are sent to: sold@realtorpooya.ca
          </p>
        </div>
      </div>
    </div>
  )
}