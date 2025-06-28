import { parse } from "date-fns"

// Utility function to parse date strings like "Sunday, 21st March 2025"
function parseEventDate(dateString: string): Date {
  try {
    // Remove the day of week and ordinal suffixes
    const cleanDate = dateString
      .replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s/, '')
      .replace(/(\d+)(st|nd|rd|th)/, '$1')
    
    return parse(cleanDate, 'd MMMM yyyy', new Date())
  } catch (error) {
    console.warn(`Could not parse date: ${dateString}`)
    return new Date()
  }
}

// Event interface for type safety
export interface Event {
  id?: string
  title: string
  type: string
  date: string
  time: string
  location: string
  imageUrl: string
  description: string
  parsedDate?: Date
}

// Shared events data
const FEATURED_EVENTS_DATA: Event[] = [
  {
    id: "alive-music-experience-2025",
    title: "Alive Music Experience",
    type: "Special Event",
    date: "Sunday, 21st March 2025",
    time: "08:00 AM",
    location: "Main Sanctuary",
    imageUrl: "/events/ALIVE MUSIC EXPIRIENCE COTH.jpg",
    description: "Celebrate the resurrection of Christ with special music and activities.",
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
    id: "Young Ministers Confrence-2025",
    title: "Young Ministers Confrence",
    type: "Conference",
    date: "Saturday, 28th June 2025",
    time: "07:00 AM",
    location: "Main Sanctuary",
    imageUrl: "events/MINISTERS CONFERENCE.jpg",
    description: "Join us for a powerful time of worship and the Word.",
  },
  {
    id: "Jason Dedication",
    title: "Jason Dedication",
    type: "Child-dedication",
    date: "Sunday, 13th July 2025",
    time: "03:00 PM",
    location: "Main Sanctuary",
    imageUrl: "events/JASON'S DEDICATION 2.jpg",
    description: "Join us for a powerful time of worship and the Word.",
  }
]

// Sort events by date (most recent upcoming events first)
export const FEATURED_EVENTS = FEATURED_EVENTS_DATA
  .map(event => ({
    ...event,
    parsedDate: parseEventDate(event.date)
  }))
  .sort((a, b) => a.parsedDate!.getTime() - b.parsedDate!.getTime())

// Get a limited number of events for homepage display
export const getHomePageEvents = (limit: number = 3) => {
  return FEATURED_EVENTS.slice(0, limit)
} 