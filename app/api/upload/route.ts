import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    const folder = searchParams.get('folder') || 'properties'

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 })
    }

    if (!request.body) {
      return NextResponse.json({ error: 'File data is required' }, { status: 400 })
    }

    // Generate a unique filename to prevent conflicts
    const timestamp = Date.now()
    const uniqueFilename = `${folder}/${timestamp}-${filename}`

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, request.body, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return NextResponse.json({
      url: blob.url,
      filename: uniqueFilename,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 