"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@clerk/nextjs"

interface Note {
  id: string
  verse_reference: string
  content: string
  created_at: string
}

export function BibleNotes({ verseReference }: { verseReference: string }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const { userId } = useAuth()

  useEffect(() => {
    if (!userId || !verseReference) return

    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from('bible_notes')
        .select('*')
        .eq('user_id', userId)
        .eq('verse_reference', verseReference)
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
  }, [verseReference, userId, supabase, toast])

  const saveNote = async () => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to save notes"
      })
      return
    }

    if (!newNote.trim()) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('bible_notes')
        .insert([
          {
            user_id: userId,
            verse_reference: verseReference,
            content: newNote.trim(),
          }
        ])
        .select()
        .single()

      if (error) throw error

      setNotes([data, ...notes])
      setNewNote("")
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
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(note.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              </Card>
            ))}
          </div>
        </ScrollArea>
        <div className="space-y-2">
          <Textarea
            placeholder="Add a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <Button 
            onClick={saveNote} 
            className="w-full"
            disabled={isLoading || !newNote.trim()}
          >
            {isLoading ? "Saving..." : "Save Note"}
          </Button>
        </div>
      </div>
    </Card>
  )
} 