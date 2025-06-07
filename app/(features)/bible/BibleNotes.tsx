"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"

interface Note {
  id: string
  verse_reference: string
  content: string
  created_at: string
  name: string
}

export function BibleNotes({ verseReference }: { verseReference: string }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")
  const [noteName, setNoteName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    if (!verseReference) return

    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from('bible_notes')
        .select('*')
        .eq('verse_reference', verseReference)
        .eq('is_public', true) // Only get public notes
        .order('created_at', { ascending: false })

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching notes",
          description: error.message
        })
        return
      }

      setNotes(data || [])
    }

    fetchNotes()
  }, [verseReference, supabase, toast])

  const saveNote = async () => {
    if (!newNote.trim() || !noteName.trim()) {
      toast({
        variant: "destructive",
        title: "Required fields missing",
        description: "Please provide your name and note content"
      })
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('bible_notes')
        .insert([
          {
            user_id: 'anonymous', // Anonymous user for public site
            verse_reference: verseReference,
            content: newNote.trim(),
            name: noteName.trim(),
            is_public: true // All notes are public in public site
          }
        ])
        .select()
        .single()

      if (error) throw error

      setNotes([data, ...notes])
      setNewNote("")
      setNoteName("")
      toast({
        title: "Note saved",
        description: "Your note has been saved successfully"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error saving note",
        description: error instanceof Error ? error.message : "Failed to save note"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="h-full p-4">
      <div className="flex flex-col h-full gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Notes</h2>
          <p className="text-sm text-muted-foreground">{verseReference}</p>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-4">
            {notes.map((note) => (
              <Card key={note.id} className="p-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">{note.name || 'Anonymous'}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(note.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              </Card>
            ))}
          </div>
        </ScrollArea>
        <div className="space-y-2">
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={noteName}
                onChange={(e) => setNoteName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="note">Your Note</Label>
              <Textarea
                id="note"
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
            <Button 
              onClick={saveNote} 
              className="w-full"
              disabled={isLoading || !newNote.trim() || !noteName.trim()}
            >
              {isLoading ? "Saving..." : "Share Note"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}