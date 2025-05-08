'use client';

import { useEffect, useState } from 'react';

export function AuthErrorFallback() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the fallback after a short delay to avoid flashing
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 md:left-auto md:right-4 bg-amber-50 border border-amber-200 text-amber-800 p-3 sm:p-4 rounded-md shadow-md w-[calc(100%-2rem)] max-w-md mx-auto md:mx-0">
      <h3 className="font-medium mb-1 text-sm sm:text-base">Authentication Notice</h3>
      <p className="text-xs sm:text-sm">
        We're experiencing some connectivity issues with our authentication service. 
        You can continue browsing, but some features may be limited.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-2 text-xs bg-amber-100 hover:bg-amber-200 px-2 sm:px-3 py-1 rounded-md transition-colors w-full sm:w-auto"
      >
        Refresh Page
      </button>
    </div>
  );
}
