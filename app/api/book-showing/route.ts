import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, propertyId, preferredDate, preferredTime, message } = body

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      )
    }

    // Log the showing request
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

    // Format the email content
    const emailSubject = `New Property Showing Request from ${name}`
    const emailContent = `
      New Property Showing Request
      
      Contact Information:
      - Name: ${name}
      - Email: ${email}
      - Phone: ${phone}
      
      Showing Details:
      - Preferred Date: ${preferredDate || 'Not specified'}
      - Preferred Time: ${preferredTime || 'Not specified'}
      - Property ID: ${propertyId || 'Not specified'}
      
      Message:
      ${message || 'No additional message'}
      
      Submitted at: ${new Date().toLocaleString()}
    `

    // Send email notification (you can implement your preferred email service here)
    try {
      // Example using a simple email service
      // You can replace this with SendGrid, Resend, or any other email service
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'noreply@mail.realtorpooya.ca',
          to: [process.env.EMAIL_TO || 'realtorpooya@gmail.com'],
          subject: emailSubject,
          text: emailContent,
        }),
      })

      if (!emailResponse.ok) {
        console.error('Failed to send email notification')
        // Continue with success response even if email fails
      }
    } catch (emailError) {
      console.error('Email service error:', emailError)
      // Continue with success response even if email fails
    }

    // Send auto-reply to the client
    try {
      const autoReplyContent = `
        Dear ${name},
        
        Thank you for your interest in scheduling a property showing!
        
        I have received your request and will contact you within 2 hours to confirm the details and schedule your showing.
        
        Your request details:
        - Preferred Date: ${preferredDate || 'Not specified'}
        - Preferred Time: ${preferredTime || 'Not specified'}
        
        If you have any urgent questions, please don't hesitate to call me directly at 416-553-7707.
        
        Best regards,
        Pooya Pirayeshakbari
        Luxury Real Estate Specialist
        Royal LePage Your Community Realty
        
        Phone: 416-553-7707
        Email: info@realtorpooya.ca
        Website: realtorpooya.ca
      `

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Pooya Pirayeshakbari <${process.env.EMAIL_FROM || 'noreply@mail.realtorpooya.ca'}>`,
          to: [email],
          subject: 'Property Showing Request Received - Pooya Pirayeshakbari Real Estate',
          text: autoReplyContent,
        }),
      })
    } catch (autoReplyError) {
      console.error('Auto-reply email error:', autoReplyError)
      // Continue with success response even if auto-reply fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Showing request received successfully. You will be contacted within 2 hours.' 
    })
  } catch (error) {
    console.error('Error processing showing request:', error)
    return NextResponse.json(
      { error: 'Failed to process showing request' },
      { status: 500 }
    )
  }
} 