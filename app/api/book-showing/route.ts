import { NextResponse } from 'next/server'

// Email template functions for showing requests
function createShowingNotificationEmailHTML({ name, email, phone, preferredDate, preferredTime, propertyId, message, submittedAt }: {
  name: string
  email: string
  phone: string
  preferredDate: string
  preferredTime: string
  propertyId: string
  message: string
  submittedAt: string
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Property Showing Request</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; line-height: 1.6; color: #473729; background-color: #f9f6f1; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #aa9578 0%, #8a7a63 100%); padding: 40px 30px; text-align: center; }
    .logo { color: white; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .content { padding: 40px 30px; }
    .title { color: #473729; font-size: 28px; font-weight: 700; margin-bottom: 20px; text-align: center; }
    .info-section { background: #f3ecdf; border-radius: 12px; padding: 25px; margin: 25px 0; }
    .showing-section { background: #fff; border: 2px solid #aa9578; border-radius: 12px; padding: 25px; margin: 25px 0; }
    .info-row { display: flex; margin-bottom: 15px; align-items: flex-start; }
    .info-label { font-weight: 600; color: #aa9578; min-width: 120px; margin-right: 15px; }
    .info-value { color: #473729; flex: 1; }
    .message-section { background: #fff; border: 2px solid #e9e0cc; border-radius: 12px; padding: 25px; margin: 25px 0; }
    .message-title { color: #aa9578; font-weight: 600; margin-bottom: 15px; font-size: 16px; }
    .message-content { color: #473729; white-space: pre-wrap; }
    .footer { background: #473729; color: white; padding: 30px; text-align: center; }
    .timestamp { color: #8a7a63; font-size: 14px; text-align: center; margin-top: 20px; }
    .priority { background: #aa9578; color: white; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: 600; display: inline-block; margin-bottom: 20px; }
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
      <img src="https://realtorpooya.ca/images/logo.png" alt="Pooya Pirayeshakbari Real Estate" style="max-height: 60px; height: auto;" />
    </div>
    
    <div class="content">
      <div style="text-align: center;">
        <div class="priority">🏠 PROPERTY SHOWING REQUEST</div>
      </div>
      <h1 class="title">New Showing Request</h1>
      
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
      </div>
      
      <div class="showing-section">
        <h3 style="color: #aa9578; margin-bottom: 20px; text-align: center;">📅 Showing Details</h3>
        <div class="info-row">
          <div class="info-label">Preferred Date:</div>
          <div class="info-value" style="font-weight: 600;">${preferredDate}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Preferred Time:</div>
          <div class="info-value" style="font-weight: 600;">${preferredTime}</div>
        </div>
        ${propertyId !== 'Not specified' ? `
        <div class="info-row">
          <div class="info-label">Property ID:</div>
          <div class="info-value" style="font-weight: 600;">${propertyId}</div>
        </div>
        ` : ''}
      </div>
      
      ${message && message !== 'No additional message' ? `
      <div class="message-section">
        <div class="message-title">Additional Message:</div>
        <div class="message-content">${message}</div>
      </div>
      ` : ''}
      
      <div class="timestamp">Submitted at: ${submittedAt}</div>
    </div>
    
    <div class="footer">
      <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
        <img src="https://realtorpooya.ca/images/agent-photo.jpg" alt="Pooya Pirayeshakbari" style="width: 80px; height: 80px; border-radius: 50%; margin-right: 20px;" />
        <div style="text-align: left;">
          <div style="font-weight: 600; font-size: 18px; margin-bottom: 5px;">Pooya Pirayeshakbari</div>
          <div style="color: rgba(255,255,255,0.9); font-size: 14px;">Luxury Real Estate Specialist</div>
          <div style="color: rgba(255,255,255,0.8); font-size: 14px; margin-top: 5px;">
            Phone: 416-553-7707 | Email: sold@realtorpooya.ca
          </div>
        </div>
      </div>
      <div style="text-align: center;">
        <img src="https://realtorpooya.ca/images/lepage-logo.png" alt="Royal LePage Your Community Realty" style="max-height: 40px; height: auto;" />
      </div>
    </div>
  </div>
</body>
</html>
  `
}

function createShowingAutoReplyEmailHTML({ name, preferredDate, preferredTime }: { name: string, preferredDate: string, preferredTime: string }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Showing Request Received</title>
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
    .showing-details { background: #fff; border: 2px solid #aa9578; border-radius: 12px; padding: 25px; margin: 25px 0; }
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
      <img src="https://realtorpooya.ca/images/logo.png" alt="Pooya Pirayeshakbari Real Estate" style="max-height: 60px; height: auto;" />
    </div>
    
    <div class="content">
      <h1 class="title">🏠 Showing Request Received!</h1>
      
      <p class="message">Dear ${name},</p>
      
      <div class="highlight-box">
        <p style="color: #aa9578; font-weight: 600; font-size: 18px; margin-bottom: 10px;">Request Confirmed</p>
        <p style="color: #473729;">Your property showing request has been received successfully.</p>
      </div>
      
      <div class="showing-details">
        <h3 style="color: #aa9578; margin-bottom: 15px; text-align: center;">📅 Your Requested Details</h3>
        <div style="text-align: center;">
          <p style="margin-bottom: 10px;"><strong>Date:</strong> ${preferredDate}</p>
          <p><strong>Time:</strong> ${preferredTime}</p>
        </div>
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
        <img src="https://realtorpooya.ca/images/agent-photo.jpg" alt="Pooya Pirayeshakbari" style="width: 80px; height: 80px; border-radius: 50%; margin-right: 20px;" />
        <div style="text-align: left;">
          <div style="font-weight: 600; font-size: 18px; margin-bottom: 5px;">Pooya Pirayeshakbari</div>
          <div style="color: rgba(255,255,255,0.9); font-size: 14px;">Luxury Real Estate Specialist</div>
          <div style="color: rgba(255,255,255,0.8); font-size: 14px; margin-top: 5px;">
            Phone: 416-553-7707 | Email: sold@realtorpooya.ca
          </div>
        </div>
      </div>
      <div style="text-align: center;">
        <img src="https://realtorpooya.ca/images/lepage-logo.png" alt="Royal LePage Your Community Realty" style="max-height: 40px; height: auto;" />
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

    // Format the email content with HTML template
    const emailSubject = `New Property Showing Request from ${name}`
    const emailContent = createShowingNotificationEmailHTML({
      name,
      email,
      phone,
      preferredDate: preferredDate || 'Not specified',
      preferredTime: preferredTime || 'Not specified',
      propertyId: propertyId || 'Not specified',
      message: message || 'No additional message',
      submittedAt: new Date().toLocaleString()
    })

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
          to: [process.env.EMAIL_TO || 'sold@realtorpooya.ca'],
          subject: emailSubject,
          html: emailContent,
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
      const autoReplyContent = createShowingAutoReplyEmailHTML({ 
        name, 
        preferredDate: preferredDate || 'Not specified', 
        preferredTime: preferredTime || 'Not specified' 
      })

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
          html: autoReplyContent,
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