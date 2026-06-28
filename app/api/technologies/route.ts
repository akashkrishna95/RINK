import { NextResponse } from 'next/server';
// Three dots takes us exactly from route.ts -> technologies -> api -> app -> root!
import technologiesData from '../../../data/technologies.json';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      count: technologiesData.length,
      technologies: technologiesData
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Could not load technologies' }, { status: 500 });
  }
}