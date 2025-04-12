import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.size > 500 * 1024) { // 500KB
      return NextResponse.json({ error: "File size must be less than 500KB" }, { status: 400 })
    }

    // Here you would typically upload the file to a storage service
    // For now, we'll just return a mock URL
    const url = `https://api.dicebear.com/7.x/initials/svg?seed=${file.name}`

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
} 