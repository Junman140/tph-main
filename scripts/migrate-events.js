const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Function to parse date strings like "Sunday, 21st March 2025"
function parseEventDate(dateStr) {
  try {
    // Remove day of week and ordinal suffixes
    const cleanDate = dateStr
      .replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s*/, '')
      .replace(/(\d+)(st|nd|rd|th)/, '$1');
    
    return new Date(cleanDate);
  } catch (error) {
    console.error('Error parsing date:', dateStr, error);
    return new Date(); // fallback to current date
  }
}

// Hardcoded events data
const HARDCODED_EVENTS = [
  {
    id: "season-of-still-waters",
    title: "Shepherd School Awareness Service",
    description: "Join us for a powerful time of worship and the Word.",
    date: "Sunday, 13th July 2025",
    time: "08:00 AM",
    location: "Main Sanctuary",
    imageUrl: "/events/STILL WATERS.jpg",
    altText: "Shepherd School Awareness Service",
    type: "Conference",
    isActive: true,
    maxRegistrations: null,
    driveLink: null
  },
  {
    id: "jason-dedication",
    title: "Jason Dedication",
    description: "Join us for a powerful time of worship and the Word.",
    date: "Sunday, 13th July 2025",
    time: "03:00 PM",
    location: "Main Sanctuary",
    imageUrl: "/events/JASON'S DEDICATION 2.jpg",
    altText: "Jason Dedication",
    type: "Child-dedication",
    isActive: true,
    maxRegistrations: null,
    driveLink: null
  },
  {
    id: "young-ministers-conference-2025",
    title: "Young Ministers Conference",
    description: "Join us for a powerful time of worship and the Word.",
    date: "Saturday, 28th September 2025",
    time: "07:00 AM",
    location: "Main Sanctuary",
    imageUrl: "/events/MINISTERS CONFERENCE.jpg",
    altText: "Young Ministers Conference",
    type: "Conference",
    isActive: true,
    maxRegistrations: null,
    driveLink: null
  },
  {
    id: "women-of-substance-2025",
    title: "Women Of Substance",
    description: "Join us for a powerful time of worship and the Word.",
    date: "Sunday, 13th April 2025",
    time: "08:00 AM",
    location: "Main Sanctuary",
    imageUrl: "/events/woman of substance 2025B.jpg",
    altText: "Women Of Substance",
    type: "Conference",
    isActive: true,
    maxRegistrations: null,
    driveLink: null
  },
  {
    id: "dominion-2025-system",
    title: "Dominion 2025 System",
    description: "Three days of inspiration, worship, and community for believers.",
    date: "Sunday, 13th May 2025",
    time: "08:00 AM",
    location: "Main Sanctuary",
    imageUrl: "/events/DOMINION 2025 SYSTEM.jpg",
    altText: "Dominion 2025 System",
    type: "Conference",
    isActive: true,
    maxRegistrations: null,
    driveLink: null
  },
  {
    id: "alive-music-experience-2025",
    title: "Alive Music Experience",
    description: "Celebrate the resurrection of Christ with special music and activities.",
    date: "Sunday, 21st March 2025",
    time: "08:00 AM",
    location: "Main Sanctuary",
    imageUrl: "/events/ALIVE MUSIC EXPIRIENCE COTH.jpg",
    altText: "Alive Music Experience",
    type: "Special Event",
    isActive: true,
    maxRegistrations: null,
    driveLink: null
  }
];

async function migrateEvents() {
  try {
    console.log('Starting events migration...');
    
    // Check if events already exist
    const existingEvents = await prisma.event.count();
    if (existingEvents > 0) {
      console.log(`${existingEvents} events already exist in database. Skipping migration.`);
      return;
    }

    // Create events in database
    for (const eventData of HARDCODED_EVENTS) {
      const parsedDate = parseEventDate(eventData.date);
      
      const event = await prisma.event.create({
        data: {
          title: eventData.title,
          description: eventData.description,
          date: parsedDate,
          location: eventData.location,
          imageUrl: eventData.imageUrl,
          altText: eventData.altText,
          isActive: eventData.isActive,
          maxRegistrations: eventData.maxRegistrations,
          driveLink: eventData.driveLink,
          registrationFormFields: {
            type: eventData.type,
            time: eventData.time
          }
        },
      });

      console.log(`Created event: ${event.title} (ID: ${event.id})`);
    }

    console.log('Events migration completed successfully!');
    console.log(`Migrated ${HARDCODED_EVENTS.length} events to database.`);
    
  } catch (error) {
    console.error('Error migrating events:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateEvents();
