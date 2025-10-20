// Test API without Prisma client
const testAPI = async () => {
  try {
    console.log('Testing events API...')
    
    const response = await fetch('http://localhost:3000/api/events')
    console.log('Response status:', response.status)
    
    if (response.ok) {
      const events = await response.json()
      console.log('Events found:', events.length)
      console.log('First event:', events[0])
    } else {
      const error = await response.text()
      console.log('Error response:', error)
    }
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testAPI()
