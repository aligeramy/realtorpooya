import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, propertyId, preferredDate, preferredTime, message } = body

    // Here you would typically send an email or save to a CRM
    // For now, we'll just log the showing request
    console.log('Showing request received:', {
      name,
      email,
      phone,
      propertyId,
      preferredDate,
      preferredTime,
      message,
      timestamp: new Date().toISOString()
    })

    // You can integrate with your email service or calendar API here
    // Example: SendGrid, Google Calendar API, etc.

    return NextResponse.json({ 
        success: true, 
      message: 'Showing request received successfully' 
    })
  } catch (error) {
    console.error('Error processing showing request:', error)
    return NextResponse.json(
      { error: 'Failed to process showing request' },
      { status: 500 }
    )
  }
} 