import { NextResponse } from 'next/server'

// Email template functions
function createNotificationEmailHTML({ name, email, phone, message, propertyId, submittedAt }: {
  name: string
  email: string
  phone: string
  message: string
  propertyId: string
  submittedAt: string
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; line-height: 1.6; color: #473729; background-color: #f9f6f1; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #aa9578 0%, #8a7a63 100%); padding: 40px 30px; text-align: center; }
    .logo { color: white; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .content { padding: 40px 30px; }
    .title { color: #473729; font-size: 28px; font-weight: 700; margin-bottom: 20px; text-align: center; }
    .info-section { background: #f3ecdf; border-radius: 12px; padding: 25px; margin: 25px 0; }
    .info-row { display: flex; margin-bottom: 15px; align-items: flex-start; }
    .info-label { font-weight: 600; color: #aa9578; min-width: 100px; margin-right: 15px; }
    .info-value { color: #473729; flex: 1; }
    .message-section { background: #fff; border: 2px solid #e9e0cc; border-radius: 12px; padding: 25px; margin: 25px 0; }
    .message-title { color: #aa9578; font-weight: 600; margin-bottom: 15px; font-size: 16px; }
    .message-content { color: #473729; white-space: pre-wrap; }
    .footer { background: #473729; color: white; padding: 30px; text-align: center; }
    .timestamp { color: #8a7a63; font-size: 14px; text-align: center; margin-top: 20px; }
    @media (max-width: 480px) {
      .content { padding: 20px; }
      .info-row { flex-direction: column; }
      .info-label { min-width: auto; margin-bottom: 5px; }
      .footer div[style*="display: flex"] { flex-direction: column; text-align: center; }
      .footer img[style*="border-radius"] { margin-right: 0; margin-bottom: 15px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://realtorpooya.ca/icon.png" alt="Pooya Pirayeshakbari Real Estate" style="max-height: 30px; height: auto;" />
    </div>
    
    <div class="content">
      <h1 class="title">New Contact Form Submission</h1>
      
      <div class="info-section">
        <div class="info-row">
          <div class="info-label">Name:</div>
          <div class="info-value">${name}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Email:</div>
          <div class="info-value">${email}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Phone:</div>
          <div class="info-value">${phone}</div>
        </div>
        ${propertyId !== 'Not specified' ? `
        <div class="info-row">
          <div class="info-label">Property ID:</div>
          <div class="info-value">${propertyId}</div>
        </div>
        ` : ''}
      </div>
      
      <div class="message-section">
        <div class="message-title">Message:</div>
        <div class="message-content">${message}</div>
      </div>
      
      <div class="timestamp">Submitted at: ${submittedAt}</div>
    </div>
    
    <div class="footer">
      <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
        <img src="https://realtorpooya.ca/images/agent-pooya.jpg" alt="Pooya Pirayeshakbari" style="width: 80px; height: 80px; border-radius: 50%; margin-right: 20px;" />
        <div style="text-align: left;">
          <div style="font-weight: 600; font-size: 18px; margin-bottom: 5px;">Pooya Pirayeshakbari</div>
          <div style="color: rgba(255,255,255,0.9); font-size: 14px;">Luxury Real Estate Specialist</div>
          <div style="color: rgba(255,255,255,0.8); font-size: 14px; margin-top: 5px;">
            Phone: 416-553-7707 | Email: sold@realtorpooya.ca
          </div>
        </div>
      </div>
      <div style="text-align: center;">
        <img src="https://realtorpooya.ca/images/lepage.png" alt="Royal LePage Your Community Realty" style="max-height: 40px; height: auto;" />
      </div>
    </div>
  </div>
</body>
</html>
  `
}

function createAutoReplyEmailHTML({ name }: { name: string }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message Received - Thank You</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; line-height: 1.6; color: #473729; background-color: #f9f6f1; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #aa9578 0%, #8a7a63 100%); padding: 40px 30px; text-align: center; }
    .logo { color: white; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .content { padding: 40px 30px; }
    .title { color: #473729; font-size: 28px; font-weight: 700; margin-bottom: 20px; text-align: center; }
    .message { color: #473729; font-size: 16px; margin-bottom: 25px; text-align: center; }
    .highlight-box { background: #f3ecdf; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; }
    .contact-info { background: #fff; border: 2px solid #e9e0cc; border-radius: 12px; padding: 25px; margin: 25px 0; }
    .contact-row { display: flex; justify-content: center; align-items: center; margin: 10px 0; }
    .contact-label { font-weight: 600; color: #aa9578; margin-right: 10px; }
    .contact-value { color: #473729; }
    .footer { background: #473729; color: white; padding: 30px; text-align: center; }
    .agent-info { margin-bottom: 15px; }
    .agent-name { font-size: 18px; font-weight: 600; margin-bottom: 5px; }
    .agent-title { color: rgba(255,255,255,0.9); font-size: 14px; }
    .company { color: rgba(255,255,255,0.8); font-size: 14px; margin-top: 10px; }
    @media (max-width: 480px) {
      .content { padding: 20px; }
      .contact-row { flex-direction: column; text-align: center; }
      .contact-label { margin-right: 0; margin-bottom: 5px; }
      .footer div[style*="display: flex"] { flex-direction: column; text-align: center; }
      .footer img[style*="border-radius"] { margin-right: 0; margin-bottom: 15px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://realtorpooya.ca/icon.png" alt="Pooya Pirayeshakbari Real Estate" style="max-height: 30px; height: auto;" />
    </div>
    
    <div class="content">
      <h1 class="title">Thank You for Reaching Out!</h1>
      
      <p class="message">Dear ${name},</p>
      
      <div class="highlight-box">
        <p style="color: #aa9578; font-weight: 600; font-size: 18px; margin-bottom: 10px;">Thank You!</p>
        <p style="color: #473729;">Your message has been received successfully.</p>
      </div>
      
      <div class="contact-info">
        <p style="color: #aa9578; font-weight: 600; margin-bottom: 15px; text-align: center;">Need Immediate Assistance?</p>
        <div class="contact-row">
          <span class="contact-label">Phone:</span>
          <span class="contact-value">416-553-7707</span>
        </div>
        <div class="contact-row">
          <span class="contact-label">Email:</span>
          <span class="contact-value">sold@realtorpooya.ca</span>
        </div>
        <div class="contact-row">
          <span class="contact-label">Website:</span>
          <span class="contact-value">realtorpooya.ca</span>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
        <img src="https://realtorpooya.ca/images/agent-pooya.jpg" alt="Pooya Pirayeshakbari" style="width: 80px; height: 80px; border-radius: 50%; margin-right: 20px;" />
        <div style="text-align: left;">
          <div style="font-weight: 600; font-size: 18px; margin-bottom: 5px;">Pooya Pirayeshakbari</div>
          <div style="color: rgba(255,255,255,0.9); font-size: 14px;">Luxury Real Estate Specialist</div>
          <div style="color: rgba(255,255,255,0.8); font-size: 14px; margin-top: 5px;">
            Phone: 416-553-7707 | Email: sold@realtorpooya.ca
          </div>
        </div>
      </div>
      <div style="text-align: center;">
        <img src="https://realtorpooya.ca/images/lepage.png" alt="Royal LePage Your Community Realty" style="max-height: 40px; height: auto;" />
      </div>
    </div>
  </div>
</body>
</html>
  `
}

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

    // Format the email content with HTML template
    const emailSubject = `New Contact Form Submission from ${name}`
    const emailContent = createNotificationEmailHTML({
      name,
      email,
      phone: phone || 'Not provided',
      message,
      propertyId: propertyId || 'Not specified',
      submittedAt: new Date().toLocaleString()
    })

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
          html: emailContent,
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
          message: emailError instanceof Error ? emailError.message : String(emailError),
          stack: emailError instanceof Error ? emailError.stack : undefined,
          name: emailError instanceof Error ? emailError.name : 'Unknown'
        })
      }
    }

    // Send auto-reply to the client (SECONDARY - less important)
    console.log('=== SENDING AUTO-REPLY TO CLIENT ===')
    console.log('To client:', email)
    
    if (process.env.RESEND_API_KEY) {
      try {
        const autoReplyContent = createAutoReplyEmailHTML({ name })

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
            html: autoReplyContent,
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