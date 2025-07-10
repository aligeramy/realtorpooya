import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message, propertyId } = body

    // Here you would typically send an email or save to a CRM
    // For now, we'll just log the contact request
    console.log('Contact request received:', {
      name,
      email,
      phone,
      message,
      propertyId,
      timestamp: new Date().toISOString()
    })

    // You can integrate with your email service here
    // Example: SendGrid, Nodemailer, etc.

    return NextResponse.json({ 
      success: true, 
      message: 'Contact request received successfully' 
    })
  } catch (error) {
    console.error('Error processing contact request:', error)
    return NextResponse.json(
      { error: 'Failed to process contact request' },
      { status: 500 }
    )
  }
} 