import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/leaves`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch leave applications")
    }

    const leaves = await response.json()
    return NextResponse.json(leaves)
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch leave applications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const leaveData = await request.json()
    
    console.log("Creating leave application:", leaveData)

    const response = await fetch(`${API_BASE_URL}/leaves`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leaveData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Backend error:", errorText)
      throw new Error(`Failed to create leave application: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json({ 
      message: "Failed to create leave application", 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
