// Detailed test to check Prisma client and events
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPrismaClient() {
  try {
    console.log('Testing Prisma client...')
    
    // Check if prisma.event exists
    console.log('prisma.event exists:', !!prisma.event)
    console.log('Available models:', Object.keys(prisma))
    
    if (prisma.event) {
      console.log('Testing events query...')
      const events = await prisma.event.findMany()
      console.log('Events found:', events.length)
      console.log('First event:', events[0])
    } else {
      console.log('Event model not available in Prisma client')
    }
    
  } catch (error) {
    console.error('Prisma test error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testPrismaClient()
