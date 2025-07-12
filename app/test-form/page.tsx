import BookShowingButton from "@/components/book-showing-button"

export default function TestFormPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Book Showing Form Test</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-6">Test the Book Showing Popup</h2>
          <p className="text-gray-600 mb-6">
            Click the button below to test the book showing popup. This will help us verify:
          </p>
          
          <ul className="text-gray-600 mb-6 space-y-2">
            <li>• The popup opens correctly</li>
            <li>• All form fields are functional</li>
            <li>• Form submission works</li>
            <li>• Success state displays properly</li>
            <li>• Mobile responsiveness</li>
            <li>• Close button doesn't interfere with mobile nav</li>
          </ul>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Primary Button</h3>
              <BookShowingButton variant="primary" size="default" />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Large Button</h3>
              <BookShowingButton variant="primary" size="lg" />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">XL Button</h3>
              <BookShowingButton variant="primary" size="xl" />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Full Width Button</h3>
              <BookShowingButton variant="primary" size="default" fullWidth />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Outline Button</h3>
              <BookShowingButton variant="outline" size="default" />
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Test Instructions</h3>
          <ol className="text-gray-700 space-y-1">
            <li>1. Click any button to open the popup</li>
            <li>2. Fill in the form fields with test data</li>
            <li>3. Submit the form to test the API integration</li>
            <li>4. Verify the success message appears</li>
            <li>5. Check that the popup closes automatically after 3 seconds</li>
          </ol>
        </div>
      </div>
    </div>
  )
}