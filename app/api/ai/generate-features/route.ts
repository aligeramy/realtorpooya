import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

export async function POST(request: NextRequest) {
  try {
    const { 
      description, 
      bedrooms, 
      bathrooms, 
      square_feet, 
      year_built, 
      property_type, 
      address, 
      city, 
      price 
    } = await request.json()

    if (!description && !bedrooms && !bathrooms) {
      return NextResponse.json(
        { error: 'At least description or property details are required' },
        { status: 400 }
      )
    }

    // If OpenAI is not configured, return fallback response
    if (!openai) {
      return NextResponse.json({
        success: true,
        features: ['Property Available'],
        tags: ['Real Estate'],
        fallback: true,
        error: 'OpenAI API key not configured'
      })
    }

    const propertyInfo = `
Property Details:
- Address: ${address || 'Not specified'}
- City: ${city || 'Not specified'}
- Type: ${property_type || 'Not specified'}
- Bedrooms: ${bedrooms || 'Not specified'}
- Bathrooms: ${bathrooms || 'Not specified'}
- Square Feet: ${square_feet || 'Not specified'}
- Year Built: ${year_built || 'Not specified'}
- Price: ${price ? `$${price}` : 'Not specified'}

Description:
${description || 'No description provided'}
    `.trim()

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a real estate expert. Analyze the property information and generate relevant features and tags. 

IMPORTANT: Return ONLY a valid JSON object with this exact structure:
{
  "features": ["feature1", "feature2", ...],
  "tags": ["tag1", "tag2", ...]
}

Features should be specific property amenities, characteristics, or selling points (e.g., "Hardwood Floors", "Granite Countertops", "Walk-in Closet", "Central Air", "Fireplace", "Stainless Steel Appliances").

Tags should be broader categorizations or keywords for searchability (e.g., "Luxury", "Modern", "Family-Friendly", "Investment", "Waterfront", "Downtown", "Renovated").

Generate 5-15 features and 3-8 tags. Be specific and realistic based on the property details provided.`
        },
        {
          role: "user",
          content: propertyInfo
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const responseText = completion.choices[0]?.message?.content?.trim()
    
    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    let aiResponse
    try {
      aiResponse = JSON.parse(responseText)
    } catch (parseError) {
      // If JSON parsing fails, try to extract features and tags from text
      console.error('Failed to parse AI response as JSON:', responseText)
      
      // Fallback: extract features and tags from text response
      const features = []
      const tags = []
      
      const lines = responseText.split('\n')
      let currentSection = null
      
      for (const line of lines) {
        const cleanLine = line.trim()
        if (cleanLine.toLowerCase().includes('feature')) {
          currentSection = 'features'
        } else if (cleanLine.toLowerCase().includes('tag')) {
          currentSection = 'tags'
        } else if (cleanLine.startsWith('-') || cleanLine.startsWith('•')) {
          const item = cleanLine.substring(1).trim()
          if (currentSection === 'features') {
            features.push(item)
          } else if (currentSection === 'tags') {
            tags.push(item)
          }
        }
      }
      
      aiResponse = { features, tags }
    }

    // Validate the response structure
    if (!aiResponse.features || !Array.isArray(aiResponse.features)) {
      aiResponse.features = []
    }
    if (!aiResponse.tags || !Array.isArray(aiResponse.tags)) {
      aiResponse.tags = []
    }

    // Clean and filter the arrays
    aiResponse.features = aiResponse.features
      .filter((f: any) => typeof f === 'string' && f.trim().length > 0)
      .map((f: any) => f.trim())
      .slice(0, 15) // Limit to 15 features

    aiResponse.tags = aiResponse.tags
      .filter((t: any) => typeof t === 'string' && t.trim().length > 0)
      .map((t: any) => t.trim())
      .slice(0, 8) // Limit to 8 tags

    return NextResponse.json({
      success: true,
      features: aiResponse.features,
      tags: aiResponse.tags
    })

  } catch (error) {
    console.error('AI feature generation error:', error)
    
    // Return basic fallback features and tags
    const fallbackFeatures = ['Property Available']
    const fallbackTags = ['Real Estate']

    return NextResponse.json({
      success: true,
      features: fallbackFeatures,
      tags: fallbackTags,
      fallback: true,
      error: 'AI generation failed, using fallback features'
    })
  }
} 