// Simple test script to check if events API is working
const testEventsAPI = async () => {
  try {
    console.log('Testing events API...')
    
    const response = await fetch('http://localhost:3000/api/events')
    console.log('Response status:', response.status)
    
    if (response.ok) {
      const events = await response.json()
      console.log('Events found:', events.length)
      console.log('Events:', events)
    } else {
      const error = await response.text()
      console.log('Error:', error)
    }
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testEventsAPI()
