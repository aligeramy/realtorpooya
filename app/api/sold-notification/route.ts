import { NextResponse } from 'next/server'

// Email template function for sold property notifications
function createSoldNotificationEmailHTML({ 
  propertyDetails, 
  soldPrice, 
  originalPrice, 
  showOriginalPrice, 
  submittedAt 
}: {
  propertyDetails: {
    address: string
    city: string
    province: string
    bedrooms?: number
    bathrooms?: number
    squareFeet?: number
    heroImage?: string
  }
  soldPrice: number
  originalPrice?: number
  showOriginalPrice?: boolean
  submittedAt: string
}) {
  // Calculate amount over asking if showing original price
  const overAskingAmount = originalPrice && soldPrice > originalPrice ? soldPrice - originalPrice : 0
  const overAskingPercentage = originalPrice && overAskingAmount > 0 ? 
    ((overAskingAmount / originalPrice) * 100).toFixed(1) : 0

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Property SOLD!</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; line-height: 1.6; color: #473729; background-color: #f9f6f1; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #aa9578 0%, #8a7a63 100%); padding: 40px 10px; text-align: center; }
    .logo { color: white; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .content { padding: 40px 30px; }
    .sold-banner { background: linear-gradient(135deg, #d4a574 0%, #aa9578 100%); color: white; padding: 25px; border-radius: 15px; text-align: center; margin-bottom: 30px; box-shadow: 0 8px 25px rgba(170, 149, 120, 0.3); }
    .sold-title { font-size: 36px; font-weight: 800; margin-bottom: 10px; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
    .sold-subtitle { font-size: 18px; font-weight: 500; opacity: 0.95; }
    .property-section { background: #fff; border: 2px solid #aa9578; border-radius: 12px; padding: 25px; margin: 25px 0; }
    .price-section { background: linear-gradient(135deg, #f3ecdf 0%, #ebe0d0 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; }
    .sold-price { font-size: 48px; font-weight: 800; color: #aa9578; margin-bottom: 15px; text-shadow: 0 2px 4px rgba(170, 149, 120, 0.1); }
    .original-price { font-size: 16px; color: #8a7a63; margin-bottom: 10px; text-decoration: line-through; }
    .over-asking { background: #aa9578; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; display: inline-block; }
    .info-row { display: flex; margin-bottom: 15px; align-items: flex-start; }
    .info-label { font-weight: 600; color: #aa9578; min-width: 120px; margin-right: 15px; }
    .info-value { color: #473729; flex: 1; }
    .property-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
    .feature-card { background: #f9f6f1; border-radius: 8px; padding: 15px; text-align: center; }
    .feature-number { font-size: 24px; font-weight: 700; color: #aa9578; }
    .feature-label { font-size: 12px; color: #8a7a63; text-transform: uppercase; letter-spacing: 0.5px; }
    .property-image { max-width: 100%; height: auto; border-radius: 8px; margin-top: 15px; }
    .footer { background: #473729; color: white; padding: 30px; text-align: center; }
    .timestamp { color: #8a7a63; font-size: 14px; text-align: center; margin-top: 20px; }
    .celebration { background: linear-gradient(135deg, #f3ecdf 0%, #ebe0d0 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; }
    .celebration-text { color: #aa9578; font-size: 18px; font-weight: 600; margin-bottom: 10px; }
    .celebration-emoji { font-size: 32px; margin-bottom: 15px; }
    @media (max-width: 480px) {
      .content { padding: 20px; }
      .sold-title { font-size: 28px; }
      .sold-price { font-size: 36px; }
      .info-row { flex-direction: column; }
      .info-label { min-width: auto; margin-bottom: 5px; }
      .property-features { grid-template-columns: repeat(2, 1fr); }
      .footer div[style*="display: flex"] { flex-direction: column; text-align: center; }
      .footer img[style*="border-radius"] { margin-right: 0; margin-bottom: 15px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://realtorpooya.ca/icon.png" alt="Pooya Pirayeshakbari Real Estate" style="max-height: 50px; height: auto;" />
    </div>
    
    <div class="content">
      <div class="sold-banner">
        <div class="celebration-emoji">🎉</div>
        <div class="sold-title">SOLD!</div>
        <div class="sold-subtitle">Another Successful Sale</div>
      </div>

      <div class="property-section">
        <h3 style="color: #aa9578; margin-bottom: 20px; text-align: center; font-size: 20px;">🏠 Property Details</h3>
        <div class="info-row">
          <div class="info-label">Address:</div>
          <div class="info-value" style="font-weight: 600; font-size: 18px;">${propertyDetails.address}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Location:</div>
          <div class="info-value" style="font-weight: 600;">${propertyDetails.city}, ${propertyDetails.province}</div>
        </div>
        
        ${propertyDetails.bedrooms || propertyDetails.bathrooms || propertyDetails.squareFeet ? `
        <div class="property-features">
          ${propertyDetails.bedrooms ? `
          <div class="feature-card">
            <div class="feature-number">${propertyDetails.bedrooms}</div>
            <div class="feature-label">Bedrooms</div>
          </div>
          ` : ''}
          ${propertyDetails.bathrooms ? `
          <div class="feature-card">
            <div class="feature-number">${propertyDetails.bathrooms}</div>
            <div class="feature-label">Bathrooms</div>
          </div>
          ` : ''}
          ${propertyDetails.squareFeet ? `
          <div class="feature-card">
            <div class="feature-number">${propertyDetails.squareFeet.toLocaleString()}</div>
            <div class="feature-label">Sq Ft</div>
          </div>
          ` : ''}
        </div>
        ` : ''}
        
        ${propertyDetails.heroImage ? `
        <div style="text-align: center; margin-top: 15px;">
          <img src="${propertyDetails.heroImage}" alt="Sold Property" class="property-image" />
        </div>
        ` : ''}
      </div>

      <div class="price-section">
        <h3 style="color: #aa9578; margin-bottom: 20px; font-size: 20px;">💰 Final Sale Price</h3>
        
        ${showOriginalPrice && originalPrice && overAskingAmount > 0 ? `
        <div class="original-price">Original Price: $${originalPrice.toLocaleString()}</div>
        <div class="over-asking">$${overAskingAmount.toLocaleString()} Over Asking! (+${overAskingPercentage}%)</div>
        <div style="margin: 15px 0;"></div>
        ` : ''}
        
        <div class="sold-price">$${soldPrice.toLocaleString()}</div>
        
        <div style="color: #8a7a63; font-size: 16px; font-style: italic;">
          ${overAskingAmount > 0 && showOriginalPrice ? 
            'Sold above asking price!' : 
            'Successfully closed!'
          }
        </div>
      </div>

      <div class="celebration">
        <div class="celebration-text">🏆 Another Satisfied Client!</div>
        <div style="color: #8a7a63; font-size: 16px; line-height: 1.6;">
          Thank you for trusting us with your real estate journey. 
          <br>Your success is our success!
        </div>
      </div>
      
      <div class="timestamp">Sale completed: ${submittedAt}</div>
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
      
      <div style="color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 15px;">
        Ready to sell your property? Let's achieve your real estate goals together!
      </div>
    </div>
    
    <div style="background: white; padding: 20px; text-align: center;">
      <img src="https://realtorpooya.ca/images/lepage.png" alt="Royal LePage Your Community Realty" style="max-height: 40px; height: auto;" />
    </div>
  </div>
</body>
</html>
  `
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      propertyDetails, 
      soldPrice, 
      originalPrice, 
      showOriginalPrice = false 
    } = body

    // Validate required fields
    if (!propertyDetails || !soldPrice) {
      return NextResponse.json(
        { error: 'Property details and sold price are required' },
        { status: 400 }
      )
    }

    // Validate property details
    if (!propertyDetails.address || !propertyDetails.city || !propertyDetails.province) {
      return NextResponse.json(
        { error: 'Property address, city, and province are required' },
        { status: 400 }
      )
    }

    const submittedAt = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })

    // Format the email content with HTML template
    const emailSubject = `🎉 SOLD! ${propertyDetails.address} - Another Successful Sale`
    const emailContent = createSoldNotificationEmailHTML({
      propertyDetails,
      soldPrice,
      originalPrice,
      showOriginalPrice,
      submittedAt
    })

    // Send email notification using Resend
    try {
      console.log('=== SENDING SOLD PROPERTY NOTIFICATION EMAIL ===')
      console.log('To:', process.env.EMAIL_TO || 'sold@realtorpooya.ca')
      console.log('Property:', propertyDetails.address)
      console.log('Sold Price:', soldPrice)

      const emailPayload = {
        from: process.env.EMAIL_FROM || 'noreply@mail.realtorpooya.ca',
        to: [process.env.EMAIL_TO || 'sold@realtorpooya.ca'],
        subject: emailSubject,
        html: emailContent,
      }

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
        console.error('FAILED to send sold notification email!')
        // Continue with success response even if email fails
      }

    } catch (emailError) {
      console.error('Email service error:', emailError)
      // Continue with success response even if email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Sold notification processed successfully',
      soldPrice,
      overAsking: originalPrice && soldPrice > originalPrice ? soldPrice - originalPrice : 0
    })

  } catch (error) {
    console.error('Error processing sold notification:', error)
    return NextResponse.json(
      { error: 'Failed to process sold notification' },
      { status: 500 }
    )
  }
}