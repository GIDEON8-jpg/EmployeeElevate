import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const statusData = await request.json()
    
    console.log("Updating leave status:", { id: params.id, statusData })

    const response = await fetch(`${API_BASE_URL}/leaves/${params.id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(statusData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Backend error:", errorText)
      throw new Error(`Failed to update leave status: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json({ 
      message: "Failed to update leave status", 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
