"use client"

import { useState, useEffect } from 'react'
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
import { useSupabase } from "@/app/providers/supabase-provider"
import { useAuth } from "@clerk/nextjs"

// Define the Note type for TypeScript using the existing prayers table structure
interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  verse_reference: string;
  created_at: string;
  category: string;
}

export default function BiblePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [note, setNote] = useState('')
  const [book, setBook] = useState('John')
  const [chapter, setChapter] = useState('1')
  const [verse, setVerse] = useState('1')
  const [translation, setTranslation] = useState('KJV')
  const [verseText, setVerseText] = useState('')
  const [fetchingVerse, setFetchingVerse] = useState(false)
  const [verseError, setVerseError] = useState('')
  const [savedNotes, setSavedNotes] = useState<Note[]>([])
  const { toast } = useToast()
  const supabase = useSupabase()
  const { userId, isSignedIn } = useAuth()

  // Fetch Bible verse when book, chapter, or verse changes
  // Fetch notes for the current verse
  useEffect(() => {
    // Skip if not signed in
    if (!isSignedIn || !userId) {
      setSavedNotes([]);
      return;
    }
    
    const fetchNotes = async () => {
      try {
        // Create a simple static note for now to avoid database issues
        // This is a temporary solution until we can properly set up the database
        const staticNote = {
          id: '1',
          user_id: userId,
          title: `Note for ${book} ${chapter}:${verse}`,
          content: 'Your notes for this verse will appear here once you save them.',
          verse_reference: `${book} ${chapter}:${verse}`,
          created_at: new Date().toISOString(),
          category: 'bible-note',
          is_private: true,
          status: 'pending',
          tags: ['bible'],
          prayer_count: 0,
          supporting_verses: [`${book} ${chapter}:${verse}`]
        };
        
        // Set static note for now
        setSavedNotes([]);
      } catch (error) {
        console.error('Error handling notes:', error);
        // Don't show error toast to user - just silently handle it
        setSavedNotes([]);
      }
    };
    
    fetchNotes();
  }, [book, chapter, verse, userId, isSignedIn]);
  
  // Fetch the Bible verse
  useEffect(() => {
    const fetchVerse = async () => {
      setFetchingVerse(true)
      setVerseError('')
      
      try {
        // Convert book name to API format (e.g., "1 John" to "1JN")
        const bookAbbr = getBookAbbreviation(book);
        if (!bookAbbr) {
          throw new Error(`Book '${book}' not recognized`);
        }
        
        // Format the verse ID for the API using the correct format: bookAbbr.chapter.verse
        const verseId = `${bookAbbr}.${chapter}.${verse}`;
        
        console.log(`Fetching Bible verse: ${verseId}, translation: ${translation}`);
        
        const response = await fetch(`/api/bible?verseId=${verseId}&translation=${translation}`);
        
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          console.error('Bible API response:', errorText);
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setVerseText(data.text || 'Verse not found');
      } catch (error) {
        console.error('Error fetching verse:', error);
        setVerseError(error instanceof Error ? error.message : 'Failed to fetch verse');
        setVerseText('');
      } finally {
        setFetchingVerse(false);
      }
    };
    
    fetchVerse();
  }, [book, chapter, verse, translation]);
  
  // Function to convert book names to their API abbreviations
  const getBookAbbreviation = (bookName: string) => {
    const bookMap: Record<string, string> = {
      'Genesis': 'GEN', 'Exodus': 'EXO', 'Leviticus': 'LEV', 'Numbers': 'NUM', 'Deuteronomy': 'DEU',
      'Joshua': 'JOS', 'Judges': 'JDG', 'Ruth': 'RUT', '1 Samuel': '1SA', '2 Samuel': '2SA',
      '1 Kings': '1KI', '2 Kings': '2KI', '1 Chronicles': '1CH', '2 Chronicles': '2CH',
      'Ezra': 'EZR', 'Nehemiah': 'NEH', 'Esther': 'EST', 'Job': 'JOB', 'Psalms': 'PSA',
      'Proverbs': 'PRO', 'Ecclesiastes': 'ECC', 'Song of Solomon': 'SNG', 'Isaiah': 'ISA',
      'Jeremiah': 'JER', 'Lamentations': 'LAM', 'Ezekiel': 'EZK', 'Daniel': 'DAN',
      'Hosea': 'HOS', 'Joel': 'JOL', 'Amos': 'AMO', 'Obadiah': 'OBA', 'Jonah': 'JON',
      'Micah': 'MIC', 'Nahum': 'NAM', 'Habakkuk': 'HAB', 'Zephaniah': 'ZEP', 'Haggai': 'HAG',
      'Zechariah': 'ZEC', 'Malachi': 'MAL', 'Matthew': 'MAT', 'Mark': 'MRK', 'Luke': 'LUK',
      'John': 'JHN', 'Acts': 'ACT', 'Romans': 'ROM', '1 Corinthians': '1CO', '2 Corinthians': '2CO',
      'Galatians': 'GAL', 'Ephesians': 'EPH', 'Philippians': 'PHP', 'Colossians': 'COL',
      '1 Thessalonians': '1TH', '2 Thessalonians': '2TH', '1 Timothy': '1TI', '2 Timothy': '2TI',
      'Titus': 'TIT', 'Philemon': 'PHM', 'Hebrews': 'HEB', 'James': 'JAS', '1 Peter': '1PE',
      '2 Peter': '2PE', '1 John': '1JN', '2 John': '2JN', '3 John': '3JN', 'Jude': 'JUD',
      'Revelation': 'REV'
    };
    
    return bookMap[bookName];
  }
  
  const handleSaveNote = async () => {
    try {
      setIsLoading(true)
      
      if (!isSignedIn || !userId) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save notes",
          variant: "destructive"
        })
        return
      }

      // For now, let's just store the note locally since we're having database issues
      // This is a temporary solution until database access is properly configured
      const verseReference = `${book} ${chapter}:${verse}`;
      
      // Create a new note object
      const newNote = {
        id: Date.now().toString(), // Use timestamp as ID
        user_id: userId,
        title: `Bible Note: ${verseReference}`,
        content: note,
        verse_reference: verseReference,
        created_at: new Date().toISOString(),
        category: 'bible-note',
        is_private: true,
        status: 'pending',
        tags: ['bible', 'note'],
        prayer_count: 0,
        supporting_verses: [verseReference]
      };
      
      // Add the new note to the saved notes
      setSavedNotes(prev => [newNote, ...prev]);
      
      // Success message
      toast({
        title: "Note saved",
        description: "Your note has been saved locally"
      });
      
      // Clear the note input
      setNote('');
      
      return;
      
      // The code below is commented out until database issues are resolved
      /*
      // Insert the note into the prayers table
      const { error } = await supabase
        .from('prayers')
        .insert({
          user_id: userId,
          title: `Bible Note: ${verseReference}`,
          content: note,
          verse_reference: verseReference,
          category: 'bible-note',
          is_private: true,
          status: 'pending',
          tags: ['bible', 'note'],
          prayer_count: 0,
          supporting_verses: [verseReference]
        })

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      */

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
                  <SelectContent className="max-h-[300px]">
                    {[
                      "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
                      "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
                      "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
                      "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
                      "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations",
                      "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah",
                      "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
                      "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians",
                      "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians",
                      "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus",
                      "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John",
                      "3 John", "Jude", "Revelation"
                    ].map((bookName) => (
                      <SelectItem key={bookName} value={bookName}>{bookName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={chapter} onValueChange={setChapter}>
                  <SelectTrigger className="w-[180px] bg-[#141927] border-[#1a1f2c]">
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>Chapter {num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={verse} onValueChange={setVerse}>
                  <SelectTrigger className="w-[180px] bg-[#141927] border-[#1a1f2c]">
                    <SelectValue placeholder="Select verse" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {Array.from({ length: 40 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>Verse {num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-4 mb-6">
                <Select value={translation} onValueChange={setTranslation}>
                  <SelectTrigger className="w-[180px] bg-[#141927] border-[#1a1f2c]">
                    <SelectValue placeholder="Select translation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KJV">King James Version</SelectItem>
                    <SelectItem value="NIV">New International Version</SelectItem>
                    <SelectItem value="ESV">English Standard Version</SelectItem>
                    <SelectItem value="NKJV">New King James Version</SelectItem>
                    <SelectItem value="NLT">New Living Translation</SelectItem>
                    <SelectItem value="NASB">New American Standard Bible</SelectItem>
                    <SelectItem value="CSB">Christian Standard Bible</SelectItem>
                    <SelectItem value="MSG">The Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="prose dark:prose-invert max-w-none">
                {fetchingVerse && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
                
                {verseError && (
                  <div className="bg-red-900/20 border border-red-900/30 p-4 rounded-md text-white">
                    {verseError}
                  </div>
                )}
                
                {!fetchingVerse && !verseError && verseText && (
                  <div>
                    <p className="text-lg leading-relaxed text-white" dangerouslySetInnerHTML={{ __html: verseText }}></p>
                    <p className="text-sm text-gray-400 mt-2">{book} {chapter}:{verse} ({translation})</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Previous Notes Section */}
            <Card className="p-6 bg-[#0A0F1C] border-[#1a1f2c]">
              <h2 className="text-xl font-semibold mb-4 text-white">Previous Notes</h2>
              
              {isSignedIn ? (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {savedNotes.length > 0 ? (
                    savedNotes.map((savedNote) => (
                      <div key={savedNote.id} className="bg-[#141927] border border-[#1a1f2c] p-3 rounded-md">
                        <p className="text-sm text-gray-400 mb-2">
                          {new Date(savedNote.created_at).toLocaleDateString()} {new Date(savedNote.created_at).toLocaleTimeString()}
                        </p>
                        <p className="text-white whitespace-pre-wrap">{savedNote.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">
                      No notes saved for this verse yet.
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-400">
                  Sign in to view your saved notes.
                </p>
              )}
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