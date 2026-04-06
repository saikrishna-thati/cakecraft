import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import crypto from 'crypto'

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const uploadedFiles: { url: string; type: string; name: string }[] = []

    for (const file of files) {
      // Validate file type
      const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
      const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)
      
      if (!isImage && !isVideo) {
        return NextResponse.json({ 
          error: `File type "${file.type}" not supported. Use JPG, PNG, GIF, WebP, SVG, MP4, WebM, or MOV.` 
        }, { status: 400 })
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ 
          error: `File "${file.name}" exceeds 10MB limit.` 
        }, { status: 400 })
      }

      // Generate unique filename
      const ext = path.extname(file.name) || (isImage ? '.jpg' : '.mp4')
      const uniqueName = `${crypto.randomBytes(16).toString('hex')}${ext}`
      const subDir = isVideo ? 'videos' : 'images'
      const fullDir = path.join(uploadDir, subDir)
      
      if (!existsSync(fullDir)) {
        await mkdir(fullDir, { recursive: true })
      }

      const filePath = path.join(fullDir, uniqueName)
      const bytes = await file.arrayBuffer()
      await writeFile(filePath, Buffer.from(bytes))

      const publicUrl = `/uploads/${subDir}/${uniqueName}`
      uploadedFiles.push({
        url: publicUrl,
        type: isVideo ? 'video' : 'image',
        name: file.name,
      })
    }

    return NextResponse.json({ files: uploadedFiles })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('path')
    
    if (!filePath) {
      return NextResponse.json({ error: 'No file path provided' }, { status: 400 })
    }

    // Only allow deleting from uploads directory for security
    if (!filePath.startsWith('/uploads/')) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }

    const fullPath = path.join(process.cwd(), 'public', filePath)
    const fs = await import('fs/promises')
    
    try {
      await fs.unlink(fullPath)
      return NextResponse.json({ success: true })
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}
