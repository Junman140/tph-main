import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gallery - TPH Global",
  description: "View our gallery of church events and activities",
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 