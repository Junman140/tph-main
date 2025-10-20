export default function GlobalError() {
  return (
    <html>
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Something went wrong</h1>
            <p style={{ color: '#6b7280' }}>An unexpected error occurred. Please try again.</p>
          </div>
        </div>
      </body>
    </html>
  )
}


