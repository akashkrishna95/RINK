import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    // Navigate from the Next.js folder to your backend data folder
    const filePath = join(process.cwd(), '..', 'rink-ai-backend', 'data', 'technologies.json')
    const fileContents = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(fileContents)

    return NextResponse.json({ 
      success: true, 
      count: data.length,
      technologies: data 
    })
  } catch (error) {
    console.error("Cache read error:", error)
    return NextResponse.json({ error: 'Could not load technologies' }, { status: 500 })
  }
}
