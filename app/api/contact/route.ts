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

    // Send email notification using Resend - THIS IS THE PRIMARY EMAIL TO YOU
    let notificationSent = false
    
    console.log('=== ATTEMPTING TO SEND NOTIFICATION EMAIL TO REALTOR ===')
    console.log('To:', process.env.EMAIL_TO || 'sold@realtorpooya.ca')
    console.log('From:', process.env.EMAIL_FROM || 'noreply@mail.realtorpooya.ca')
    console.log('Has RESEND_API_KEY:', !!process.env.RESEND_API_KEY)
    console.log('RESEND_API_KEY length:', process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0)
    
    if (!process.env.RESEND_API_KEY) {
      console.error('CRITICAL ERROR: RESEND_API_KEY is not configured!')
      console.error('Please set RESEND_API_KEY in your environment variables')
      console.error('The contact form will work but you will NOT receive notifications!')
    } else {
      try {
        const emailPayload = {
          from: process.env.EMAIL_FROM || 'noreply@mail.realtorpooya.ca',
          to: [process.env.EMAIL_TO || 'sold@realtorpooya.ca'],
          subject: emailSubject,
          text: emailContent,
        }
        
        console.log('Email payload:', JSON.stringify(emailPayload, null, 2))
        
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailPayload),
        })

        const emailResponseText = await emailResponse.text()
        console.log('Email response status:', emailResponse.status)
        console.log('Email response body:', emailResponseText)

        if (!emailResponse.ok) {
          console.error('FAILED to send email notification!')
          console.error('Status:', emailResponse.status)
          console.error('Response:', emailResponseText)
          console.error('Headers:', Object.fromEntries(emailResponse.headers.entries()))
        } else {
          console.log('✅ SUCCESS: Email notification sent to realtor!')
          notificationSent = true
        }
      } catch (emailError) {
        console.error('EXCEPTION while sending email:', emailError)
        console.error('Error details:', {
          message: emailError.message,
          stack: emailError.stack,
          name: emailError.name
        })
      }
    }

    // Send auto-reply to the client (SECONDARY - less important)
    console.log('=== SENDING AUTO-REPLY TO CLIENT ===')
    console.log('To client:', email)
    
    if (process.env.RESEND_API_KEY) {
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

        const autoReplyResponse = await fetch('https://api.resend.com/emails', {
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
        
        if (autoReplyResponse.ok) {
          console.log('✅ Auto-reply sent successfully to client')
        } else {
          console.error('❌ Auto-reply failed:', await autoReplyResponse.text())
        }
      } catch (autoReplyError) {
        console.error('Auto-reply email error:', autoReplyError)
      }
    } else {
      console.log('⚠️ Skipping auto-reply - no RESEND_API_KEY configured')
    }

    // Provide detailed response about email status
    const response = {
      success: true,
      message: 'Contact request received successfully. You will hear back within 24 hours.',
      notificationSent: notificationSent,
    }

    // If notification failed, log it but still return success to user
    if (!notificationSent) {
      console.error('ALERT: Contact form submitted but realtor notification email failed!')
      response.message = 'Contact request received successfully. If you don\'t hear back within 24 hours, please call 416-553-7707 directly.'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error processing contact request:', error)
    return NextResponse.json(
      { error: 'Failed to process contact request' },
      { status: 500 }
    )
  }
} 