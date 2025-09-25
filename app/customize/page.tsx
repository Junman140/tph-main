"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, User, ImageIcon, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DPBannerCustomizer() {
  const [userName, setUserName] = useState("")
  const [userImage, setUserImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUserImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const generateBanner = useCallback(async () => {
    if (!canvasRef.current || !userImage || !userName.trim()) return

    setIsGenerating(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match the template
    canvas.width = 1080
    canvas.height = 1350

    try {
      // Load the template image
      const templateImg = new Image()
      templateImg.crossOrigin = "anonymous"

      await new Promise((resolve, reject) => {
        templateImg.onload = resolve
        templateImg.onerror = reject
        templateImg.src = "/banner.jpg"
      })

      // Draw the template
      ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height)

      // Load and draw user image in the center area
      const userImg = new Image()
      userImg.crossOrigin = "anonymous"

      await new Promise((resolve, reject) => {
        userImg.onload = resolve
        userImg.onerror = reject
        userImg.src = userImage
      })

      const imageX = 240
      const imageY = 260
      const imageWidth = 600
      const imageHeight = 750

      // Create a rounded rectangle clipping path for the photo area only
      ctx.save()
      ctx.beginPath()

      // Manual rounded rectangle path for better browser compatibility
      const radius = 20
      ctx.moveTo(imageX + radius, imageY)
      ctx.lineTo(imageX + imageWidth - radius, imageY)
      ctx.quadraticCurveTo(imageX + imageWidth, imageY, imageX + imageWidth, imageY + radius)
      ctx.lineTo(imageX + imageWidth, imageY + imageHeight - radius)
      ctx.quadraticCurveTo(
        imageX + imageWidth,
        imageY + imageHeight,
        imageX + imageWidth - radius,
        imageY + imageHeight,
      )
      ctx.lineTo(imageX + radius, imageY + imageHeight)
      ctx.quadraticCurveTo(imageX, imageY + imageHeight, imageX, imageY + imageHeight - radius)
      ctx.lineTo(imageX, imageY + radius)
      ctx.quadraticCurveTo(imageX, imageY, imageX + radius, imageY)
      ctx.closePath()
      ctx.clip()

      // Calculate aspect ratio and draw image to fit within the photo frame
      const imgAspect = userImg.width / userImg.height
      const targetAspect = imageWidth / imageHeight

      let drawWidth, drawHeight, drawX, drawY

      if (imgAspect > targetAspect) {
        // Image is wider, fit to height
        drawHeight = imageHeight
        drawWidth = drawHeight * imgAspect
        drawX = imageX - (drawWidth - imageWidth) / 2
        drawY = imageY
      } else {
        // Image is taller, fit to width
        drawWidth = imageWidth
        drawHeight = drawWidth / imgAspect
        drawX = imageX
        drawY = imageY - (drawHeight - imageHeight) / 2
      }

      ctx.drawImage(userImg, drawX, drawY, drawWidth, drawHeight)
      ctx.restore()

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 44px Arial, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const textY = 1120
      ctx.fillText(userName.toUpperCase(), canvas.width / 2, textY)
    } catch (error) {
      console.error("Error generating banner:", error)
    } finally {
      setIsGenerating(false)
    }
  }, [userImage, userName])

  useEffect(() => {
    if (userImage && userName.trim()) {
      generateBanner()
    }
  }, [userImage, userName, generateBanner])

  const downloadBanner = useCallback(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const link = document.createElement("a")
    link.download = `${userName || "my"}-tph-global.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }, [userName])

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>

      <div className="p-4">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          {/* Header */}
          <div className="mt-16 md:mt-24 text-center space-y-4">
            <h1 className="text-2xl md:text-4xl font-bold text-foreground">Create Your Personalized DP Banner</h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Upload your photo, add your name, and download your custom Young Africa Works banner
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {/* Controls */}
            <div className="space-y-6">
              {/* Photo Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <ImageIcon className="w-5 h-5" />
                    Upload Your Photo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    onClick={triggerFileInput}
                    className="border-2 border-dashed border-border rounded-lg p-6 md:p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  >
                    {userImage ? (
                      <div className="space-y-4">
                        <img
                          src={userImage || "/placeholder.svg"}
                          alt="Uploaded"
                          className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg mx-auto"
                        />
                        <p className="text-sm text-muted-foreground">Click to change photo</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto" />
                        <div>
                          <p className="text-base md:text-lg font-medium">Click to upload your photo</p>
                          <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    placeholder="Upload your photo"
                    title="Upload your photo"
                  />
                </CardContent>
              </Card>

              {/* Name Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <User className="w-5 h-5" />
                    Enter Your Name
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Your full name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="text-base md:text-lg"
                    maxLength={30}
                  />
                  <p className="text-sm text-muted-foreground mt-2">{userName.length}/30 characters</p>
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      className="w-full max-w-sm md:max-w-md mx-auto border border-border rounded-lg"
                      style={{ aspectRatio: "1080/1350" }}
                    />
                    {(!userImage || !userName.trim()) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
                        <p className="text-muted-foreground text-center text-sm md:text-base px-4">
                          Upload a photo and enter your name to see preview
                        </p>
                      </div>
                    )}
                  </div>

                  {userImage && userName.trim() && (
                    <Button
                      onClick={downloadBanner}
                      className="w-full mt-4 bg-lime-500 hover:bg-blue-600 text-black font-semibold"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Banner
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
