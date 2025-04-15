"use client"

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"

export default function BiblePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [note, setNote] = useState('')
  const [book, setBook] = useState('John')
  const [chapter, setChapter] = useState('1')
  const [verse, setVerse] = useState('1')
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const handleSaveNote = async () => {
    try {
      setIsLoading(true)
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save notes",
          variant: "destructive"
        })
        return
      }

      const { error } = await supabase
        .from('bible_notes')
        .insert({
          user_id: user.id,
          book,
          chapter: parseInt(chapter),
          verse: parseInt(verse),
          note
        })

      if (error) throw error

      toast({
        title: "Success!",
        description: "Your note has been saved",
      })

      setNote('')

    } catch (error) {
      console.error('Error saving note:', error)
      toast({
        title: "Error",
        description: "Failed to save your note. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex-1 pt-16">
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bible Reader Section */}
          <div className="space-y-6">
            <Card className="p-6 bg-[#0A0F1C] border-[#1a1f2c]">
              <h1 className="text-2xl font-bold mb-4 text-white">Bible Reader</h1>
              <div className="flex flex-wrap gap-4 mb-6">
                <Select value={book} onValueChange={setBook}>
                  <SelectTrigger className="w-[180px] bg-[#141927] border-[#1a1f2c]">
                    <SelectValue placeholder="Select book" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="John">John</SelectItem>
                    {/* Add more books */}
                  </SelectContent>
                </Select>

                <Select value={chapter} onValueChange={setChapter}>
                  <SelectTrigger className="w-[180px] bg-[#141927] border-[#1a1f2c]">
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Chapter 1</SelectItem>
                    {/* Add more chapters */}
                  </SelectContent>
                </Select>

                <Select value={verse} onValueChange={setVerse}>
                  <SelectTrigger className="w-[180px] bg-[#141927] border-[#1a1f2c]">
                    <SelectValue placeholder="Select verse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Verse 1</SelectItem>
                    {/* Add more verses */}
                  </SelectContent>
                </Select>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-white">
                  In the beginning was the Word, and the Word was with God, and the Word was God.
                </p>
              </div>
            </Card>

            {/* Previous Notes Section */}
            <Card className="p-6 bg-[#0A0F1C] border-[#1a1f2c]">
              <h2 className="text-xl font-semibold mb-4 text-white">Previous Notes</h2>
              <p className="text-gray-400">
                Your saved notes will appear here.
              </p>
            </Card>
          </div>

          {/* Notes Section */}
          <div className="space-y-6">
            <Card className="p-6 bg-[#0A0F1C] border-[#1a1f2c]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Notes</h2>
                <span className="text-sm text-gray-400">
                  {book} {chapter}:{verse}
                </span>
              </div>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write your notes here..."
                className="min-h-[200px] mb-4 bg-[#141927] border-[#1a1f2c] text-white placeholder:text-gray-400"
              />
              <Button 
                onClick={handleSaveNote} 
                disabled={isLoading || !note.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? "Saving..." : "Save Note"}
              </Button>
            </Card>

            {/* Study Resources */}
            <Card className="p-6 bg-[#0A0F1C] border-[#1a1f2c]">
              <h2 className="text-xl font-semibold mb-4 text-white">Study Resources</h2>
              <p className="text-gray-400">
                Additional study materials and commentaries will appear here.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
} 