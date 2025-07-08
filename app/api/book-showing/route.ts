import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, preferredDate, preferredTime, message } = body

    // Validate required fields
    if (!name || !email || !phone || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Format the date for better readability
    const formattedDate = new Date(preferredDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Format time for better readability
    const timeSlots = {
      morning: 'Morning (9:00 AM - 12:00 PM)',
      afternoon: 'Afternoon (12:00 PM - 5:00 PM)',
      evening: 'Evening (5:00 PM - 8:00 PM)'
    }
    const formattedTime = timeSlots[preferredTime as keyof typeof timeSlots] || preferredTime

    // Email content
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #f3ecdf 0%, #e9e0cc 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #473729; font-size: 28px; margin: 0; font-weight: 300;">New Property Showing Request</h1>
          <p style="color: #8a7a63; margin: 10px 0 0 0; font-size: 16px;">A potential client has requested a showing</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <div style="background-color: #f9f6f1; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
            <h2 style="color: #473729; font-size: 20px; margin: 0 0 20px 0;">Client Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500; width: 120px;">Name:</td>
                <td style="padding: 8px 0; color: #333; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">Email:</td>
                <td style="padding: 8px 0; color: #333;"><a href="mailto:${email}" style="color: #aa9578; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">Phone:</td>
                <td style="padding: 8px 0; color: #333;"><a href="tel:${phone}" style="color: #aa9578; text-decoration: none;">${phone}</a></td>
              </tr>
            </table>
          </div>

          <div style="background-color: #f9f6f1; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
            <h2 style="color: #473729; font-size: 20px; margin: 0 0 20px 0;">Showing Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500; width: 120px;">Date:</td>
                <td style="padding: 8px 0; color: #333; font-weight: 600;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">Time:</td>
                <td style="padding: 8px 0; color: #333; font-weight: 600;">${formattedTime}</td>
              </tr>
            </table>
          </div>

          ${message ? `
          <div style="background-color: #f9f6f1; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
            <h2 style="color: #473729; font-size: 20px; margin: 0 0 15px 0;">Additional Message</h2>
            <p style="color: #555; line-height: 1.6; margin: 0; font-style: italic;">"${message}"</p>
          </div>
          ` : ''}

          <div style="background-color: #473729; border-radius: 12px; padding: 25px; text-align: center;">
            <h3 style="color: #f3ecdf; margin: 0 0 15px 0; font-size: 18px;">Quick Actions</h3>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
              <a href="mailto:${email}" style="background-color: #aa9578; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; display: inline-block;">Reply via Email</a>
              <a href="tel:${phone}" style="background-color: #aa9578; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; display: inline-block;">Call Client</a>
            </div>
          </div>
        </div>

        <div style="background-color: #f3ecdf; padding: 20px 30px; text-align: center; border-top: 1px solid #e9e0cc;">
          <p style="color: #8a7a63; margin: 0; font-size: 14px;">
            This showing request was submitted through your website contact form.
          </p>
          <p style="color: #8a7a63; margin: 5px 0 0 0; font-size: 12px;">
            Pooya Pirayesh Luxury Real Estate
          </p>
        </div>
      </div>
    `

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: 'Pooya Pirayesh Real Estate <onboarding@resend.dev>',
      to: process.env.EMAIL_TO || 'realtorpooya@gmail.com',
      subject: `🏠 New Property Showing Request - ${name}`,
      html: emailHtml,
      text: `
New Property Showing Request

Client Information:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}

Showing Details:
- Date: ${formattedDate}
- Time: ${formattedTime}

${message ? `Additional Message: ${message}` : ''}

Please contact the client to confirm the showing details.
      `.trim()
    })

    if (emailResult.error) {
      console.error('Email sending failed:', emailResult.error)
      return NextResponse.json(
        { error: 'Failed to send email notification' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Showing request submitted successfully',
        emailId: emailResult.data?.id 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 