export default function AdminPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '2rem',
          height: '2rem',
          border: '2px solid #e5e7eb',
          borderTop: '2px solid #000',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        <p style={{ color: '#6b7280' }}>Loading...</p>
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `
        }} />
        <script dangerouslySetInnerHTML={{
          __html: `
            // Client-side redirect logic
            document.addEventListener('DOMContentLoaded', function() {
              const adminData = localStorage.getItem('admin');
              const adminToken = localStorage.getItem('adminToken');
              
              if (!adminData || !adminToken) {
                window.location.href = '/admin/login';
              } else {
                window.location.href = '/admin/dashboard';
              }
            });
          `
        }} />
      </div>
    </div>
  )
}
