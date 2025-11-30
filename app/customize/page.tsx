"use client"

export const dynamic = "force-dynamic"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, User, ImageIcon } from "lucide-react"
import NextImage from "next/image"

export default function DPBannerCustomizer() {
  const [userName, setUserName] = useState("")
  const [userImage, setUserImage] = useState<string | null>(null)
  // removed unused isGenerating state
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

    // start generation
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
        templateImg.src = "/fresh-fire-template.jpg"
      })

      // Draw the template
      ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height)

      // Load and draw user image in the white square area (upper right quadrant)
      const userImg = new Image()
      userImg.crossOrigin = "anonymous"

      await new Promise((resolve, reject) => {
        userImg.onload = resolve
        userImg.onerror = reject
        userImg.src = userImage
      })

      // White square (card container) position - exactly matching the white square in template
      // Template white square: top-left at X=590, Y=130, Width=440, Height=560
      const cardX = 590
      const cardY = 300
      const cardWidth = 440
      const cardHeight = 590

      // Card padding - creates border effect around the image
      const cardPadding = 12
      
      // Image area inside the card (with padding)
      const imageX = cardX + cardPadding
      const imageY = cardY + cardPadding
      const imageWidth = cardWidth - (cardPadding * 2)
      const imageHeight = cardHeight - (cardPadding * 2)

      // Draw subtle shadow for the card (gives depth)
      ctx.save()
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'
      ctx.shadowBlur = 15
      ctx.shadowOffsetX = 4
      ctx.shadowOffsetY = 4
      
      // Draw card background (white)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(cardX, cardY, cardWidth, cardHeight)
      ctx.restore()

      // Draw a subtle border around the card
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.lineWidth = 1
      ctx.strokeRect(cardX, cardY, cardWidth, cardHeight)

      // Clip to the image area inside the card
      ctx.save()
      ctx.beginPath()
      ctx.rect(imageX, imageY, imageWidth, imageHeight)
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

      // Draw name in the white brush stroke area below CONFIRMED
      // Brush stroke visual center: X=320, Y=730 (extends X=90-550, Y=690-770)
      ctx.fillStyle = "#3d2817" // Dark brown color to match template
      ctx.font = "bold 48px Arial, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      
      const textX = 320
      const textY = 750
      ctx.fillText(userName.toUpperCase(), textX, textY)
    } catch (error) {
      console.error("Error generating banner:", error)
    } finally {
      // end generation
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
            <h1 className="text-2xl md:text-4xl font-bold text-foreground">Create Your Personalized FRESH FIRE Banner</h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Upload your photo, add your name, and download your custom FRESH FIRE event banner
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
                        <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto">
                          <NextImage src={userImage || "/placeholder.svg"} alt="Uploaded" fill className="object-cover rounded-lg" />
                        </div>
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
                      className="w-full max-w-sm md:max-w-md mx-auto border border-border rounded-lg [aspect-ratio:1080/1350]"
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
                      className="w-full mt-4 bg-lime-500 hover:bg-blue-500 text-black font-semibold"
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
