"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" style={{ width: '2.5rem', height: '2.5rem' }}>
        <Sun style={{ height: '1.25rem', width: '1.25rem' }} />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      style={{ width: '2.5rem', height: '2.5rem' }}
    >
      {theme === "light" ? (
        <Moon style={{ height: '1.25rem', width: '1.25rem' }} />
      ) : (
        <Sun style={{ height: '1.25rem', width: '1.25rem' }} />
      )}
    </Button>
  )
}
