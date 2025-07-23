import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message, propertyId } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Log the contact request
    console.log('Contact request received:', {
      name,
      email,
      phone,
      message,
      propertyId,
      timestamp: new Date().toISOString()
    })

    // Format the email content
    const emailSubject = `New Contact Form Submission from ${name}`
    const emailContent = `
      New Contact Form Submission
      
      Contact Information:
      - Name: ${name}
      - Email: ${email}
      - Phone: ${phone || 'Not provided'}
      
      Property ID: ${propertyId || 'Not specified'}
      
      Message:
      ${message}
      
      Submitted at: ${new Date().toLocaleString()}
    `

    // Send email notification using Resend
    try {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'noreply@mail.realtorpooya.ca',
          to: [process.env.EMAIL_TO || 'sold@realtorpooya.ca'],
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
        
        Thank you for reaching out!
        
        I have received your message and will get back to you within 24 hours.
        
        If you have any urgent questions, please don't hesitate to call me directly at 416-553-7707.
        
        Best regards,
        Pooya Pirayeshakbari
        Luxury Real Estate Specialist
        Royal LePage Your Community Realty
        
        Phone: 416-553-7707
        Email: sold@realtorpooya.ca
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
          subject: 'Message Received - Pooya Pirayeshakbari Real Estate',
          text: autoReplyContent,
        }),
      })
    } catch (autoReplyError) {
      console.error('Auto-reply email error:', autoReplyError)
      // Continue with success response even if auto-reply fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Contact request received successfully. You will hear back within 24 hours.' 
    })
  } catch (error) {
    console.error('Error processing contact request:', error)
    return NextResponse.json(
      { error: 'Failed to process contact request' },
      { status: 500 }
    )
  }
} 