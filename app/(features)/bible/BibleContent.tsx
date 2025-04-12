'use client'

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Share2, BookOpen, Search } from "lucide-react"

const BOOKS = [
  { name: "Genesis", abbr: "GEN" },
  { name: "Exodus", abbr: "EXO" },
  { name: "Leviticus", abbr: "LEV" },
  { name: "Numbers", abbr: "NUM" },
  { name: "Deuteronomy", abbr: "DEU" },
  { name: "Joshua", abbr: "JOS" },
  { name: "Judges", abbr: "JDG" },
  { name: "Ruth", abbr: "RUT" },
  { name: "1 Samuel", abbr: "1SA" },
  { name: "2 Samuel", abbr: "2SA" },
  { name: "1 Kings", abbr: "1KI" },
  { name: "2 Kings", abbr: "2KI" },
  { name: "1 Chronicles", abbr: "1CH" },
  { name: "2 Chronicles", abbr: "2CH" },
  { name: "Ezra", abbr: "EZR" },
  { name: "Nehemiah", abbr: "NEH" },
  { name: "Esther", abbr: "EST" },
  { name: "Job", abbr: "JOB" },
  { name: "Psalms", abbr: "PSA" },
  { name: "Proverbs", abbr: "PRO" },
  { name: "Ecclesiastes", abbr: "ECC" },
  { name: "Song of Solomon", abbr: "SNG" },
  { name: "Isaiah", abbr: "ISA" },
  { name: "Jeremiah", abbr: "JER" },
  { name: "Lamentations", abbr: "LAM" },
  { name: "Ezekiel", abbr: "EZK" },
  { name: "Daniel", abbr: "DAN" },
  { name: "Hosea", abbr: "HOS" },
  { name: "Joel", abbr: "JOL" },
  { name: "Amos", abbr: "AMO" },
  { name: "Obadiah", abbr: "OBA" },
  { name: "Jonah", abbr: "JON" },
  { name: "Micah", abbr: "MIC" },
  { name: "Nahum", abbr: "NAM" },
  { name: "Habakkuk", abbr: "HAB" },
  { name: "Zephaniah", abbr: "ZEP" },
  { name: "Haggai", abbr: "HAG" },
  { name: "Zechariah", abbr: "ZEC" },
  { name: "Malachi", abbr: "MAL" },
  { name: "Matthew", abbr: "MAT" },
  { name: "Mark", abbr: "MRK" },
  { name: "Luke", abbr: "LUK" },
  { name: "John", abbr: "JHN" },
  { name: "Acts", abbr: "ACT" },
  { name: "Romans", abbr: "ROM" },
  { name: "1 Corinthians", abbr: "1CO" },
  { name: "2 Corinthians", abbr: "2CO" },
  { name: "Galatians", abbr: "GAL" },
  { name: "Ephesians", abbr: "EPH" },
  { name: "Philippians", abbr: "PHP" },
  { name: "Colossians", abbr: "COL" },
  { name: "1 Thessalonians", abbr: "1TH" },
  { name: "2 Thessalonians", abbr: "2TH" },
  { name: "1 Timothy", abbr: "1TI" },
  { name: "2 Timothy", abbr: "2TI" },
  { name: "Titus", abbr: "TIT" },
  { name: "Philemon", abbr: "PHM" },
  { name: "Hebrews", abbr: "HEB" },
  { name: "James", abbr: "JAS" },
  { name: "1 Peter", abbr: "1PE" },
  { name: "2 Peter", abbr: "2PE" },
  { name: "1 John", abbr: "1JN" },
  { name: "2 John", abbr: "2JN" },
  { name: "3 John", abbr: "3JN" },
  { name: "Jude", abbr: "JUD" },
  { name: "Revelation", abbr: "REV" }
]

const TRANSLATIONS = [
  { id: "KJV", name: "King James Version" },
  { id: "NIV", name: "New International Version" },
  { id: "ESV", name: "English Standard Version" },
  { id: "NKJV", name: "New King James Version" },
  { id: "NLT", name: "New Living Translation" },
  { id: "NASB", name: "New American Standard Bible" },
  { id: "CSB", name: "Christian Standard Bible" },
  { id: "MSG", name: "The Message" },
]

export default function BibleContent() {
  const searchParams = useSearchParams()
  const [book, setBook] = useState(searchParams.get("book") || "John")
  const [chapter, setChapter] = useState(searchParams.get("chapter") || "1")
  const [verse, setVerse] = useState(searchParams.get("verse") || "1")
  const [translation, setTranslation] = useState(searchParams.get("translation") || "KJV")
  const [verseText, setVerseText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchVerse = async () => {
      setLoading(true)
      setError("")
      try {
        const selectedBook = BOOKS.find(b => b.name === book)
        if (!selectedBook) {
          throw new Error("Invalid book selected")
        }
        const verseId = `${selectedBook.abbr}.${chapter}.${verse}`
        const response = await fetch(`/api/bible?verseId=${verseId}&translation=${translation}`)
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        setVerseText(data.text)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch verse")
      } finally {
        setLoading(false)
      }
    }

    fetchVerse()
  }, [book, chapter, verse, translation])

  const shareVerse = () => {
    const text = `${verseText} - ${book} ${chapter}:${verse} (${translation})`
    const url = window.location.href
    if (navigator.share) {
      navigator.share({
        title: "Bible Verse",
        text,
        url,
      })
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`)
      alert("Verse copied to clipboard!")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Select value={book} onValueChange={setBook}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select book" />
            </SelectTrigger>
            <SelectContent>
              {BOOKS.map((book) => (
                <SelectItem key={book.name} value={book.name}>
                  {book.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Input
              type="number"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder="Chapter"
              className="w-24"
            />
            <Input
              type="number"
              value={verse}
              onChange={(e) => setVerse(e.target.value)}
              placeholder="Verse"
              className="w-24"
            />
          </div>

          <Select value={translation} onValueChange={setTranslation}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select translation" />
            </SelectTrigger>
            <SelectContent>
              {TRANSLATIONS.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={shareVerse} variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="text-2xl font-serif leading-relaxed mb-4">
              {verseText}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {book} {chapter}:{verse} ({translation})
            </div>
          </div>
        )}
      </div>
    </div>
  )
}