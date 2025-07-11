import { parse, format } from "date-fns"

export interface Event {
  id: string
  title: string
  type: string
  date: string
  time: string
  location: string
  imageUrl: string
  description: string
  parsedDate?: Date
}

export const ALL_EVENTS: Event[] = [
  {
    id: "Season of Still Waters",
    title: "Shepherd School Awareness Service",
    type: "Conference",
    date: "Sunday, 13th July 2025",
    time: "08:00 AM",
    location: "Main Sanctuary",
    imageUrl: "/events/STILL WATERS.jpg",
    description: "Join us for a powerful time of worship and the Word.",
  },
  {
    id: "Jason Dedication",
    title: "Jason Dedication",
    type: "Child-dedication",
    date: "Sunday, 13th July 2025",
    time: "03:00 PM",
    location: "Main Sanctuary",
    imageUrl: "/events/JASON'S DEDICATION 2.jpg",
    description: "Join us for a powerful time of worship and the Word.",
  },
  {
    id: "Young Ministers Confrence-2025",
    title: "Young Ministers Confrence",
    type: "Conference",
    date: "Saturday, 28th June 2025",
    time: "07:00 AM",
    location: "Main Sanctuary",
    imageUrl: "/events/MINISTERS CONFERENCE.jpg",
    description: "Join us for a powerful time of worship and the Word.",
  },
  {
    id: "women-of-substance-2025",
    title: "Women Of Substance",
    type: "Conference",
    date: "Sunday, 13th April 2025",
    time: "08:00 AM",
    location: "Main Sanctuary",
    imageUrl: "/events/woman of substance 2025B.jpg",
    description: "Join us for a powerful time of worship and the Word.",
  },
  {
    id: "dominion-2025-system",
    title: "Dominion 2025 System",
    type: "Conference",
    date: "Sunday, 13th May 2025",
    time: "08:00 AM",
    location: "Main Sanctuary",
    imageUrl: "/events/DOMINION 2025 SYSTEM.jpg",
    description: "Three days of inspiration, worship, and community for believers.",
  },
  {
    id: "alive-music-experience-2025",
    title: "Alive Music Experience",
    type: "Special Event",
    date: "Sunday, 21st March 2025",
    time: "08:00 AM",
    location: "Main Sanctuary",
    imageUrl: "/events/ALIVE MUSIC EXPIRIENCE COTH.jpg",
    description: "Celebrate the resurrection of Christ with special music and activities.",
  }
]

// Function to parse date strings like "Sunday, 21st March 2025"
function parseEventDate(dateStr: string): Date {
  try {
    // Remove ordinal indicators (st, nd, rd, th) and parse
    const cleanDateStr = dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1')
    return parse(cleanDateStr, "EEEE, do MMMM yyyy", new Date())
  } catch (error) {
    console.error(`Error parsing date: ${dateStr}`, error)
    return new Date()
  }
}

// Function to get sorted events (most recent first)
export function getSortedEvents(): Event[] {
  return ALL_EVENTS
    .map(event => ({
      ...event,
      parsedDate: parseEventDate(event.date)
    }))
    .sort((a, b) => {
      if (!a.parsedDate || !b.parsedDate) return 0
      return a.parsedDate.getTime() - b.parsedDate.getTime()
    })
}

// Function to get upcoming events (events from today onwards)
export function getUpcomingEvents(): Event[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return getSortedEvents().filter(event => {
    if (!event.parsedDate) return false
    return event.parsedDate >= today
  })
}

// Function to get featured events for homepage (first 3 upcoming events)
export function getFeaturedEvents(): Event[] {
  return getUpcomingEvents().slice(0, 3)
} 